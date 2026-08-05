# Cash division (القسمة النقدية) — area map

Covers the "الأموال النقدية" division flow: beneficiary starts/accepts a proposed cash division,
all other heirs approve, an admin auditor approves, Tarika (external funds system) reports
account/balance status and settles the transfer, and the division completes. Existing coverage:
`tests/divisionsFlows/cashDivision-BankAccounts.spec.ts`,
`cashDivision-BankAndInvestmentAccounts.spec.ts`, `cashDivision-InvestmentAccounts.spec.ts`
(happy paths, one per asset-type combo), `cashDivision-TarikaFundsStatusFailure.spec.ts` /
`cashDivision-InvestmentAccounts-TarikaFundsStatusFailure.spec.ts` (Tarika funds status reporting
failure for every deceased asset, bank and investment accounts respectively), and
`divisionBlockers.spec.ts` (minor/dead-heir blockers, shared with investment division). Use this
doc to generate new cases along the same shape rather than re-deriving the flow from scratch.

## One-time environment precondition

Division v2 flows need waffle flags on and mock services active. Run once per environment via
`tests/divisionsFlows/division-preconditions.setup.ts`, which calls
`steps/apply-division-preconditions.ts::applyDivisionPreconditions`:

1. Admin Settings → disable value (toggle id 8).
2. `configurations/service/` → show all, check all mocks active.
3. Waffle flags → ensure `FE_DIVISION_CASH_V2`, `FE_DIVISION_INVESTMENT_V2`,
   `investment_division_v2_enabled`, `division_v2_enabled` exist and are forced on
   (Everyone = Yes), creating any that are missing.

All division specs `test.skip()` themselves if `ADMIN_USERNAME`/`ADMIN_PASSWORD` are unset.

## Seeding a case (`steps/data-preparation.ts::DataPreparation.seedCase`)

1. `SeederPage.login()` → seeder tool at `{ADMIN_API_URL}/inheritance_seeder/inheritanceseeder/seed/`.
2. `generateRandomData(divisionType?)` clicks "⚙ Generate Random Data". `divisionType` (a
   `DivisionType` from `pages/seeder.page.ts`) controls which cash asset checkboxes stay checked
   before generating:
   - `'cashBankAccounts'` — unchecks `gen_include_investment` (bank accounts only).
   - `'cashInvestmentAccounts'` — unchecks `gen_include_bank` (investment accounts only).
   - `'cashBankInvestmentAccounts'` — leaves both checked (mixed case).
   - `undefined` — leaves the seeder's own defaults as-is (used by blocker tests, which don't care
     about asset mix).
3. Optional heir mutation *before* seeding, via `opts`:
   - `{ minorHeirIndex: n }` → `markHeirAsMinor(n)` checks the `heir_minor_{n}` checkbox.
   - `{ deadHeirIndex: n }` → `markHeirAsDead(n)` checks `heir_dead_{n}` (plain dead heir, no
     Munasakhat/sub-inheritance data — that's a separate, more complex case not yet covered here).
   - Heir index is 0-based over the seeder's heir cards, but index 0 is the beneficiary and is
     excluded from the resulting `heirs[]` array, so index 1 is the first real "other heir".
4. `seedCase()` clicks Submit, parses the "Inheritance ID: ... Heirs: N" success line and the
   embedded JSON blob (`SeedCaseJson`: deceased, beneficiary, heirs[], request, estateAssets with
   `bankAccounts[]`/`investments[]`) off the result page.
5. `TawtheeqClient.seedCase(result.json)` mocks the same case into Tawtheeq (external registry) —
   asserted `ok()`.
6. `loginAsBeneficiary(result)` opens a new tab already authenticated as the beneficiary heir
   (same mechanism as the CRM help-center "Login as User" flow — see `specs/crm-help-center.md`).

To add a new case variant (e.g. a different heir mutation), extend `SeederPage`/`DataPreparation`
rather than reaching into the seeder page directly from a spec.

## Full happy-path flow (`CashDivisionsPage` + supporting steps)

All three happy-path specs (`cashDivision-BankAccounts`, `-BankAndInvestmentAccounts`,
`-InvestmentAccounts`) share this exact shape, differing only in `divisionType` and which Tarika
funds-status call(s) they simulate. To add a new one, copy an existing spec and swap those two
things.

1. **Seed + open divisions listing** — `DataPreparation.seedCase(divisionType)`, then
   `DivisionsList.run(beneficiaryTab, result)`: opens الطلبات → asserts "لم تبدأ بعد" on the
   قسمة التركة request card → opens case details → opens the divisions listing tab. Returns the
   `RequestsPage` for later status checks.
2. **Beneficiary starts and accepts the proposed division** (`CashDivisionsPage`, all on the
   beneficiary tab):
   - `showAssets()` — "عرض الأصول" in the "الأموال النقدية" card, then waits for network idle.
   - `fillMobileNumberIfPrompted(beneficiaryTab)` — fills "تحديث رقم الجوال" if that card appears
     and is empty (shared step, also used elsewhere).
   - `acceptDivisionAgreement()` — checks the "إقرار وتعهد" checkbox.
   - `startDivision()` — "بدء القسمة". If a heir is a minor/dead/other blocked state, a
     `blockerDialog()` appears here instead (see Blockers below) and the flow stops.
   - `waitForProposedDivisionCard()` — waits for "غير موافق" to render (proposed division loaded).
   - `acceptDivisionAgreement()` again, then `acceptDivision()` — "موافق" (button stays disabled
     until the القسمة المقترحة tab's data finishes loading).
   - `closeDivisionSuccessPopup()` — dismiss the rating overlay, then close the
     "تم تقديم طلب القسمة بنجاح" success dialog.
3. **Verify awaiting heirs approval** — reopen الطلبات, case details, divisions listing tab;
   `cashDivisionsPage.requestStatus()` should contain "بانتظار موافقة الورثة".
4. **All heirs approve** (`steps/heir-acceptance.ts::HeirAcceptance`) — for every heir other than
   the beneficiary: `seederPage.loginAsUser(heir.identityNumber)` opens a new tab as that heir,
   navigate الطلبات → case details → divisions tab, then run the same
   `viewDivision()` → `acceptDivisionAgreement()` → `acceptDivision()` sequence as a
   `DivisionPage` (defaults to `CashDivisionsPage`; `InvestmentDivisionsPage` is injectable for the
   investment flow). Closes each heir tab when done.
   - After this, `requestsPage.distributionStatus()` (بيانات الطلب tab) should contain
     "في انتظار التدقيق"; back on the divisions tab, `cashDivisionsPage.viewDivision()` opens the
     division ("عرض القسمة").
5. **Verify bank account inquiry in progress** — `openBankAccountTab()` ("الحساب البنكي"), assert
   `inquiryStatus()` contains "قيد الاستعلام".
6. **Auditor approves** (admin tab, `pages/inheritance-actions.page.ts`) —
   `openDivisionDashboard(adminPage, result.inheritanceId)` (searches
   `division_admin`/`division` Django admin by inheritance ID, opens its "dashboard" link, extracts
   the division UUID from the resulting URL) then
   `InheritanceActionsPage.submitAuditorApprove(inheritanceId)` — opens the inheritance's Django
   admin change page, sets the auditor-status select to `approved`, saves.
7. **Simulate Tarika funds status + complete heir inquiries/account selection**:
   - Real trigger chain: "Update Tarika" only fires once *all* approvals are in — every heir
     plus the auditor — regardless of which order they're submitted in. Ejada then processes
     the transfer async and notifies us via the Tarika funds status callback (this is what
     `TarikaFundsStatusClient.simulate()` stands in for); a `transactionStatus` of `251` on an
     entry is simply Ejada reporting that asset's transfer as failed, not an error on our side.
     Don't call `simulate()` before both heir and auditor approval are done, or it won't reflect
     a real callback.
   - `TarikaFundsStatusClient.simulate(result, divisionId, divisionType)` POSTs to
     `{API}/api/v1/inheritance/Transfer_Tarika_Funds_Status/` — one call per asset type present
     (`cashBankAccounts`/`cashInvestmentAccounts`), or both calls for
     `cashBankInvestmentAccounts` (each call flags `isCompleted` per whether it's the last of the
     pair — see the "Per-asset-type" comment in the client for the exact payload-shape rule).
     `transactionStatus` (`250` success / `251` failure) is set **per deceased asset**, i.e. per
     entry in the `BankAccountStatusList`/`InvestmentAccountStatusList` array, not once for the
     whole request — the happy-path specs hardcode every entry to `250` (`TransactionStatus.Success`
     in the client); a new case simulating a partial/failed inquiry would set `251` on individual
     entries instead.
   - `DivisionDashboardPage.completeHeirInqs(divisionId, heirsCount)` — on the Django dashboard,
     for each heir-inquiry row picks the highest `{n}_valid` option in its response `<select>`,
     then clicks "Submit inquiry response" (auto-accepting the confirm dialog).
   - Asserts no `heirInquiryFsmState(i)` still says "requested".
   - `expireAccountChoosing()` — dashboard button "Expire account choosing" (auto-accept dialog).
8. **Submit Tarika distribution request + settle funds**:
   - `TarikaDistributeReqClient.submitTarikaDistributeRequest(result, divisionId)` POSTs to
     `{API}/api/v1/inheritance/Tarika_Distribute_Req/`.
   - `SubmitTarikaFundsResults.run(divisionId, result)`, called **twice** (funds results are
     processed in two settlement rounds): reads the dashboard's "Warith Distributions" table via
     `DivisionDashboardPage.getWarithHeirs` (polls up to 90s until every heir has a numeric
     settled amount) and POSTs it to
     `{API}/api/v1/inheritance/Transfer_Funds_result/` via `TransferFundsResultClient`.
9. **Verify completion** — reload the dashboard; `divisionStatus()` and `ejadaStage()` badges both
   read "COMPLETED".

## Tarika funds status failure (all deceased assets)

`TarikaFundsStatusClient.simulate(result, divisionId, divisionType, 'failure')` sets every entry
in the `BankAccountStatusList`/`InvestmentAccountStatusList` to `transactionStatus: 251` instead
of `250` — i.e. Ejada reporting *every* deceased asset's transfer as failed, not a partial mix.
Confirmed live via `playwright-cli` (message text below is exact, not guessed):

- The status surfaces do **not** all reflect the failure — they diverge by tab:
  - `requestsPage.distributionStatus()` (بيانات الطلب tab, case details) still reads "مكتمل" —
    this reflects that the *querying* stage finished, not that the transfer itself succeeded.
  - `cashDivisionsPage.requestStatus()` ("حالة الطلب/ القسمة" on the divisions listing card)
    similarly still reads "انتهت القسمة" (division ended) — same "stage complete" signal.
  - `cashDivisionsPage.inquiryStatus()` (الحساب البنكي tab, "حالة الاستعلام") stays "قيد الاستعلام"
    — this only changes via the admin dashboard's `completeHeirInqs`/`expireAccountChoosing`
    (step 7), independent of the funds-status `transactionStatus`.
  - The division's own **حالة التوزيع tab** (`cashDivisionsPage.openDistributionStatusTab()` /
    `distributionStatusError()`, added for this case — not present before) is the one that
    actually surfaces the failure: "حدث خطأ في خدمة التحويل." (an error occurred in the transfer
    service) plus "يرجى إعادة الاستعلام عن حصر التركة من خلال خدمة حصر التركة ثم العودة لإتمام
    عملية القسمة." (re-query the estate inventory, then return to complete the division), and the
    "تحميل وثيقة قسمة الأموال النقدية" (download division document) button is disabled.
  - This means asserting the failure case must target the حالة التوزيع tab specifically — the
    other three status fields all read the same as the happy path at this point in the flow.

- **SPA doesn't reactively pick up the callback**: after `simulate(..., 'failure')` POSTs land,
  the حالة التوزيع tab has no click handler at all yet (no `cursor: pointer`, not actionable) if
  the beneficiary page was already open before the callback arrived — confirmed by comparing
  `playwright-cli` snapshots before/after a reload. `CashDivisionsPage.openDistributionStatusTab()`
  reloads the page first for exactly this reason; skipping the reload leaves every click strategy
  (plain, forced, `dispatchEvent`) silently no-op against a tab that isn't wired up yet.

- **Auditor/heir approval ordering gotcha**: `adminPage` and `seederPage` are the same underlying
  `page` fixture. The documented order (all heirs approve, *then* auditor approves) works because
  by the time `adminPage` is reused for admin actions, the seeder tool's "Login as User" rows are
  no longer needed. If a case needs the auditor to approve *before* the heirs (as this one does —
  approval must be submitted before the first heir approves), do the admin-dashboard steps on a
  separate tab (`await adminPage.context().newPage()`) instead of reusing `adminPage`/`page`
  directly, or the heir-login loop will time out unable to find its rows.

## Division blockers (`divisionBlockers.spec.ts`, shared with investment division)

Seed with `DataPreparation.seedCase(undefined, { minorHeirIndex: n })` or
`{ deadHeirIndex: n }` (no `divisionType` needed — blockers don't depend on asset mix), run
`DivisionsList.run(...)`, then attempt the normal start sequence
(`showAssets` → `fillMobileNumberIfPrompted` → `acceptDivisionAgreement` → `startDivision`) and
assert `blockerDialog()` is visible instead of the proposed-division card:

| Case | Cash division blocker text | Investment division blocker text |
|---|---|---|
| Minor heir | "قاصر" | "قاصر" |
| Dead heir | "يجب وجود حصر ورثة للوارث المتوفى" | "نحيطكم بأنه لا يمكن القسمة الاتفاقية للتركة من خلال منصة التركات" |

`blockerDialog()` matches any dialog containing an "العودة" (back) button rather than a specific
message, since the message varies by blocker reason — assert the specific text separately.

## Adding a new cash-division case — checklist

1. Decide the seed shape: `divisionType` (asset mix) and/or heir mutation (`minorHeirIndex`,
   `deadHeirIndex`, or none). If the new case needs a mutation `SeederPage` doesn't support yet
   (e.g. Munasakhat/sub-inheritance for a dead heir), extend `SeederPage` first.
2. If it's a new happy-path variant, copy one of the three existing `cashDivision-*.spec.ts`
   files and adjust only `divisionType` and the Tarika funds-status simulate call(s) in step 7.
3. If it's a new blocker, add a case to `divisionBlockers.spec.ts` following the existing pattern
   and confirm the exact blocker text via `playwright-cli` first (message text is
   blocker-reason-specific and easy to get wrong from guesswork).
4. If the environment hasn't run `apply-division-preconditions` recently, run
   `division-preconditions.setup.ts` first — flows silently misbehave without the v2 waffle flags.
