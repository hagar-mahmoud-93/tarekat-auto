import { BasePage } from '../base.page';
import { EstateInventoryLocators, EstateAssetCard } from '../../locators/ui-division-locators/estate-inventory.locators';

export class EstateInventoryPage extends BasePage {
  private readonly locators = new EstateInventoryLocators(this.page);

  /**
   * Opens the حصر التركة tab from the case-details view (call after `RequestsPage.openCaseDetails()`).
   * The tab's panel content loads async after the click, so this waits for the "أصول التركة"
   * section heading rather than trusting `networkidle` alone.
   */
  async open() {
    await this.locators.tab().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.getByRole('heading', { name: 'أصول التركة', exact: true }).waitFor({ state: 'visible', timeout: 15000 });
  }

  heading() {
    return this.locators.heading();
  }

  /** One "أصول التركة"/"الحقوق على التركة" card, e.g. 'الأموال النقدية'. */
  card(name: EstateAssetCard) {
    return this.locators.card(name);
  }

  /** "حالة الاستعلام: تم التنفيذ" status shown on a queried (populated) card. */
  cardStatus(name: EstateAssetCard) {
    return this.locators.cardStatus(name);
  }

  viewAssetsButton(name: EstateAssetCard) {
    return this.locators.viewAssetsButton(name);
  }

  /** Empty-state text for a card with no data, e.g. "لا يوجد عقارات" / "لا توجد سندات". */
  emptyStateText(name: EstateAssetCard, text: string) {
    return this.locators.emptyStateText(name, text);
  }

  downloadFullDocumentButton() {
    return this.locators.downloadFullDocumentButton();
  }

  requeryButton() {
    return this.locators.requeryButton();
  }

  acknowledgeDebtButton() {
    return this.locators.acknowledgeDebtButton();
  }

  startJudicialDivisionButton() {
    return this.locators.startJudicialDivisionButton();
  }

  /** The حصر الورثة / حصر التركة / قسمة التركة progress stepper above the case-details tabs. */
  stepperStep(label: 'حصر الورثة' | 'حصر التركة' | 'قسمة التركة') {
    return this.locators.stepperStep(label);
  }
}
