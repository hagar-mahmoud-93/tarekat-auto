# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: divisionsFlows/divisionBlockers.spec.ts >> Division blockers >> Investment division is blocked when a heir is a minor @division @investment-division
- Location: tests/divisionsFlows/divisionBlockers.spec.ts:42:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog').filter({ has: getByRole('button', { name: 'العودة' }) })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('dialog').filter({ has: getByRole('button', { name: 'العودة' }) })

```

```yaml
- link:
  - /url: /
  - img
- link "الصفحة الرئيسية":
  - /url: /dashboard
  - img
  - text: الصفحة الرئيسية
- link "الطلبات":
  - /url: /my-orders
  - img
  - text: الطلبات
- link "الخدمات الإلكترونية":
  - /url: /online-services
  - img
  - text: الخدمات الإلكترونية
- link "طلبات المصادقة":
  - /url: /witness-testimonial
  - img
  - text: طلبات المصادقة
- link "الملف الشخصي":
  - /url: /my-profile?type=profile
  - img
  - text: الملف الشخصي
- link "المساعدة":
  - /url: /help
  - img
  - text: المساعدة
- img
- img
- text: 1448/03/08
- img
- text: 02:11 pm
- img
- text: مريم سعد أحمد العتيبي
- img
- text: خروج
- img
- text: قسمة الموجودات الاستثمارية القسمة المقترحة الاستجابات الأصول المحافظ - الحسابات حالة التوزيع
- img
- paragraph: ملاحظة
- list:
  - listitem: تعكس البيانات الظاهرة لمقترح القسمة الاتفاقية النصيب النظامي لكل وارث ولا يمكن التعديل عليها.
  - listitem: سيتم تطبيق خيار النقل على جميع الموجودات الاستثمارية بشكل موحّد لجميع الورثة، حسب ما تم تقديمه من قبل مقدّم الطلب عند تقديم طلب القسمة.
  - listitem: في حال نقل الموجودات الاستثمارية، يتطلب توفر محفظة استثمارية نشطة للوارث.
  - listitem: سيتم قسمة الموجودات الاستثمارية حسب الأنصبة أدناه بإستثناء الشهادات و الصناديق و المشتقات الاستثمارية إن وجدت، حيث لا يمكن قسمتها حالياً عبر المنصة.
- button "المحافظ الاستثمارية" [expanded]:
  - img
  - heading "المحافظ الاستثمارية" [level=3]
  - img
- region "المحافظ الاستثمارية":
  - button "رقم المحفظة الاستثمارية:PORT6539199088" [expanded]:
    - paragraph: رقم المحفظة الاستثمارية:PORT6539199088
  - region "رقم المحفظة الاستثمارية:PORT6539199088":
    - img
    - paragraph: البنك السعودي الأول
    - list:
      - listitem: وسيط التداول QA Seeder Broker
      - listitem: عدد الأسهم الكلي القابل للقسمة 10 أسهم
      - listitem: محلي نعم
      - listitem: عدد الأسهم الكلي 10 أسهم
    - table:
      - rowgroup:
        - row "اسم الوارث نصيب الوارث النظامي صلة القرابة الأسهم القابلة للقسمة لكل وارث":
          - columnheader "اسم الوارث"
          - columnheader "نصيب الوارث النظامي"
          - columnheader "صلة القرابة"
          - columnheader "الأسهم القابلة للقسمة لكل وارث"
      - rowgroup:
        - row "مريم سعد أحمد العتيبي %50.00 1/2 ابن 5 أسهم":
          - cell "مريم سعد أحمد العتيبي":
            - paragraph: مريم سعد أحمد العتيبي
          - cell "%50.00 1/2"
          - cell "ابن"
          - cell "5 أسهم"
    - button "عرض جميع الورثة":
      - text: عرض جميع الورثة
      - img
- heading "ملخص الموجودات الاستثمارية الخاصة بك" [level=1]
- table:
  - rowgroup:
    - row "إسم الشركة نوع الموجودات الاستثمارية إجمالي عدد الموجودات القابل للتقسيم إجمالي عدد الموجودات غير القابلة للتقسيم (بيع)":
      - columnheader "إسم الشركة"
      - columnheader "نوع الموجودات الاستثمارية"
      - columnheader "إجمالي عدد الموجودات القابل للتقسيم"
      - columnheader "إجمالي عدد الموجودات غير القابلة للتقسيم (بيع)"
  - rowgroup:
    - row "QA Seeder Broker المحافظ 10أسهم 0أسهم":
      - cell "QA Seeder Broker"
      - cell "المحافظ"
      - cell "10أسهم"
      - cell "0أسهم"
- textbox "رقم الجوال": "0561220696"
- text: رقم الجوال
- heading "إقرار وتعهد" [level=1]
- checkbox
- paragraph: أُقر بأنني اطلعت على بنود القسمة الاتفاقية للأموال النقدية وأوافق عليها، وألتزم بما ورد فيها، وأطلب تنفيذها وتسليمي نصيبي النظامي منها.
- button "الموافقة على القسمة" [disabled]
- button "غير موافق"
- img
- text: نسخة تجريبية ﻣﻨﺼﺔ إﻟﻜﺘﺮوﻧﻴﺔ ﺗﺤﺖ إﺷﺮاف وزارة اﻟﻌﺪل، ﺗﻬﺪف إﻟﻰ ﺗﻴﺴﻴﺮ اﻟﻌﻤﻠﻴﺎت اﻟﻤﺮﺗﺒﻄﺔ ﺑﺈدارة اﻟﺘﺮﻛﺎت وﺣﻔﻆ ﺣﻘﻮق اﻟﻮرﺛﺔ وﻫﻲ إﺣﺪى ﻣﻨﺘﺠﺎت اﻟﻌﺪاﻟﺔ اﻟﻮﻗﺎﺋﻴﺔ.
- img
- img
- img
- img
- img
- img
- link "سياسة الخصوصية":
  - /url: /privacy-policy
- link "شروط وأحكام الخدمات الإلكترونية":
  - /url: /terms-of-use
- text: جميع الحقوق محفوظة لمنصة التركات © 2026
- img "مساعدة في استخدام الموقع"
```

# Test source

```ts
  1   | import { test, expect } from '../../fixtures/base.fixture';
  2   | import { env } from '../../config/env';
  3   | import { CashDivisionsPage } from '../../pages/division-pages/cash-divisions.page';
  4   | import { InvestmentDivisionsPage } from '../../pages/division-pages/investment-divisions.page';
  5   | import { DataPreparation } from '../../steps/data-preparation';
  6   | import { DivisionsList } from '../../steps/divisions-list';
  7   | import { fillMobileNumberIfPrompted } from '../../steps/fill-mobile-number';
  8   | 
  9   | test.describe('Division blockers', () => {
  10  | 
  11  |   test('Cash division is blocked when a heir is a minor @division @cash-division', async ({ seederPage, request }) => {
  12  |     test.setTimeout(120_000);
  13  |     test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');
  14  | 
  15  |     let result: Awaited<ReturnType<DataPreparation['seedCase']>>['result'];
  16  |     let beneficiaryTab: Awaited<ReturnType<DataPreparation['seedCase']>>['beneficiaryTab'];
  17  |     let cashDivisionsPage: CashDivisionsPage;
  18  | 
  19  |     await test.step('Seed a case with one minor heir and open the divisions listing', async () => {
  20  |       const dataPreparation = new DataPreparation(seederPage, request);
  21  |       ({ result, beneficiaryTab } = await dataPreparation.seedCase(undefined, { minorHeirIndex: 1 }));
  22  | 
  23  |       expect(result.json.heirs.some((heir) => heir.isMinor)).toBeTruthy();
  24  | 
  25  |       const divisionsList = new DivisionsList(beneficiaryTab, result);
  26  |       await divisionsList.run();
  27  | 
  28  |       cashDivisionsPage = new CashDivisionsPage(beneficiaryTab);
  29  |     });
  30  | 
  31  |     await test.step('Beneficiary attempts to start the cash division and is blocked', async () => {
  32  |       await cashDivisionsPage.showAssets();
  33  |       await fillMobileNumberIfPrompted(beneficiaryTab);
  34  |       await cashDivisionsPage.acceptDivisionAgreement();
  35  |       await cashDivisionsPage.startDivision();
  36  | 
  37  |       await expect(cashDivisionsPage.blockerDialog()).toBeVisible();
  38  |       await expect(cashDivisionsPage.blockerDialog()).toContainText('قاصر');
  39  |     });
  40  |   });
  41  | 
  42  |   test('Investment division is blocked when a heir is a minor @division @investment-division', async ({ seederPage, request }) => {
  43  |     test.setTimeout(120_000);
  44  |     test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');
  45  | 
  46  |     let result: Awaited<ReturnType<DataPreparation['seedCase']>>['result'];
  47  |     let beneficiaryTab: Awaited<ReturnType<DataPreparation['seedCase']>>['beneficiaryTab'];
  48  |     let investmentDivisionsPage: InvestmentDivisionsPage;
  49  | 
  50  |     await test.step('Seed a case with one minor heir and open the divisions listing', async () => {
  51  |       const dataPreparation = new DataPreparation(seederPage, request);
  52  |       ({ result, beneficiaryTab } = await dataPreparation.seedCase(undefined, { minorHeirIndex: 1 }));
  53  | 
  54  |       expect(result.json.heirs.some((heir) => heir.isMinor)).toBeTruthy();
  55  | 
  56  |       const divisionsList = new DivisionsList(beneficiaryTab, result);
  57  |       await divisionsList.run();
  58  | 
  59  |       investmentDivisionsPage = new InvestmentDivisionsPage(beneficiaryTab);
  60  |     });
  61  | 
  62  |     await test.step('Beneficiary attempts to start the investment division and is blocked', async () => {
  63  |       await investmentDivisionsPage.showAssets();
  64  |       await fillMobileNumberIfPrompted(beneficiaryTab);
  65  |       await investmentDivisionsPage.acceptDivisionAgreement();
  66  |       await investmentDivisionsPage.startDivision();
  67  | 
> 68  |       await expect(investmentDivisionsPage.blockerDialog()).toBeVisible();
      |                                                             ^ Error: expect(locator).toBeVisible() failed
  69  |       await expect(investmentDivisionsPage.blockerDialog()).toContainText('قاصر');
  70  |     });
  71  |   });
  72  | 
  73  |   test('Cash division is blocked when a heir is dead @division @cash-division', async ({ seederPage, request }) => {
  74  |     test.setTimeout(120_000);
  75  |     test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');
  76  | 
  77  |     let result: Awaited<ReturnType<DataPreparation['seedCase']>>['result'];
  78  |     let beneficiaryTab: Awaited<ReturnType<DataPreparation['seedCase']>>['beneficiaryTab'];
  79  |     let cashDivisionsPage: CashDivisionsPage;
  80  | 
  81  |     await test.step('Seed a case with one dead heir and open the divisions listing', async () => {
  82  |       const dataPreparation = new DataPreparation(seederPage, request);
  83  |       ({ result, beneficiaryTab } = await dataPreparation.seedCase(undefined, { deadHeirIndex: 1 }));
  84  | 
  85  |       expect(result.json.heirs.some((heir) => heir.isDead)).toBeTruthy();
  86  | 
  87  |       const divisionsList = new DivisionsList(beneficiaryTab, result);
  88  |       await divisionsList.run();
  89  | 
  90  |       cashDivisionsPage = new CashDivisionsPage(beneficiaryTab);
  91  |     });
  92  | 
  93  |     await test.step('Beneficiary attempts to start the cash division and is blocked', async () => {
  94  |       await cashDivisionsPage.showAssets();
  95  |       await fillMobileNumberIfPrompted(beneficiaryTab);
  96  |       await cashDivisionsPage.acceptDivisionAgreement();
  97  |       await cashDivisionsPage.startDivision();
  98  | 
  99  |       await expect(cashDivisionsPage.blockerDialog()).toBeVisible();
  100 |       await expect(cashDivisionsPage.blockerDialog()).toContainText('يجب وجود حصر ورثة للوارث المتوفى');
  101 |     });
  102 |   });
  103 | 
  104 |   test('Investment division is blocked when a heir is dead @division @investment-division', async ({ seederPage, request }) => {
  105 |     test.setTimeout(120_000);
  106 |     test.skip(!env.admin.username || !env.admin.password, 'ADMIN_USERNAME/ADMIN_PASSWORD not set');
  107 | 
  108 |     let result: Awaited<ReturnType<DataPreparation['seedCase']>>['result'];
  109 |     let beneficiaryTab: Awaited<ReturnType<DataPreparation['seedCase']>>['beneficiaryTab'];
  110 |     let investmentDivisionsPage: InvestmentDivisionsPage;
  111 | 
  112 |     await test.step('Seed a case with one dead heir and open the divisions listing', async () => {
  113 |       const dataPreparation = new DataPreparation(seederPage, request);
  114 |       ({ result, beneficiaryTab } = await dataPreparation.seedCase(undefined, { deadHeirIndex: 1 }));
  115 | 
  116 |       expect(result.json.heirs.some((heir) => heir.isDead)).toBeTruthy();
  117 | 
  118 |       const divisionsList = new DivisionsList(beneficiaryTab, result);
  119 |       await divisionsList.run();
  120 | 
  121 |       investmentDivisionsPage = new InvestmentDivisionsPage(beneficiaryTab);
  122 |     });
  123 | 
  124 |     await test.step('Beneficiary attempts to start the investment division and is blocked', async () => {
  125 |       await investmentDivisionsPage.showAssets();
  126 |       await fillMobileNumberIfPrompted(beneficiaryTab);
  127 |       await investmentDivisionsPage.acceptDivisionAgreement();
  128 |       await investmentDivisionsPage.startDivision();
  129 | 
  130 |       await expect(investmentDivisionsPage.blockerDialog()).toBeVisible();
  131 |       await expect(investmentDivisionsPage.blockerDialog()).toContainText(
  132 |         'نحيطكم بأنه لا يمكن القسمة الاتفاقية للتركة من خلال منصة التركات',
  133 |       );
  134 |     });
  135 |   });
  136 | });
  137 | 
```