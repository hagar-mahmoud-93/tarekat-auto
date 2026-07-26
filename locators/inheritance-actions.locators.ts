import { Page } from '@playwright/test';

export class InheritanceActionsLocators {
  constructor(private readonly page: Page) {}

  auditorStatusSelect() {
    return this.page.locator('#id_auditor_status');
  }

  saveButton() {
    return this.page.locator('input[name="_save"]');
  }
}
