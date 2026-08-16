import { Page } from '@playwright/test';

/** Asset/rights card labels under "أصول التركة" / "الحقوق على التركة" in the حصر التركة tab. */
export type EstateAssetCard =
  | 'الأموال النقدية'
  | 'الموجودات الاستثمارية'
  | 'عقارات'
  | 'الإقرارات'
  | 'سندات'
  | 'السجلات التجارية'
  | 'الديون الموثقة'
  | 'وصايا';

export class EstateInventoryLocators {
  constructor(private readonly page: Page) {}

  /** Same tabs container as `RequestsLocators.divisionsTabsContainer()` on the case-details view. */
  private tabsContainer() {
    return this.page.locator('//*[@id="app"]/div/div/div[3]/div/div[2]/div/div[1]/div[3]/div');
  }

  tab() {
    return this.tabsContainer().getByText('حصر التركة', { exact: true });
  }

  heading() {
    return this.page.getByRole('heading', { name: 'حصر التركة', exact: true });
  }

  /**
   * One "أصول التركة"/"الحقوق على التركة" card, scoped by its own heading. Matched on the
   * bordered card div (`rounded-md border`) rather than a plain `div` filter, since a plain
   * `div` filter's `.last()` resolves to the innermost heading+description wrapper and misses
   * the status/button content rendered as a DOM sibling of that wrapper, not a descendant.
   */
  card(name: EstateAssetCard) {
    return this.page.locator('div.rounded-md.border').filter({
      has: this.page.getByRole('heading', { name, exact: true }),
    });
  }

  /** "حالة الاستعلام: تم التنفيذ" status shown on a queried (populated) card. */
  cardStatus(name: EstateAssetCard) {
    return this.card(name).getByText('تم التنفيذ');
  }

  viewAssetsButton(name: EstateAssetCard) {
    return this.card(name).getByRole('button', { name: 'عرض الأصول' });
  }

  /** Empty-state text for a card with no data, e.g. "لا يوجد عقارات" / "لا توجد سندات". */
  emptyStateText(name: EstateAssetCard, text: string) {
    return this.card(name).getByText(text, { exact: true });
  }

  downloadFullDocumentButton() {
    return this.page.getByRole('button', { name: 'تحميل وثيقة حصر التركة الكاملة' });
  }

  requeryButton() {
    return this.page.getByRole('button', { name: 'إعادة الاستعلام' });
  }

  acknowledgeDebtButton() {
    return this.page.getByRole('button', { name: 'إقرار عن دين للتركة' });
  }

  startJudicialDivisionButton() {
    return this.page.getByRole('button', { name: 'بدء القسمة القضائية' });
  }

  /**
   * A step's own container in the حصر الورثة → حصر التركة → قسمة التركة progress stepper above
   * the tabs, scoped by its label so its date/status text can be read without ambiguity (the
   * label text alone matches 4x on the page — stepper + tab, each duplicated for a responsive
   * layout — `.first()` resolves to the stepper instance since it renders before the tabs row).
   */
  stepperStep(label: 'حصر الورثة' | 'حصر التركة' | 'قسمة التركة') {
    return this.page.getByText(label, { exact: true }).first().locator('xpath=ancestor::div[1]');
  }
}
