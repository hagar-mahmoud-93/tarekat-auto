import { Page } from '@playwright/test';

/**
 * If the "تحديث رقم الجوال" card is shown and the mobile number field is empty, fills it.
 * The card can render a moment after navigation, so this waits briefly for it before giving up.
 */
export async function fillMobileNumberIfPrompted(page: Page, mobileNumber: string = '0566776677'): Promise<void> {
  const card = page.getByText('تحديث رقم الجوال');
  const appeared = await card
    .waitFor({ state: 'visible', timeout: 5000 })
    .then(() => true)
    .catch(() => false);
  if (!appeared) return;

  const mobileInput = card.locator('xpath=..').getByRole('textbox');
  if ((await mobileInput.inputValue()) === '') {
    await mobileInput.fill(mobileNumber);
  }
}
