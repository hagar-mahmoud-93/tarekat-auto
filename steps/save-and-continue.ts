import { Page } from '@playwright/test';

/** Clicks حفظ ومتابعة, the footer control shared across all طلب حصر ورثة wizard steps. */
export async function saveAndContinue(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'حفظ ومتابعة' }).click();
}
