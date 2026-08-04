import { Page } from '@playwright/test';

/** 052 is not a valid mobile prefix here; normalize it to 051. */
function normalizeMobileNumber(mobileNumber: string): string {
  return mobileNumber.startsWith('052') ? `051${mobileNumber.slice(3)}` : mobileNumber;
}

/**
 * If the "تحديث رقم الجوال" card is shown, fills the mobile number field when empty,
 * or corrects it when it already holds an invalid 052-prefixed number.
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
  const currentValue = await mobileInput.inputValue();

  if (currentValue === '') {
    await mobileInput.fill(normalizeMobileNumber(mobileNumber));
  }
  if (currentValue.startsWith('052')) {
    await mobileInput.fill(normalizeMobileNumber(mobileNumber));
  }
}

