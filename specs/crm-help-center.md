# CRM / المساعدة (Help Center) area — exploration notes

Explored live via `playwright-cli` against `https://ops-merath.web.azm-dev.com` (beneficiary portal)
and `https://ops-merath.api.azm-dev.com/admin/` (Django admin). Purpose: give future sessions the
lay of the land without re-exploring from scratch. Verify against the app before relying on any
specific ref/id/UUID here — snapshots are point-in-time.

## How to get a logged-in beneficiary session (no Nafath OTP needed)

1. `goto {ADMIN_API_URL}/inheritance_seeder/inheritanceseeder/seed/`, login with `ADMIN_USERNAME`/`ADMIN_PASSWORD`.
2. Click "⚙ Generate Random Data" then "Seed Case" — creates an inheritance case + heirs.
3. Result page lists heirs with a "Login as User" link per row — clicking it opens a **new tab**,
   already authenticated as that beneficiary on `ops-merath.web.azm-dev.com`.
4. This is exactly what `steps/data-preparation.ts` + `pages/seeder.page.ts` automate
   (`DataPreparation.seedCase()` → `SeederPage.loginAsBeneficiary()`).

## Beneficiary-facing Help Center (`/help`)

Nav link "المساعدة" → `/help`, heading "مركز المساعدة". Three cards:

| Card | Route | Notes |
|---|---|---|
| الأسئلة الشائعة (FAQ) | `/help/faq` | Static accordion, no backend calls. Category chips: عامة، التسجيل، المستخدمين، حصر الورثة، حصر التّركة، عامة، القسمة — these are plain non-interactive labels (`cursor: auto`), not filters. ~24 Q&A items covering platform usage, حصر الورثة requirements, القسمة الاتفاقية/القضائية, cash/investment division, وكالة, شهود, etc. Search box (accessible name "البحث في الأسئلة الشائعة") filters client-side with a short debounce; no-match shows "لم نعثر على أي أسئلة متعلقة" / "حاول استخدام كلمات أو صيغة مختلفة في البحث". Each question is a `button` that toggles `aria-expanded` and reveals a `region` (same accessible name as the button) with the answer. Content is entirely static (no per-user data), so it's asserted via **visual snapshot** rather than per-string text matching — see `FaqLocators.content()`. Automated in `tests/crm/faq.spec.ts`. |
| اتصل بنا (Contact us) | `/help/contact-us` | Static: phone 1950 (domestic), +966 9200 01950 (int'l), email 1950@moj.gov.sa (all rendered as `button`s — presumably copy-to-clipboard, but clipboard read is permission-gated so this isn't asserted in tests), hours أحد-خميس ٨ص-٢:١٥م, list of ناجز branch locations (جدة، الرياض، الدمام seen) each with a "الموقع" button that opens Google Maps in a **new tab**. No API calls. Automated in `tests/crm/contactUs.spec.ts`. |
| تذاكر الدعم (Support tickets) | `/help/complaints` | Ticket list with tabs "التذاكر الحالية" / "التذاكر المنتهية". Empty state: heading "لا يوجد تذاكر" + "لا توجد شكوى حالية". Button "إنشاء تذكرة" → `/help/complaints/create`. This is the one flow already automated in `tests/crm/submitTicket.spec.ts`. |

Occasionally on first `/help` visit (or after seeding), a "تحديث رقم الجوال" (update mobile
number) card appears requiring a mobile number before proceeding — handled by
`steps/fill-mobile-number.ts`.

### New ticket wizard (`/help/complaints/create`)

3 steps: **بيانات مقدم التذكرة** → **بيانات التذكرة** → **مراجعة بيانات التذكرة**.

- **Step 1**: applicant name + ID type are read-only, auto-populated by a
  `GET /api/v1/ticketing/verify-applicant/` call. This call is flaky/can be down — see "Known
  issue" below. Also asks: رقم الهوية (readonly), صفة مقدم التذكرة (combobox, default "أصالة عن
  نفسه" = self, vs. agency/وكالة), رقم الجوال (mobile, required). Continue button "حفظ ومتابعة"
  disabled until name populates. **رقم الجوال validation** (independent of verify-applicant, so
  testable even during the outage below): only digits are accepted (non-digits are silently
  stripped as typed), capped at 10 characters. On blur (field must be "touched" — a pristine
  untouched field shows no error): empty → "هذا الحقل مطلوب"; a 10-digit value not matching Saudi
  mobile format (05XXXXXXXX) → "الرقم المدخل غير صحيح" + a `border-red-500` class on the input;
  a valid `05XXXXXXXX` value clears both. Automated in `tests/crm/submitTicket.spec.ts`
  ("Applicant step validates the mobile number field").
- **Step 2**: ticket type radio (شكوى complaint / طلب request), مصنّف رئيسي (main category)
  combobox, مصنّف فرعي (sub category) combobox (depends on main category), تفاصيل المشكلة
  (free-text details textarea).
- **Step 3**: review + submit ("إرسال التذكرة" then confirm) → success dialog with ticket number,
  text pattern `تم تقديم رقم التذكرة 'NNNNNN' بنجاح`.

Clicking "حفظ ومتابعة" can re-trigger the same verify-applicant call and pop the error dialog again
— `NewTicketPage.clickSaveAndContinue()` retries this up to 5 times.

### ⚠️ Known issue observed during this exploration (2026-08-01)

`GET /api/v1/ticketing/verify-applicant/` consistently returned `503` (not just "intermittent").
Response body:
```json
{"code":503,"message":{"error":"SDK service error","details":"HTTPConnectionPool(host='api-test.moj.gov.local', port=9003): Max retries exceeded with url: /dynamicscrmexternalapis/api/v1/contacts/getContactByNationalId (Caused by NewConnectionError(...Connection refused...))"}}
```
This confirms **"CRM" here means Microsoft Dynamics CRM**, reached through an internal proxy at
`api-test.moj.gov.local:9003/dynamicscrmexternalapis/...`. At exploration time that host was
refusing connections — looks like an environment/infra outage in the test env, not app-level
flakiness. If ticket-creation tests are failing with a blank error dialog on step 1, check this
endpoint before assuming a test bug.

Still down as of a later session the same day (2026-08-01, ~14:00). Tried `page.route()`-mocking
the endpoint with two plausible response shapes (`{fullName, identityType}` and
`{code, data: {fullName, identityType}}`, the latter guessing an envelope from the 503 body's own
`{code, message}` shape) to unblock step 2/3 exploration — neither populated the اسم مقدم التذكرة
field, and the exact contract wasn't findable in the loaded JS bundles either.

By 2026-08-02 the endpoint had recovered enough to get past step 1 reliably (still occasionally
503s — `fillApplicantStep`'s reload-and-retry loop absorbs that), unblocking step 2 exploration:

### Step 2 (بيانات التذكرة) — category-dependent dynamic fields

Every category shows ticket type + main/sub category + **التفاصيل** (required, min 50 chars,
error text doubles as the always-visible hint below the field). Some categories' dynamic form
additionally requires **طلبات المستفيد** (same min-50 pattern) and/or a required **المرفقات**
file upload (pdf/jpg/jpeg/png/bmp) — confirmed via
`GET /api/v1/ticketing/dynamic-form/{form_id}?category_id={id}`, fetched after subcategory
selection. `خدمة قسمة التركة النقدية` / `تأخر تحويل المبالغ - اختبار` (the pair the submission
test uses) needs only التفاصيل — no طلبات المستفيد, no attachment — which is presumably why it
was picked as the "- اختبار" test subcategory. `خدمة حصر التركة` / `عدم صحة البيانات الواردة في
وثيقة حصر التركة` needs all of the above plus two more fields, **رقم هوية المتوفي** (deceased's
national ID) and **رقم وثيقة حصر الورثة** (heir-enumeration deed number) — both plain textboxes
with no accessible name, matched by their wrapper div like `applicantNameInput`.

Those two are validated by `POST /api/v1/ticketing/validate-inheritance/`
(`{deceased_social_id, heirs_determination_deed_number}` → `{code, result: {error}}`), fired only
once every other required field on the step already passes client-side validation (blur alone
does nothing). **Quirk as of this writing**: with both values made up, the response carries a
single error and the frontend renders that same message under *both* fields — see
`NewTicketLocators.deceasedIdError()`/`heirsDeedNumberError()`. Whether a valid deceased ID with
an invalid deed number produces two distinct messages is unconfirmed (would need the real seeded
deceased ID, which the seeder tab's Tawtheeq payload has as `deceased.identityNumber` but no test
currently threads through).

Automated in `tests/crm/submitTicket.spec.ts` ("Ticket details step validates the التفاصيل field"
and "...validates the deceased ID and heir-enumeration deed number fields") — both stop at the
step-2 error state and never advance to step 3, so they're unaffected by the verify-applicant
flakiness on submit.

**Step 3 (review) is still unexplored.**

## Admin/staff side (Django admin, `/admin/ticketing/`)

The actual data model backing تذاكر الدعم. Models seen:

- **Tickets** — id (uuid), status (choice, e.g. `created`), category, sub category, created_at,
  updated_at. Ticket detail (change) form additionally has: `crm_ticket_id` (the Dynamics CRM
  ticket id), `auth_user_national_id`, `profile_uuid`, `listing_status_ar/en/id`,
  `complaint_number` (numeric, matches the number shown in the beneficiary success dialog),
  `closing_note`, `is_cancelled_by_crm`, `is_agency` (labelled "Agent type in CRM" —
  أصالة عن نفسه vs. agency), `agency_client_name`, `creation_date`, `in_progress_date`,
  `returned_date`.
- **Categories** — `category_id` (a Dynamics CRM GUID for most rows, or a local slug like
  `req-cat-1001` for newer "Request" rows), name/name_ar, main_classification (`Complaint` or
  `Request`). ~53 rows at exploration time. Examples seen: خدمة قسمة التركة النقدية، خدمة قسمة
  التركة العقارية، خدمة قسمة التركة الاستثمارية، خدمة قسمة التركة بالتخارج، قسمة الأموال، مشاكل
  عامة، خدمة حصر الورثة، خدمة حصر التركة، طلب تعديل بيانات، طلب إعادة إصدار وثيقة. Full/current
  list: `{ADMIN_API_URL}/ticketing/category/`.
- **Sub Categories** — same shape, foreign-keyed to a Category. ~159 rows at exploration time.
  Full/current list: `{ADMIN_API_URL}/ticketing/subcategory/`.
- **Dynamic crm ticket details** / **Dynamic crm users** — presumably cached/synced data from the
  Dynamics CRM side; not opened in this pass.
- **Attachments**, **Ticket notes**, **Forms**, **Form configs**, **Settingss** — not opened in
  this pass.

Separate admin app **Support Dashboard** (`/admin/support_dashboard/`) has its own models: Blocked-
on-Heir Queue, Cash Support Dashboard, SLA Watchtower, Stuck Shares Queue. This looks like internal
ops/SLA tooling for case handlers rather than the ticketing/CRM flow itself — flagged here for
awareness, not explored further.

## Existing automation

- `tests/crm/submitTicket.spec.ts` — beneficiary submits a شكوى ticket about a delayed cash
  division transfer (category "خدمة قسمة التركة النقدية" / sub-category "تأخر تحويل المبالغ -
  اختبار") via `HelpPage` + `NewTicketPage`. Requires `ADMIN_USERNAME`/`ADMIN_PASSWORD` (test
  skips otherwise).
- `tests/crm/faq.spec.ts` — beneficiary searches the FAQ (match + no-match/empty-state) and
  expands a question, asserting each state via `toHaveScreenshot()` against `FaqPage.content()`
  rather than text matching (see FAQ row above). Baselines are platform-agnostic (no `{platform}`
  in `snapshotPathTemplate`), so they must come from the CI (ubuntu) run, not a local machine — a
  macOS-generated PNG won't match. First CI run with no baseline yet will generate one and fail
  once; download it from that run's `playwright-report-crm` artifact and commit it under
  `tests/crm/faq.spec.ts-snapshots/`.
- `tests/crm/contactUs.spec.ts` — beneficiary views contact details and opens each of the three
  ناجز branch locations (جدة، الرياض، الدمام), asserting all three open Google Maps in a new tab,
  via `HelpPage` + `ContactUsPage`.
- `tests/crm/submitTicket.spec.ts` also covers step 2 field validation without ever reaching step
  3: التفاصيل's required/min-50-char errors (category `خدمة قسمة التركة النقدية`), and the
  رقم هوية المتوفي/رقم وثيقة حصر الورثة "not found in system" errors (category `خدمة حصر
  التركة`) — see the "Step 2" section above for the categories' dynamic-field differences.
- Page objects: `pages/help.page.ts`, `pages/new-ticket.page.ts`, `pages/faq.page.ts`,
  `pages/contact-us.page.ts` — one per screen, each still with its own locator class
  (`HelpLocators`, `NewTicketLocators`, `FaqLocators`, `ContactUsLocators`). All four classes are
  co-located in a single `locators/help-center.locators.ts` since they belong to one small,
  tightly-coupled feature — grouping locators by feature area rather than one-file-per-screen
  avoids file sprawl for areas like this. Domains large enough to be a feature on their own (cash
  division, investment division, etc.) keep their existing one-file-per-page-object locators.
- Not yet automated: viewing/filtering an existing ticket in "التذاكر الحالية"/"التذاكر المنتهية",
  the "طلب" (request) ticket type, agency/وكالة applicant flow, and anything on the admin/staff
  side (Ticketing or Support Dashboard django admin apps).
- **Still blocked**: step 3 (review/submit) validation — verify-applicant/Dynamics-CRM
  connectivity recovered enough to reach and validate step 2 (see the "Step 2" section above), but
  the full submission test (`Beneficiary submits a new support ticket`) still intermittently times
  out clicking step 1's "حفظ ومتابعة" when that endpoint 503s at the wrong moment.
