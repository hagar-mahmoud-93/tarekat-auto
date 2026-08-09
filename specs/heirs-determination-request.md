# Heirs determination request (إصدار حصر الورثة) — area map

Covers the beneficiary-facing "إصدار حصر الورثة" (heirs-determination / estate-inheritance
enumeration) service under الخدمات الإلكترونية: a Nafath-authenticated beneficiary starts a new
حصر الورثة request, fills in applicant/deceased/witness data, submits it, and confirms it shows up
in الطلبات ("My orders"). Existing coverage: `tests/online-services/heirs-determination-request.spec.ts`
(single end-to-end happy path, tag `@inheritance-request`). Use this doc to extend that flow or add
new cases along the same shape rather than re-deriving the wizard from scratch.

## Prerequisites

- `NAFATH_USERNAME`/`NAFATH_PASSWORD` env vars — the test `test.skip()`s the "Nafath login" step
  (and everything after it, since the rest of the flow needs an authenticated session) if unset.
  Defaults live in `config/env.ts::env.nafath`.
- No admin seeder/`ADMIN_USERNAME`/`ADMIN_PASSWORD` needed for this flow (unlike cash/investment
  division — see `specs/cash-division.md`) — the deceased/heir/witness data instead comes from the
  Tawtheeq mock seeder (below), not the Django inheritance seeder.

## Seeding fresh case data (`GenerateSeedDataClient`, `api/clients/generate-seed-data.client.ts`)

Unlike the division flows, this test does **not** seed an inheritance case in the app's own
backend first — the beneficiary starts a request from scratch through the UI. What it *does* need
seeded ahead of time is the **deceased + witness identity data** in Tawtheeq (the external
registry the app verifies IDs against), via `TAWTHEEQ_BASE_URL`'s `/api/seeder/tawtheeq` mock
endpoint (`env.tawtheeq.baseURL`, default `https://preprod-mocks.azm-dev.com`):

- `generateSeedDataClient.seed()` builds one payload with a **fresh random identity** (id +
  identityNumber + identityType, `1` or `2`) for the deceased and both witnesses on every call
  (`randomIdentity()` / `randomId()`), while the beneficiary/heir identity numbers are fixed
  (`1059608891`, matching `env.nafath.username`/`password` default — the Nafath-logged-in user
  *is* the seeded beneficiary/heir).
- Returns `{ response, deceasedIdentity, deceasedBirthDateHijri, beneficiaryRelationshipType,
  firstWitness, secondWitness }` — the test asserts `response.ok()` then threads these values
  through the wizard's بيانات المورّث / بيانات الشاهد الأول / بيانات الشاهد الثاني steps.
- The generated `request.requestNumber` (`QA-SEED-{randomId}`) is only used as the seed's
  `_name`/idempotency handle internally — it is **not** the طلب حصر الورثة رقم the UI later
  generates for the submitted request; don't confuse the two.

### Cleanup (`generateSeedDataClient.deleteSeed`)

Last step of the spec: `DELETE {TAWTHEEQ_BASE_URL}/api/seeder/seeds/{requestNumber}`, where
`requestNumber` here is the **submitted طلب حصر الورثة رقم** read off the confirmation popup (see
"Request preview" below), not the seed's own `_name`. Confirmed this is the correct handle for the
seeder's cleanup endpoint against `preprod-mocks.azm-dev.com` — asserts `response.ok()`. Extend
this pattern (rather than leaving seeded state to accumulate) for any new case added to this spec.

## Full happy-path flow

All steps run on a single beneficiary `page`/tab (no multi-tab heir/admin coordination like the
division flows).

1. **Seed Tawtheeq data** — see above.
2. **Nafath login** (`steps/nafath-login.ts::nafathLogin`) — `LoginPage.goto()` →
   `/login`, `loginWithNafath(username, password)` clicks the Nafath login link, fills
   username/password, submits; asserts the page navigates away from `/login`.
3. **Open الخدمات الإلكترونية** — `MainNavPage.openOnlineServices()` (side menu); asserts URL
   `/online-services`.
4. **Open service details for إصدار حصر الورثة** — `OnlineServicesPage.viewServiceDetails(cardHeading)`
   clicks that card's "عرض التفاصيل"-style button; asserts URL
   `/online-services/heirs-determination-service`.
5. **Start the service** — `ServiceDetailsPage.startService()`; asserts URL
   `/online-services/add-heirs-select-service`.
6. **Select إصدار وثيقة حصر ورثة جديدة** — `ServiceSelectionPage.selectCard(cardTitle)` clicks that
   card's arrow button; asserts URL `/online-services/terms-and-conditions`.
7. **Agree to الإقرار terms** — `TermsAndConditionsPage.agree()`; asserts URL
   `/online-services/heirs-determination` (entering the wizard proper).
8. **بيانات مقدم الطلب (applicant data)** — `ApplicantDataPage`:
   - `selectRelationToInheritor('أصالة عن نفسه')` — opens صفة مقدم الطلب dropdown, picks "on one's
     own behalf" (vs. وكالة/agency, unautomated here).
   - `fillMobileNumber(randomMobileNumber())` — a fresh random `056xxxxxxx` per run (see the
     spec's own `randomMobileNumber()` helper; distinct from witness phone numbers, which come
     from the Tawtheeq seed).
   - `selectPreviousDocumentExists('لا')` — answers "هل توجد وثيقة حصر ورثة سابقة للمتوفى؟"; the
     radio's visual box covers the actual input, so the click is forced (`{ force: true }`).
   - **Save and continue** (`WizardNavPage.saveAndContinue()`) ×2 to get past the مراجعة (review)
     sub-step, landing on بيانات الوفاة.
9. **بيانات المورّث (deceased data)** — `DeceasedDataPage`:
   - `fillIdNumber(deceasedIdentity.identityNumber)`,
     `selectIdTypeForIdentityType(deceasedIdentity.identityType)` (نوع الهوية: هوية وطنية for
     type `1`, إقامة for type `2`), `fillBirthDateHijri(deceasedBirthDateHijri)`.
   - `uploadFamilyRegister()` / `uploadDeathCertificate()` — both accept a 1×1 placeholder PNG
     (`PLACEHOLDER_PNG_BASE64`) to satisfy the pdf/jpg/jpeg/png/bmp attachment requirement; real
     content isn't validated.
   - `verify()` — تحقق against Tawtheeq using the seeded deceased identity.
   - `isRelationshipDropdownEnabled()` — إضافة صلة قرابة مع المورث may auto-fill and disable
     (`p-disabled` class) after تحقق succeeds, or stay editable; the spec only calls
     `selectRelationship(beneficiaryRelationshipType)` when it's still enabled.
   - **Save and continue** ×2 to reach احسب عدد الورثة.
10. **تحديد الورثة (heirs selection)** — `HeirsSelectionPage`:
    - `selectNoForAllQuestions()` — the ~44-field form mounts asynchronously; the page object
      waits for the last field's label ("الأخوة والأخوات الأشقاء") to render before clicking any
      "لا" radio, otherwise early clicks land before Vue's handlers are wired and silently no-op.
    - `fillAllCountsWithZero()` then `fillLivingSonsCount('1')` — one living son, everything else
      zero.
    - `calculateHeirsCount()` — احسب عدد الورثة; asserts "عدد الورثة المحتسب" appears and logs
      `getHeirsCountText()`.
    - **Save and continue** to reach أقرُّ بصحة قائمة الورثة.
11. **قائمة الورثة acknowledgement** — `HeirsListPage.acknowledgeHeirsList()`: waits out the
    step's loading overlay first (`waitForLoadingOverlayToDisappear`), since it can still cover
    the checkbox when the checkbox itself first becomes visible, then force-clicks it. Followed by
    **Save and continue**; asserts بيانات الشاهد الأول appears.
12. **بيانات الشاهد الأول / الثاني (witness data, ×2)** — `WitnessDataPage`, once per witness
    (`firstWitness` then `secondWitness` from the Tawtheeq seed):
    - `selectAnyRelationToDeceased()` — opens صلة قرابة الشاهد بالمورث (a virtual-scrolling list
      of ~90 options) and clicks whichever option is already rendered first; keyboard selection
      (ArrowDown+Enter) highlights but doesn't commit a value in this component, so it must be a
      real click. Presses `Escape` afterward since the panel doesn't reliably auto-close and can
      intercept the next click.
    - `fillMobileNumber(witness.phoneNumber)`,
      `selectIdTypeForIdentityType(witness.identityType)`, `fillIdNumber(witness.identityNumber)`,
      `fillBirthDateHijri(witness.birthDateHijri)` — filling the birth date opens a تاريخ الميلاد
      calendar popup that likewise stays open and must be dismissed with `Escape`.
    - `verify()` — تحقق for that witness.
    - After both witnesses: **Save and continue** — حفظ ومتابعة stays disabled for ~1s after the
      second تحقق while the backend finishes validating the witness asynchronously;
      `saveAndContinue()`'s click retries until it's enabled (see the inline comment on that call
      in the spec). Asserts معاينة نموذج الطلب appears.
13. **Submit the request** — one more `saveAndContinue()` from the معاينة (preview) step, which
    submits the whole request.
14. **Request preview / confirmation** — `RequestPreviewPage`:
    - `closeLoadingPopup()` — dismisses the transient loading popup shown while submission
      processes.
    - `getSubmittedRequestNumber()` — reads طلب حصر الورثة رقم off the success confirmation text
      via the pattern `رقم:\s*(\S+)`; throws if the text doesn't match (confirmation copy changed
      or submission failed silently). This value becomes `requestNumber`, used both for the
      الطلبات search below and the Tawtheeq seed cleanup.
    - `viewRequestDetails()` — opens the request; asserts the "تم تقديم طلب حصر الورثة رقم..."
      banner is no longer visible (confirms navigation away from the confirmation screen).
15. **Search الطلبات ("My orders")** — `MainNavPage.openMyOrders()`; asserts URL `/my-orders`.
    `MyOrdersPage.search(requestNumber)` fills the search box and waits for its loading spinner to
    hide; asserts `requestNumberResult(requestNumber)` (the رقم الطلب value in a matching result
    card) is visible.
16. **Delete the seed** — see Cleanup above.

## Page objects / locators

Follows the repo-wide page-object convention (`CLAUDE.md`): one page object per screen, each with
its own locator class.

- `pages/heirs-determination-pages/` + `locators/heirs-determination-locators/` — one file pair
  per wizard screen: `applicant-data`, `deceased-data`, `heirs-selection`, `heirs-list`,
  `witness-data`, `request-preview`, `wizard-nav` (the shared حفظ ومتابعة control used across every
  step), plus `terms-and-conditions` (moved here since it's only consumed by this flow, despite
  living next to the CRM Help Center's locators earlier in this area's history).
- `pages/online-services-pages/` + `locators/online-services-locators/` — the services catalog
  screens leading into the wizard: `online-services` (catalog listing), `service-details`,
  `service-selection`.
- `pages/common-pages/` + `locators/common-locators/` — cross-cutting shell pieces used by every
  flow, not just this one: `login`, `main-nav`, `my-orders`.
- `pages/admin-pages/` — `admin-login`, `seeder` — **not** used by this flow (only by the division
  flows' Django-admin-driven seeding); listed here only to explain why they *aren't* imported by
  this spec despite living under `pages/`.

## Known quirks (see inline comments in the page objects for the authoritative wording)

- **تحديد الورثة (heirs selection)** — must wait for the last field to render before interacting
  with any earlier field, or the click silently no-ops.
- **قائمة الورثة acknowledgement** — must wait out the step's loading overlay before clicking the
  checkbox, or the click lands on the overlay.
- **witness صلة قرابة الشاهد بالمورث** — must be a real click, not keyboard selection; the dropdown
  panel needs an explicit `Escape` to avoid intercepting the next click.
- **witness تاريخ الميلاد** — filling it opens a calendar popup that needs an explicit `Escape`.
- **حفظ ومتابعة after witness تحقق** — stays disabled for ~1s while the backend asynchronously
  finishes validating; the page object's click retries rather than asserting enabled-state first.
- **إضافة صلة قرابة مع المورث (deceased relationship)** — may or may not auto-fill/disable after
  تحقق depending on the case; check `isRelationshipDropdownEnabled()` before deciding whether to
  fill it.

## Adding a new case — checklist

1. If the new case needs different deceased/witness identity shapes than "one fresh random
   identity per role, per run", extend `GenerateSeedDataClient.seed()`'s payload rather than
   hardcoding values in the spec.
2. If it's a variant of the same happy path (e.g. صفة مقدم الطلب = وكالة/agency, or "نعم" for a
   previous حصر ورثة document), copy `tests/online-services/heirs-determination-request.spec.ts`
   and adjust the relevant `test.step`s — the wizard's screen sequence and `WizardNavPage.saveAndContinue()`
   calls between them stay the same.
3. Always end a new case the same way: read the submitted طلب حصر الورثة رقم from
   `RequestPreviewPage.getSubmittedRequestNumber()` and call
   `generateSeedDataClient.deleteSeed(requestNumber)` at the end, so seeded Tawtheeq state doesn't
   accumulate across runs.
4. If `NAFATH_USERNAME`/`NAFATH_PASSWORD` need to differ from the seeded beneficiary/heir identity
   (`1059608891` by default), keep them in sync — the Nafath-logged-in user's identity number is
   what the seed treats as the beneficiary/heir.
