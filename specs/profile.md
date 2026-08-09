# Profile (الملف الشخصي) — area map

Beneficiary-facing profile page at `/my-profile?type=profile`. Explored by logging in as a
seeded heir (`SeederPage.loginAsUser`, same mechanism as CRM help-center's "Login as User" —
see `specs/crm-help-center.md`) and clicking "الملف الشخصي" in the side nav. Existing coverage:
`tests/profile/profile-mobile.spec.ts` (basic data + mobile edit) and `tests/profile/bankAccount.spec.ts`
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

## الجوال (mobile number) validation

Rule, per the field's own error text: must start with "05" and be exactly 10 digits. Confirmed by
direct exploration:

- Too few or too many digits (9 or 11, correctly 05-prefixed) → error.
- Doesn't start with 05 (wrong 2-digit prefix, e.g. 04, or an entirely different shape like a 966
  international prefix) → error.
- Non-numeric input → error (the input has no client-side keystroke filter; `.fill()` with letters
  goes straight through to the same validation).
- **Empty input → no error shown, and the save button is not disabled.** Saving a blank value is a
  silent no-op rather than a validation failure — there's no field-level feedback either way.
- Valid 05-prefixed 10-digit number → clears the error and saves.

The edit form also has its own "إلغاء" (cancel) button next to "حفظ" — same accessible name as the
first-time-heir redirect dialog's cancel button (see above), so don't assume `getByRole('button', {
name: 'إلغاء' })` is unambiguous if both could be on screen at once (they aren't, in practice,
since the redirect dialog only appears before the profile page loads at all).

## رقم الآيبان (IBAN) validation

Rule, per the field's own error text: must be exactly 24 characters and start with "SA". Confirmed
by direct exploration:

- Too short or too long (23 or 25 characters, correctly SA-prefixed) → error.
- Doesn't start with "SA" at the right length → error.
- **Lowercase "sa" prefix, otherwise correct shape → error.** The check is case-sensitive.
- **Empty input → no error shown, and the تحقق button is not disabled** — same silent-no-op
  behavior as the mobile field.
- Valid IBAN (SA + 22 digits) → adds the account, shown as "الحساب الأساسي".

**Known gap:** the check only validates shape (SA prefix + 24 total characters) — it does not
require the 22 characters after "SA" to be digits. `SAABCDEFGHIJKLMNOPQRSTUV` (SA + 22 letters)
passes validation and gets added as a real account, indistinguishable in the UI from a genuine
IBAN. Covered by its own isolated test (`bankAccount.spec.ts`) rather than folded into the
happy-path test, since it deliberately creates a bogus account and shouldn't affect that test's own
IBAN-add assertion.
