import { BasePage } from '../base.page';
import { WitnessDataLocators } from '../../locators/heirs-determination-locators/witness-data.locators';

const ID_TYPE_BY_IDENTITY_TYPE: Record<1 | 2, string> = {
  1: 'هوية وطنية',
  2: 'إقامة',
};

export class WitnessDataPage extends BasePage {
  private readonly locators = new WitnessDataLocators(this.page);

  /**
   * Opens صلة قرابة الشاهد بالمورث and picks the first option in the list. The panel virtual-scrolls
   * ~90 options, but the first one is already rendered on open, so clicking it needs no scrolling.
   * Keyboard selection (ArrowDown+Enter) does not commit a value in this component, despite
   * highlighting an option - it must be clicked. The virtual list keeps nudging its own scroll
   * position (re-centering on the highlighted item as it re-renders), so a real mouse click - even
   * forced - can miss: Playwright computes the click coordinates from the option's bounding box,
   * which can go stale between that read and the event firing. Dispatch the click in-page instead,
   * directly on the element, so it lands regardless of where the list has scrolled it to.
   */
  async selectAnyRelationToDeceased() {
    await this.locators.relationToDeceasedDropdown().click();
    await this.locators.relationToDeceasedOptions().first().evaluate((el: HTMLElement) => el.click());

    // Selecting an option doesn't reliably auto-close the panel, and Escape does nothing unless
    // focus is actually on the filter input - after clicking the option, focus is left elsewhere,
    // so the panel's own Escape handler never fires and CI has seen it stay open indefinitely,
    // intercepting the next dropdown's click. Explicitly focus the filter input first so Escape
    // reaches its handler, then confirm the panel actually disappears before moving on.
    await this.locators.relationToDeceasedFilterInput().focus();
    await this.page.keyboard.press('Escape');
    await this.locators.relationToDeceasedFilterInput().waitFor({ state: 'hidden' });
  }

  async fillMobileNumber(mobileNumber: string) {
    await this.locators.mobileNumberInput().fill(mobileNumber);
  }

  /** Opens the نوع الهوية dropdown and picks هوية وطنية for identityType 1, إقامة for identityType 2. */
  async selectIdTypeForIdentityType(identityType: 1 | 2) {
    await this.locators.idTypeDropdown().click();
    await this.locators.idTypeOption(ID_TYPE_BY_IDENTITY_TYPE[identityType]).click();

    // Selecting an option doesn't reliably auto-close the panel, and CI has seen it stay open
    // long enough to intercept the next click. Confirm it actually disappears instead of assuming
    // Escape closed it.
    await this.page.keyboard.press('Escape');
    await this.locators.idTypeDropdownPanel().waitFor({ state: 'hidden' });
  }

  async fillIdNumber(idNumber: string) {
    await this.locators.idNumberInput().fill(idNumber);
  }

  /** Filling opens the تاريخ الميلاد calendar popup, which stays open and can intercept later
   *  clicks (e.g. تحقق) unless dismissed. Escape doesn't reliably close it under load either, so
   *  confirm it actually disappears instead of assuming the keypress worked. */
  async fillBirthDateHijri(birthDateHijri: string) {
    await this.locators.birthDateInput().fill(birthDateHijri);
    await this.page.keyboard.press('Escape');
    await this.locators.birthDateCalendarPanel().waitFor({ state: 'hidden' });
  }

  async verify() {
    await this.locators.verifyButton().click();
  }
}
