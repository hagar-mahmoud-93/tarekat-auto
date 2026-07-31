import { Page } from '@playwright/test';

export class HelpLocators {
  constructor(private readonly page: Page) {}

  helpNavLink() {
    return this.page.getByRole('link', { name: 'المساعدة' });
  }

  /** The "تذاكر الدعم" card's button on the مركز المساعدة page. */
  supportTicketsCard() {
    return this.page.locator('div').filter({ hasText: 'تذاكر الدعم' }).last().getByRole('button');
  }

  /** The "إنشاء تذكرة" button on the tickets listing (/help/complaints). */
  createTicketButton() {
    return this.page.getByRole('button', { name: 'إنشاء تذكرة' });
  }

  /** The "لا يوجد تذاكر" empty-state heading on the tickets listing. */
  noTicketsHeading() {
    return this.page.getByRole('heading', { name: 'لا يوجد تذاكر' });
  }
}
