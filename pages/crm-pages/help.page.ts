import { BasePage } from '../base.page';
import { HelpLocators } from '../../locators/help-center.locators';

export class HelpPage extends BasePage {
  private readonly locators = new HelpLocators(this.page);

  /** Navigates to مركز المساعدة via the "المساعدة" nav link. */
  async open() {
    await this.locators.helpNavLink().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** Opens the تذاكر الدعم tickets listing (/help/complaints). */
  async openSupportTickets() {
    await this.locators.supportTicketsCard().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** Opens the new-ticket wizard (/help/complaints/create). */
  async createNewTicket() {
    await this.locators.createTicketButton().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** Opens the الأسئلة الشائعة FAQ page (/help/faq). */
  async openFaq() {
    await this.locators.faqCard().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  /** Opens the اتصل بنا contact page (/help/contact-us). */
  async openContactUs() {
    await this.locators.contactUsCard().click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  noTicketsHeading() {
    return this.locators.noTicketsHeading();
  }
}
