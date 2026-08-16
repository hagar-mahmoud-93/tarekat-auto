# tarekat-auto

Playwright E2E test suite for منصة التركات (Tarekat / Merath) — the estate-inheritance platform
under Saudi MOJ. Tests the beneficiary-facing web app (`ops-merath.web.azm-dev.com`) and its
backing admin/APIs (`ops-merath.api.azm-dev.com`).

## Structure

- `tests/` — spec files, grouped by domain (`crm`, `divisions-flows`, `nafath-login`).
- `pages/` + `locators/` — page-object model. One page object per screen/flow, each with its own
  locator class. For a substantial domain (cash division, investment division), each page object
  gets its own `*.locators.ts` file. For a small feature made of several tightly-coupled screens
  (e.g. a help center with a hub + FAQ + contact-us + wizard), keep one locator class per page
  object but co-locate all of them in a single `<feature>.locators.ts` file — avoids locator-file
  sprawl for what's really one feature. See `locators/crm-locators/help-center.locators.ts` for
  the pattern.
- `steps/` — reusable multi-step flows shared across specs (e.g. seeding a case, filling prompts).
- `fixtures/base.fixture.ts` — custom Playwright fixtures (`loginPage`, `seederPage`).
- `api/clients/` — direct API clients used to seed/verify data outside the UI.
- `config/env.ts` — all environment config; reads `.env` (gitignored, not committed).
- `specs/` — exploration notes and domain write-ups, one file per area. Not test plans in the
  Playwright sense — background knowledge for whoever (human or Claude) works in that area next.

## Running tests

No npm scripts defined yet — run Playwright directly, e.g. `npx playwright test tests/crm`.
`.env` must have `ADMIN_USERNAME`/`ADMIN_PASSWORD` for tests that go through the seeder; tests
`test.skip()` themselves when missing.

## Domain notes

- **CRM / Help Center** (`tests/crm/`, help-ticket flow): see `specs/crm-help-center.md` for the
  full area map — beneficiary Help Center pages, the new-ticket wizard, how to get a logged-in
  beneficiary session without Nafath (seeder → "Login as User"), the Django admin `ticketing` /
  `support_dashboard` apps, and a known verify-applicant/Dynamics-CRM connectivity issue.
- **Cash division** (`tests/divisions-flows/`, "الأموال النقدية"): see `specs/cash-division.md`
  for the full area map — seeding a case with a given asset mix/heir mutation, the beneficiary
  → all-heirs → auditor → Tarika funds-status/settlement flow, division blockers (minor/dead
  heir), and a checklist for adding new cases.
- **Heirs determination request** (`tests/online-services/`, "إصدار حصر الورثة"): see
  `specs/heirs-determination-request.md` for the full area map — Nafath login, seeding
  deceased/witness identities via the Tawtheeq mock seeder, the full wizard step sequence with its
  known UI quirks, and the seed-cleanup step every case must end with.
- **Profile** (`tests/profile/`, "الملف الشخصي"): see `specs/profile.md` for the full area map —
  the first-time-heir redirect dialog, the two-tab page structure (basic data + bank account),
  and which fields/flows are and aren't covered yet.
- **Estate inventory** (no tests yet, "حصر التركة"): see `specs/estate-inventory.md` for the area
  map — the case-details tab structure (5 tabs, not just the 2 `RequestsLocators` currently
  covers), what the `حصر التركة` tab shows for a seeded case, and open questions for whoever
  automates it next.

## Conventions

- Page objects only expose actions/getters; locators live in a separate locator class (see
  `pages/` + `locators/` above for how those classes are grouped into files).
- Flaky backend calls get documented inline as a comment on the retry logic, not silently retried.
- When exploring a new domain area, write findings to `specs/<area>.md` and add a one-line pointer
  here rather than inlining the details — keeps this file small since it's loaded every session.
