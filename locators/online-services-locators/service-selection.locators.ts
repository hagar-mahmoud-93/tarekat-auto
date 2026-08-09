import { Page } from '@playwright/test';

export class ServiceSelectionLocators {
  constructor(private readonly page: Page) {}

  /** The arrow icon button on a service-selection card, matched by the card's title text. */
  cardArrowButton(cardTitle: string) {
    return this.page.locator('.card').filter({ hasText: cardTitle }).getByRole('button');
  }
}
