# Profile (الملف الشخصي) — area map

Beneficiary-facing profile page at `/my-profile?type=profile`. Explored by logging in as a
seeded heir (`SeederPage.loginAsUser`, same mechanism as CRM help-center's "Login as User" —
see `specs/crm-help-center.md`) and clicking "الملف الشخصي" in the side nav. Existing coverage:
`tests/profile/profile.spec.ts` (basic data + mobile edit) and `tests/profile/bankAccount.spec.ts`
(bank account tab).

## First-time-heir redirect

A first-time heir login gets bounced to `/state-inventory-service/create-estate` (a "تقديم طلب
حصر ورثة جديد" dialog, unrelated to profile) on the *first* click of the nav link. Dismiss it via
its "إلغاء" button, then click "الملف الشخصي" again to land on the actual profile page. This is
already handled in `ProfileLocators.newUserEstateDialogCancelButton()` — but the cancel button can
get detached mid-click during the redirect's own navigation, so click it with a short timeout and
`.catch()` rather than letting it hang (the retry-on-detach loop can exceed the default 30s test
timeout otherwise).

## Page structure

A `complementary` side panel inside the page holds two tab buttons — this is the entire nav
between profile sections, no others exist:

- **"البيانات الأساسية"** (Basic Data, default tab) — read-only display fields: رقم الهوية
  (ID number), الاسم الأول/الثاني/الثالث/الأخير (first/middle/third/last name), تاريخ الميلاد
  (birth date), الجنس (gender), الجوال (mobile, the only editable field — pencil-icon button
  beside it opens an inline edit form with its own validation, `ProfileLocators.mobileFieldEditButton()`
  et al.). None of the other display fields (ID, names, birth date, gender) are exposed as
  locators yet since nothing currently exercises them — add on demand.
- **"بيانات الحساب البنكي"** (Bank Account) — starts empty: one IBAN textbox + "تحقق" (verify)
  button. A valid IBAN adds a bank account card marked "الحساب الأساسي" (primary account); no UI
  exists yet to add a *second* account or to remove one — only the single verify-and-add flow is
  covered by `bankAccount.spec.ts`.

No other profile sections (e.g. password/security, notifications) exist on this page as of this
exploration (2026-08-06).
