# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: crm/submitTicket.spec.ts >> CRM complaints >> Beneficiary submits a new support ticket via المساعدة @crm
- Location: tests/crm/submitTicket.spec.ts:15:7

# Error details

```
Error: Timeout 30000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - text: ops-alibaba server (v0.0.3791)
  - generic [ref=e2]:
    - text: 
    - list [ref=e3]:
      - listitem [ref=e4]:  root
    - generic [ref=e5]:
      - link "Home" [ref=e6] [cursor=pointer]:
        - /url: /admin/
      - generic [ref=e7]: 
      - text: Seed Inheritance Case
    - list [ref=e8]:
      - listitem [ref=e9]: "Inheritance case seeded successfully. Inheritance ID: c66ef239-1397-4c23-bc54-cc1fcaeb4d99 | Heirs: 2 | Auth User IDs: [4263, 4264] | Assets: 2"
    - generic [ref=e10]:
      - listitem [ref=e12]: "Inheritance case seeded successfully. Inheritance ID: c66ef239-1397-4c23-bc54-cc1fcaeb4d99 | Heirs: 2 | Auth User IDs: [4263, 4264] | Assets: 2"
      - generic [ref=e13]:
        - strong [ref=e14]: Seeded Heirs — Login Links
        - table [ref=e15]:
          - rowgroup [ref=e16]:
            - row "Name Social ID Auth User ID Action" [ref=e17]:
              - columnheader "Name" [ref=e18]
              - columnheader "Social ID" [ref=e19]
              - columnheader "Auth User ID" [ref=e20]
              - columnheader "Action" [ref=e21]
          - rowgroup [ref=e22]:
            - row "عائشة العمري 1712668305 4263 Login as User" [ref=e23]:
              - cell "عائشة العمري" [ref=e24]
              - cell "1712668305" [ref=e25]
              - cell "4263" [ref=e26]
              - cell "Login as User" [ref=e27]:
                - link "Login as User" [active] [ref=e28] [cursor=pointer]:
                  - /url: /admin/inheritance_seeder/inheritanceseeder/login-as/4263/
            - row "خالد العمري 1201534764 4264 Login as User" [ref=e29]:
              - cell "خالد العمري" [ref=e30]
              - cell "1201534764" [ref=e31]
              - cell "4264" [ref=e32]
              - cell "Login as User" [ref=e33]:
                - link "Login as User" [ref=e34] [cursor=pointer]:
                  - /url: /admin/inheritance_seeder/inheritanceseeder/login-as/4264/
      - generic [ref=e35]:
        - generic [ref=e36]:
          - strong [ref=e37]: Extract Case as JSON
          - link "⇩ Download JSON" [ref=e38] [cursor=pointer]:
            - /url: /admin/inheritance_seeder/inheritanceseeder/extract-json/c66ef239-1397-4c23-bc54-cc1fcaeb4d99/?download=1
          - button "Copy" [ref=e39] [cursor=pointer]
        - generic [ref=e40]: "{ \"_name\": \"seed-1207454236\", \"deceased\": { \"identityNumber\": \"1207454236\", \"identityType\": 1, \"firstName\": \"يوسف\", \"middleName\": \"عبدالله\", \"lastName\": \"أحمد\", \"familyName\": \"العمري\", \"fullName\": \"يوسف عبدالله أحمد العمري\", \"gender\": 1, \"nationalityId\": 1, \"birthDate\": \"1951-10-15T00:00:00\", \"birthDateHijri\": \"1371/01/14\", \"deathDate\": \"2025-11-24T00:00:00\", \"deathDateHijri\": \"1447/06/03\", \"deathDocumentIssueDate\": null, \"deathDocumentIssueDateHijri\": \"\" }, \"beneficiary\": { \"identityNumber\": \"1712668305\", \"identityType\": 1, \"firstName\": \"عائشة\", \"middleName\": null, \"lastName\": null, \"familyName\": \"العمري\", \"fullName\": \"عائشة العمري\", \"gender\": 2, \"nationalityId\": 1, \"birthDate\": \"1990-01-01T00:00:00\", \"birthDateHijri\": \"1410/06/04\", \"phoneNumber\": \"0590536685\", \"relationshipTypeId\": 7, \"relationshipType\": \"ابن\", \"beneficiaryTypeId\": 1, \"agencyTypeId\": null }, \"heirs\": [ { \"id\": \"be149175-0bee-4caf-8dc6-7137559fd26b\", \"identityNumber\": \"1201534764\", \"identityType\": 1, \"firstName\": \"خالد\", \"middleName\": null, \"lastName\": null, \"familyName\": \"العمري\", \"fullName\": \"خالد العمري\", \"gender\": 1, \"nationalityId\": 1, \"birthDate\": \"1970-07-04T00:00:00\", \"birthDateHijri\": \"1390/05/01\", \"phoneNumber\": \"0522627453\", \"relationshipTypeId\": 7, \"relationshipType\": \"ابن\", \"isMinor\": false, \"isAdult\": true, \"isDead\": false, \"isWifePregnant\": null } ], \"request\": { \"id\": 2233, \"requestNumber\": \"SEED-c66ef239\" }, \"estateAssets\": { \"bankAccounts\": [ { \"iban\": \"SA8831041939100975563969\", \"accountNumber\": \"ACC02247581\", \"balance\": \"50000.00\" } ], \"investments\": [ { \"accountNumber\": \"ACC56643149\", \"balance\": \"10000.00\" } ] } }"
      - generic [ref=e41]:
        - button "⚙ Generate Random Data" [ref=e42] [cursor=pointer]:
          - generic [ref=e43]: ⚙ Generate Random Data
        - generic [ref=e44]:
          - text: "Heirs:"
          - spinbutton "Heirs:" [ref=e45]: "2"
        - generic [ref=e46]:
          - generic [ref=e47]: 
          - text: Bank Account
        - generic [ref=e48]:
          - generic [ref=e49]: 
          - text: Deposit
        - generic [ref=e50]:
          - generic [ref=e51]: 
          - text: Investment Account
        - generic [ref=e52]:
          - generic [ref=e53]: 
          - text: Wakala
        - generic "Wakeel is an existing living heir (hybrid). Munasakhat generate only; two_dead falls back to a new person." [ref=e54]:
          - generic [ref=e55]: 
          - text: Wakeel = existing heir (hybrid)
        - generic [ref=e56]:
          - generic [ref=e57]: 
          - text: Portfolio (Investment Division)
        - generic [ref=e58]:
          - generic [ref=e59]: 
          - text: Certificate
        - generic [ref=e60]:
          - generic [ref=e61]: 
          - text: Derivative
        - generic [ref=e62]:
          - generic [ref=e63]: 
          - text: Mutual Fund
        - generic [ref=e64]:
          - generic [ref=e65]: 
          - text: Deed (Real Estate)
      - generic [ref=e66]:
        - strong [ref=e67]: "المناسخات — Munasakhat:"
        - combobox [ref=e68]
        - combobox "Happy path — 1 dead heir + 2 sub-heirs on Tarekat" [ref=e71] [cursor=pointer]:
          - generic "Happy path — 1 dead heir + 2 sub-heirs on Tarekat" [ref=e72]
          - text: 
        - button "⚙ Generate Munasakhat Data" [ref=e73] [cursor=pointer]:
          - generic [ref=e74]: ⚙ Generate Munasakhat Data
        - generic [ref=e75]:
          - text: Fills the form below (primary case + dead heir's sub-inheritance) with editable random data — review/edit, then press
          - strong [ref=e76]: Seed Case
          - text: .
      - generic [ref=e77]:
        - generic [ref=e78]: "Config:"
        - button "Import Config" [ref=e79] [cursor=pointer]
        - button "Export Config" [ref=e81] [cursor=pointer]
      - generic [ref=e82]:
        - generic [ref=e83]:
          - heading "Deceased Info" [level=2] [ref=e84]
          - generic [ref=e85]:
            - generic [ref=e86]:
              - generic [ref=e87]: Social ID *
              - textbox [ref=e88]
            - generic [ref=e89]:
              - generic [ref=e90]: First Name *
              - textbox [ref=e91]
            - generic [ref=e92]:
              - generic [ref=e93]: Father Name *
              - textbox [ref=e94]
            - generic [ref=e95]:
              - generic [ref=e96]: Grandfather Name *
              - textbox [ref=e97]
            - generic [ref=e98]:
              - generic [ref=e99]: Family Name *
              - textbox [ref=e100]
            - generic [ref=e101]:
              - generic [ref=e102]: Full Name
              - textbox "Auto-generated if empty" [ref=e103]
            - generic [ref=e104]:
              - generic [ref=e105]: Gender
              - combobox [ref=e106]
              - combobox "Male" [ref=e109] [cursor=pointer]:
                - generic "Male" [ref=e110]
                - text: 
            - generic [ref=e111]:
              - generic [ref=e112]: ID Type
              - combobox [ref=e113]
              - combobox "هوية وطنية" [ref=e116] [cursor=pointer]:
                - generic "هوية وطنية" [ref=e117]
                - text: 
            - generic [ref=e118]:
              - generic [ref=e119]: Nationality
              - combobox [ref=e120]
              - combobox "السعودية" [ref=e123] [cursor=pointer]:
                - generic "السعودية" [ref=e124]
                - text: 
            - generic [ref=e125]:
              - generic [ref=e126]: Date of Death
              - textbox [ref=e127]
            - generic [ref=e128]:
              - generic [ref=e129]: Date of Birth
              - textbox [ref=e130]
        - generic [ref=e131]:
          - heading "Heirs" [level=2] [ref=e132]
          - generic [ref=e134]:
            - generic [ref=e135]: "Heir #1"
            - button "Remove" [ref=e136] [cursor=pointer]
            - generic [ref=e137]:
              - generic [ref=e138]:
                - generic [ref=e139]: Social ID *
                - textbox [ref=e140]
              - generic [ref=e141]:
                - generic [ref=e142]: First Name *
                - textbox [ref=e143]
              - generic [ref=e144]:
                - generic [ref=e145]: Family Name *
                - textbox [ref=e146]
              - generic [ref=e147]:
                - generic [ref=e148]: Share % (e.g. 1/2) *
                - textbox "1/2" [ref=e149]
              - generic [ref=e150]:
                - generic [ref=e151]: Mobile Number
                - textbox [ref=e152]
              - generic [ref=e153]:
                - generic [ref=e154]: Birth Date
                - textbox [ref=e155]
              - generic [ref=e156]:
                - generic [ref=e157]: Gender
                - combobox [ref=e158]
                - combobox "Male" [ref=e161] [cursor=pointer]:
                  - generic "Male" [ref=e162]
                  - text: 
              - generic [ref=e163]:
                - generic [ref=e164]: Nationality
                - combobox [ref=e165]
                - combobox "السعودية" [ref=e168] [cursor=pointer]:
                  - generic "السعودية" [ref=e169]
                  - text: 
              - generic [ref=e171]:  Is Applicant
              - generic [ref=e173]:  Dead
              - generic [ref=e175]:  Minor
              - generic [ref=e177]:  Wife Pregnant
          - button "+ Add Heir" [ref=e178] [cursor=pointer]
        - generic [ref=e179]:
          - heading "Inquiries" [level=2] [ref=e180]
          - generic [ref=e181]:
            - generic [ref=e182] [cursor=pointer]:
              - generic [ref=e183]: 
              - text: Cash Assets (Bank)
            - generic [ref=e184] [cursor=pointer]:
              - generic [ref=e185]: 
              - text: Investments
            - generic [ref=e186] [cursor=pointer]:
              - generic [ref=e187]: 
              - text: Debts
            - generic [ref=e188] [cursor=pointer]:
              - generic [ref=e189]: 
              - text: Deeds
            - generic [ref=e190] [cursor=pointer]:
              - generic [ref=e191]: 
              - text: Deed Registry
            - generic [ref=e192] [cursor=pointer]:
              - generic [ref=e193]: 
              - text: Sanads
            - generic [ref=e194] [cursor=pointer]:
              - generic [ref=e195]: 
              - text: Commercial Records
            - generic [ref=e196] [cursor=pointer]:
              - generic [ref=e197]: 
              - text: Commandments
        - generic [ref=e198]:
          - heading "Bank Accounts" [level=2] [ref=e199]
          - button "+ Add Bank Account" [ref=e200] [cursor=pointer]
        - generic [ref=e201]:
          - heading "Deposit Infos" [level=2] [ref=e202]
          - button "+ Add Deposit" [ref=e203] [cursor=pointer]
        - generic [ref=e204]:
          - heading "Investment Accounts" [level=2] [ref=e205]
          - button "+ Add Investment Account" [ref=e206] [cursor=pointer]
        - generic [ref=e207]:
          - heading "Wakala / Wakeel" [level=2] [ref=e208]
          - button "+ Add Wakala" [ref=e209] [cursor=pointer]
        - generic [ref=e210]:
          - heading "المناسخات — Dead Heir's Sub-Inheritance(s)" [level=2] [ref=e211]
          - paragraph [ref=e212]:
            - text: For each heir above marked
            - strong [ref=e213]: Dead
            - text: ", define their own حصر الورثة here — the dead heir becomes the"
            - emphasis [ref=e214]: deceased
            - text: of this sub-case, and its heirs are the sub-heirs. Uncheck
            - strong [ref=e215]: Create in DB
            - text: to get the sub-case JSON preview without persisting it. Leave this empty for a plain (non-munasakhat) case.
          - button "+ Add Sub-Inheritance" [ref=e216] [cursor=pointer]
        - generic [ref=e217]:
          - heading "Wakala for sub-heir (new)" [level=2] [ref=e218]
          - paragraph [ref=e219]:
            - text: Adds a wakeel acting for a Munasakhat sub-heir, on top of the case seeded above. Needs a persisted sub-case (Create in DB). Leave on
            - strong [ref=e220]: none
            - text: for no change.
          - generic [ref=e221]:
            - text: "Mode:"
            - combobox [ref=e222]
            - combobox "none — no sub-heir wakala (default)" [ref=e225] [cursor=pointer]:
              - generic "none — no sub-heir wakala (default)" [ref=e226]
              - text: 
        - generic [ref=e227]:
          - heading "Portfolios (Investment Division)" [level=2] [ref=e228]
          - button "+ Add Portfolio" [ref=e229] [cursor=pointer]
        - generic [ref=e230]:
          - heading "Certificates" [level=2] [ref=e231]
          - button "+ Add Certificate" [ref=e232] [cursor=pointer]
        - generic [ref=e233]:
          - heading "Derivatives" [level=2] [ref=e234]
          - button "+ Add Derivative" [ref=e235] [cursor=pointer]
        - generic [ref=e236]:
          - heading "Mutual Funds" [level=2] [ref=e237]
          - button "+ Add Mutual Fund" [ref=e238] [cursor=pointer]
        - generic [ref=e239]:
          - heading "Deeds (Real Estate Division)" [level=2] [ref=e240]
          - button "+ Add Deed" [ref=e241] [cursor=pointer]
        - button "Seed Case" [ref=e243] [cursor=pointer]
    - text:    
    - generic [ref=e244]:
      - generic [ref=e245]:
        - generic [ref=e246]:
          - generic [ref=e247] [cursor=pointer]: 
          - generic [ref=e248] [cursor=pointer]: 
          - heading "Merath Partners API Administration" [level=1] [ref=e249]:
            - link "Merath Partners API Administration" [ref=e250] [cursor=pointer]:
              - /url: /admin/
        - generic [ref=e251]:
          - link " Home" [ref=e252] [cursor=pointer]:
            - /url: /admin/
            - generic [ref=e253]:
              - generic [ref=e254]: 
              - text: Home
          - link " View site" [ref=e255] [cursor=pointer]:
            - /url: /
            - generic [ref=e256]:
              - generic [ref=e257]: 
              - text: View site
        - generic [ref=e258]:
          - generic [ref=e259]:
            - generic: 
            - text: Applications
          - link [ref=e260] [cursor=pointer]:
            - /url: "#"
          - generic [ref=e261]:
            - link " Accounts" [ref=e262] [cursor=pointer]:
              - /url: /admin/account/
              - text:  
              - generic [ref=e264]: 
              - generic [ref=e265]: Accounts
            - link " Activity_Audit" [ref=e266] [cursor=pointer]:
              - /url: /admin/activity_audit/
              - text:  
              - generic [ref=e268]: 
              - generic [ref=e269]: Activity_Audit
            - link " Admin Inbox" [ref=e270] [cursor=pointer]:
              - /url: /admin/admin_inbox/
              - text:  
              - generic [ref=e272]: 
              - generic [ref=e273]: Admin Inbox
            - link " Agent Acting (Wakeel)" [ref=e274] [cursor=pointer]:
              - /url: /admin/agent_acting/
              - text:  
              - generic [ref=e276]: 
              - generic [ref=e277]: Agent Acting (Wakeel)
            - link " API Inbox" [ref=e278] [cursor=pointer]:
              - /url: /admin/inbox/
              - text:  
              - generic [ref=e280]: 
              - generic [ref=e281]: API Inbox
            - link " API Outbox" [ref=e282] [cursor=pointer]:
              - /url: /admin/outbox/
              - text:  
              - generic [ref=e284]: 
              - generic [ref=e285]: API Outbox
            - link " Authentication and Authorization" [ref=e286] [cursor=pointer]:
              - /url: /admin/auth/
              - text:  
              - generic [ref=e288]: 
              - generic [ref=e289]: Authentication and Authorization
            - link " CMA Transfer Provider" [ref=e290] [cursor=pointer]:
              - /url: /admin/cma_transfer/
              - text:  
              - generic [ref=e292]: 
              - generic [ref=e293]: CMA Transfer Provider
            - link " Configurations" [ref=e294] [cursor=pointer]:
              - /url: /admin/configurations/
              - text:  
              - generic [ref=e296]: 
              - generic [ref=e297]: Configurations
            - link " Disbursement Management" [ref=e298] [cursor=pointer]:
              - /url: /admin/disbursement/
              - text:  
              - generic [ref=e300]: 
              - generic [ref=e301]: Disbursement Management
            - link " Division" [ref=e302] [cursor=pointer]:
              - /url: /admin/division/
              - text:  
              - generic [ref=e304]: 
              - generic [ref=e305]: Division
            - link " Division Diagnostics" [ref=e306] [cursor=pointer]:
              - /url: /admin/diagnostic/
              - text:  
              - generic [ref=e308]: 
              - generic [ref=e309]: Division Diagnostics
            - link " Division V2" [ref=e310] [cursor=pointer]:
              - /url: /admin/division_v2/
              - text:  
              - generic [ref=e312]: 
              - generic [ref=e313]: Division V2
            - link " django-waffle" [ref=e314] [cursor=pointer]:
              - /url: /admin/waffle/
              - text:  
              - generic [ref=e316]: 
              - generic [ref=e317]: django-waffle
            - link " Easy Audit Application" [ref=e318] [cursor=pointer]:
              - /url: /admin/easyaudit/
              - text:  
              - generic [ref=e320]: 
              - generic [ref=e321]: Easy Audit Application
            - link " Ejada Cash Provider" [ref=e322] [cursor=pointer]:
              - /url: /admin/ejada_cash/
              - text:  
              - generic [ref=e324]: 
              - generic [ref=e325]: Ejada Cash Provider
            - link " Estates_List" [ref=e326] [cursor=pointer]:
              - /url: /admin/estates_list/
              - text:  
              - generic [ref=e328]: 
              - generic [ref=e329]: Estates_List
            - link " Faq" [ref=e330] [cursor=pointer]:
              - /url: /admin/faq/
              - text:  
              - generic [ref=e332]: 
              - generic [ref=e333]: Faq
            - link " Fees Engine" [ref=e334] [cursor=pointer]:
              - /url: /admin/fees/
              - text:  
              - generic [ref=e336]: 
              - generic [ref=e337]: Fees Engine
            - link " Heirs_List" [ref=e338] [cursor=pointer]:
              - /url: /admin/heirs_list/
              - text:  
              - generic [ref=e340]: 
              - generic [ref=e341]: Heirs_List
            - link " Inheritance" [ref=e342] [cursor=pointer]:
              - /url: /admin/inheritance/
              - text:  
              - generic [ref=e344]: 
              - generic [ref=e345]: Inheritance
            - link " Inheritance Deduplication" [ref=e346] [cursor=pointer]:
              - /url: /admin/dedup/
              - text:  
              - generic [ref=e348]: 
              - generic [ref=e349]: Inheritance Deduplication
            - link " Inheritance_Copy" [ref=e350] [cursor=pointer]:
              - /url: /admin/inheritance_copy/
              - text:  
              - generic [ref=e352]: 
              - generic [ref=e353]: Inheritance_Copy
            - link " Inheritance_Seeder" [ref=e354] [cursor=pointer]:
              - /url: /admin/inheritance_seeder/
              - text:  
              - generic [ref=e356]: 
              - generic [ref=e357]: Inheritance_Seeder
            - link " Lawsuit" [ref=e358] [cursor=pointer]:
              - /url: /admin/lawsuit/
              - text:  
              - generic [ref=e360]: 
              - generic [ref=e361]: Lawsuit
            - link " Otp" [ref=e362] [cursor=pointer]:
              - /url: /admin/otp/
              - text:  
              - generic [ref=e364]: 
              - generic [ref=e365]: Otp
            - link " Pages" [ref=e366] [cursor=pointer]:
              - /url: /admin/pages/
              - text:  
              - generic [ref=e368]: 
              - generic [ref=e369]: Pages
            - link " Partners_Api" [ref=e370] [cursor=pointer]:
              - /url: /admin/partners_api/
              - text:  
              - generic [ref=e372]: 
              - generic [ref=e373]: Partners_Api
            - link " Reconciliation Dashboard" [ref=e374] [cursor=pointer]:
              - /url: /admin/reconciliation/
              - text:  
              - generic [ref=e376]: 
              - generic [ref=e377]: Reconciliation Dashboard
            - link " Report" [ref=e378] [cursor=pointer]:
              - /url: /admin/report/
              - text:  
              - generic [ref=e380]: 
              - generic [ref=e381]: Report
            - link " Sites" [ref=e382] [cursor=pointer]:
              - /url: /admin/sites/
              - text:  
              - generic [ref=e384]: 
              - generic [ref=e385]: Sites
            - link " Social Accounts" [ref=e386] [cursor=pointer]:
              - /url: /admin/socialaccount/
              - text:  
              - generic [ref=e388]: 
              - generic [ref=e389]: Social Accounts
            - link " SQL Explorer" [ref=e390] [cursor=pointer]:
              - /url: /admin/explorer/
              - text:  
              - generic [ref=e392]: 
              - generic [ref=e393]: SQL Explorer
            - link " Support Dashboard" [ref=e394] [cursor=pointer]:
              - /url: /admin/support_dashboard/
              - text:  
              - generic [ref=e396]: 
              - generic [ref=e397]: Support Dashboard
            - link " Ticketing" [ref=e398] [cursor=pointer]:
              - /url: /admin/ticketing/
              - text:  
              - generic [ref=e400]: 
              - generic [ref=e401]: Ticketing
            - link " Token Blacklist" [ref=e402] [cursor=pointer]:
              - /url: /admin/token_blacklist/
              - text:  
              - generic [ref=e404]: 
              - generic [ref=e405]: Token Blacklist
            - link " User_Auth" [ref=e406] [cursor=pointer]:
              - /url: /admin/user_auth/
              - text:  
              - generic [ref=e408]: 
              - generic [ref=e409]: User_Auth
            - link " Workflow Engine" [ref=e410] [cursor=pointer]:
              - /url: /admin/workflow/
              - text:  
              - generic [ref=e412]: 
              - generic [ref=e413]: Workflow Engine
        - generic [ref=e415]:
          - link "" [ref=e417] [cursor=pointer]:
            - /url: "#"
            - generic [ref=e418]: 
          - text: bookmarks
      - text: 
  - log [ref=e421]
```

# Test source

```ts
  1   | import { expect } from '@playwright/test';
  2   | import { BasePage } from '../base.page';
  3   | import { NewTicketLocators } from '../../locators/help-center.locators';
  4   | 
  5   | export class NewTicketPage extends BasePage {
  6   |   private readonly locators = new NewTicketLocators(this.page);
  7   | 
  8   |   /**
  9   |    * Step 1 (بيانات مقدم التذكرة): the applicant name/id fields are populated by a
  10  |    * verify-applicant call that intermittently fails (503 with no body); reloading
  11  |    * retries it. Waits until the name field is populated, then fills the mobile number.
  12  |    */
  13  |   async fillApplicantStep(mobileNumber: string) {
  14  |     await expect(async () => {
  15  |       if ((await this.locators.applicantNameInput().inputValue()) === '') {
  16  |         await this.page.reload();
  17  |       }
  18  |       await expect(this.locators.applicantNameInput()).not.toHaveValue('', { timeout: 3000 });
  19  |     }).toPass({ timeout: 30_000 });
  20  | 
  21  |     await this.locators.mobileNumberInput().fill(mobileNumber);
  22  | 
  23  |     // "حفظ ومتابعة" occasionally no-ops on its first click here: no request fires and step 1
  24  |     // stays put, without popping the error dialog clickSaveAndContinue already retries on.
  25  |     // Re-click until step 2 (the شكوى/طلب radio group) actually renders.
  26  |     await expect(async () => {
  27  |       await this.clickSaveAndContinue();
  28  |       await expect(this.locators.ticketTypeRadio('شكوى')).toBeVisible({ timeout: 3000 });
> 29  |     }).toPass({ timeout: 30_000 });
      |        ^ Error: Timeout 30000ms exceeded while waiting on the predicate
  30  |   }
  31  | 
  32  |   mobileNumberInput() {
  33  |     return this.locators.mobileNumberInput();
  34  |   }
  35  | 
  36  |   mobileNumberRequiredError() {
  37  |     return this.locators.mobileNumberRequiredError();
  38  |   }
  39  | 
  40  |   mobileNumberFormatError() {
  41  |     return this.locators.mobileNumberFormatError();
  42  |   }
  43  | 
  44  |   /**
  45  |    * Step 2 (بيانات التذكرة): ticket type, main/sub category, and problem details.
  46  |    * Some categories' dynamic form also requires طلبات المستفيد (requestDetails) — pass it
  47  |    * when the chosen category/subcategory renders that field.
  48  |    */
  49  |   async fillTicketDetailsStep(opts: {
  50  |     type: 'شكوى' | 'طلب';
  51  |     mainCategory: string;
  52  |     subCategory: string;
  53  |     details: string;
  54  |     requestDetails?: string;
  55  |   }) {
  56  |     await this.selectTicketTypeAndCategory(opts);
  57  |     await this.locators.detailsTextbox().fill(opts.details);
  58  |     if (opts.requestDetails) {
  59  |       await this.locators.requestDetailsTextbox().fill(opts.requestDetails);
  60  |     }
  61  |     await this.clickSaveAndContinue();
  62  |   }
  63  | 
  64  |   /** Ticket type + main/sub category, without touching التفاصيل — the fields that make it visible. */
  65  |   async selectTicketTypeAndCategory(opts: { type: 'شكوى' | 'طلب'; mainCategory: string; subCategory: string }) {
  66  |     await this.locators.ticketTypeRadio(opts.type).click();
  67  | 
  68  |     await this.locators.mainCategoryCombobox().click();
  69  |     await this.locators.categoryOption(opts.mainCategory).click();
  70  | 
  71  |     await this.locators.subCategoryCombobox().click();
  72  |     await this.locators.categoryOption(opts.subCategory).click();
  73  |   }
  74  | 
  75  |   detailsTextbox() {
  76  |     return this.locators.detailsTextbox();
  77  |   }
  78  | 
  79  |   detailsErrorMessage() {
  80  |     return this.locators.detailsErrorMessage();
  81  |   }
  82  | 
  83  |   requestDetailsTextbox() {
  84  |     return this.locators.requestDetailsTextbox();
  85  |   }
  86  | 
  87  |   deceasedIdInput() {
  88  |     return this.locators.deceasedIdInput();
  89  |   }
  90  | 
  91  |   deceasedIdError() {
  92  |     return this.locators.deceasedIdError();
  93  |   }
  94  | 
  95  |   heirsDeedNumberInput() {
  96  |     return this.locators.heirsDeedNumberInput();
  97  |   }
  98  | 
  99  |   heirsDeedNumberError() {
  100 |     return this.locators.heirsDeedNumberError();
  101 |   }
  102 | 
  103 |   async uploadAttachment(fileName: string = 'attachment.pdf') {
  104 |     await this.locators.attachmentFileInput().setInputFiles({
  105 |       name: fileName,
  106 |       mimeType: 'application/pdf',
  107 |       buffer: Buffer.from('%PDF-1.4\n%%EOF'),
  108 |     });
  109 |   }
  110 | 
  111 |   /**
  112 |    * Clicking "حفظ ومتابعة" can itself re-trigger the flaky verify-applicant call, popping
  113 |    * the same blank error dialog seen on step 1; dismiss it and retry the click until it advances.
  114 |    * Public because tests that expect this click to fail validation (and stay on the same step)
  115 |    * also need to trigger it directly.
  116 |    */
  117 |   async clickSaveAndContinue(maxAttempts: number = 5) {
  118 |     const errorBackButton = this.page.getByRole('dialog').getByRole('button', { name: 'العودة' });
  119 | 
  120 |     for (let attempt = 0; attempt < maxAttempts; attempt++) {
  121 |       await this.locators.saveAndContinueButton().click();
  122 |       await this.page.waitForLoadState('networkidle').catch(() => {});
  123 | 
  124 |       const blocked = await errorBackButton
  125 |         .waitFor({ state: 'visible', timeout: 2000 })
  126 |         .then(() => true)
  127 |         .catch(() => false);
  128 |       if (!blocked) return;
  129 | 
```