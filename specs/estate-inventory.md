# Estate inventory (حصر التركة) — area map

Explored live via a throwaway `playwright-cli`-style script (`tests/divisionsFlows/_explore2.spec.ts`,
gitignored) against a freshly `DataPreparation.seedCase()`-seeded case. Now covered by
`tests/divisionsFlows/estateInventory.spec.ts` (`EstateInventoryPage` +
`locators/ui-division-locators/estate-inventory.locators.ts`), self-contained — it owns the tab's
own click/wait rather than going through `RequestsPage`/`RequestsLocators`, so nothing on the
existing `بيانات الطلب`/`قسمة التركة` tabs needed to change.

## Where it lives

Case details (`RequestsPage.openCaseDetails()`, URL `/my-orders/order/{inheritanceId}?requestNumber=...`)
has **five** tabs in its tabs container, not the two (`بيانات الطلب` / `قسمة التركة`) currently
covered by `RequestsLocators`:

`بيانات الطلب` · `حصر الورثة` · `حصر التركة` · `قسمة التركة` · `طلبات التخارج`

Above the tabs, a 3-step progress stepper (`حصر الورثة` → `حصر التركة` → `قسمة التركة`) shows each
stage's completion date or status. For a case straight out of the seeder, `حصر الورثة` and
`حصر التركة` are both already ✅ complete (dated the same day as seeding) and `قسمة التركة` reads
"قيد التنفيذ" (in progress) — the seeder produces a case that's *ready to divide*, estate inventory
already done. This means the estate-inventory tab, as seeded, always shows a **finished** inquiry;
no case variant was found/tried yet that leaves it mid-query.

## `حصر التركة` tab content

Reachable via `tabsContainer.getByText('حصر التركة')` (same `divisionsTabsContainer()` locator
`RequestsLocators` already uses for the other tabs) — clicking it swaps the panel below the tabs,
async, over ~1-2s (no visible loading-state hook found yet; a plain `waitForTimeout` was used
during exploration, a real page object should find something better to wait on, e.g. the
"أصول التركة" heading becoming visible).

- **Header row**: "تحميل وثيقة حصر التركة الكاملة" button (downloads the full estate-inventory
  document) and "إعادة الاستعلام" (re-query) — **disabled** in the seeded/complete state. An info
  banner explains: if the inquiry data is missing something, re-query via that button, and a
  re-query can take up to 14 days.
- **"أصول التركة" (estate assets)** — one card per asset type:
  - **الأموال النقدية** (cash: current + investment bank accounts) — "حالة الاستعلام: تم التنفيذ"
    (query done), "عرض الأصول" (view assets) button. This is the seeded `bankAccounts[]`/
    `investments[]` data (see `SeedCaseJson.estateAssets` in `pages/seeder.page.ts`).
  - **الموجودات الاستثمارية** (investment holdings held via investment firms) — same "تم التنفيذ" /
    "عرض الأصول" shape.
  - **عقارات** (real estate) — "لا يوجد عقارات" (none). The seeder doesn't generate real-estate
    assets, so this is always empty for a seeded case.
  - **الإقرارات** (debt acknowledgments against the deceased) — "لا توجد إقرارات".
  - **سندات** (Nafith-notarized deeds) — "لا توجد سندات".
  - **السجلات التجارية** (commercial registrations, Ministry of Commerce) — "لا توجد سجلات تجارية".
- **"الحقوق على التركة" (claims against the estate)**:
  - **الديون الموثقة** (MOJ-notarized debts) — "لا توجد ديون موثقة".
  - **وصايا** (wills) — "لا توجد وصايا".
- **"إقرار عن دين للتركة"** button — a heir can acknowledge a debt owed *to* them *by* the estate;
  links to `/my-orders/acknowledgment-of-debt/terms-and-conditions?id={uuid}&orderId={inheritanceId}`
  (a whole separate flow, not explored further).
- **Bottom card — "يمكنك بدء القسمة القضائية"**: offers judicial division (through a dedicated MOJ
  circuit) as an alternative to the platform's own consensual division flow, via a
  "بدء القسمة القضائية" button. Not explored further; presumably an alternative path when
  consensual division (`specs/cash-division.md`) isn't viable or wanted.

## Confirmed content bug: stepper's "قيد التنفيذ" status

The `قسمة التركة` step's in-progress status text is **not** spelled correctly in the DOM: it
renders as `قيد التنٝيذ`, with U+065D in place of ف (U+0641) in `التنفيذ`. Confirmed by dumping the
raw text's codepoints during exploration (`62a 645 20 627 644 62a 646 65d 64a 630` vs. the correct
`641` for ف) — not a copy/paste artifact of this doc or the terminal. `estateInventory.spec.ts`
asserts the exact (buggy) string on purpose, so a future content fix breaks that assertion and
gets noticed rather than silently passing either way. The same "تم التنفيذ" status text on the
asset cards (`أصول التركة`) is spelled correctly — the bug is specific to this one stepper status
string, not a platform-wide font/encoding issue.

## Open questions / not yet explored

- What "عرض الأصول" (view assets) shows per asset-type card — presumably a breakdown of the
  individual accounts, but not clicked through yet.
- Whether a case can be seeded/mutated into a state where `حصر التركة` itself is still in-progress
  (not yet complete) — every seeded case tried so far starts post-inventory, ready to divide.
- The `طلبات التخارج` (exit/buy-out requests) tab — untouched, name suggests heirs opting out of
  the estate for compensation, likely its own domain area.
- `حصر الورثة` tab content (the heir-enumeration counterpart to this asset-enumeration tab) — not
  opened during this exploration, only seen as a stepper/tab label. Note this is a **different**
  concept from the `/state-inventory-service/create-estate` "تقديم طلب حصر ورثة جديد" dialog
  documented in `specs/profile.md`'s first-time-heir redirect — that's a *new-case creation* wizard
  a first-time heir with no existing case gets bounced to, whereas this `حصر الورثة` tab is a
  status view on an *existing* seeded case's own heir-enumeration stage.
- On the `/my-orders` listing itself (before opening case details), dumping every `div.grid`'s
  `innerText()` returned `[]` even though `RequestsPage.openCaseDetails()` (which targets a
  "مشاهدة التفاصيل" button, not a grid div) worked fine right after — likely just a timing
  artifact (checked before the list finished rendering, no `waitForLoadState`), not a real absence
  of `div.grid` elements. Re-verify with a proper wait before relying on `div.grid` dumps for
  this listing.
