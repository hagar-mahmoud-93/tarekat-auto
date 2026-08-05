import { Page } from '@playwright/test';

/** Valid mobile numbers here are 10 digits starting with 053 or 056. */
const VALID_MOBILE_NUMBER_PATTERN = /^(053|056)\d{7}$/;

function isValidMobileNumber(value: string): boolean {
  return VALID_MOBILE_NUMBER_PATTERN.test(value);
}

/**
 * Fills the mobile number when prompted, in either shape this can appear:
 * - Before starting the division: a "تحديث رقم الجوال" card wrapping the textbox.
 * - Before accepting the division (redirected to the approval page): a bare textbox, no card.
 * The card variant is filled only when empty or holding an invalid (non-053/056) number; the bare
 * textbox is always either empty or incorrect, so it's always filled.
 * Whichever shape it takes can render a moment after navigation, so this waits briefly before giving up.
 */
export async function fillMobileNumberIfPrompted(page: Page, mobileNumber: string = '0567654565'): Promise<void> {
  const card = page.getByText('تحديث رقم الجوال');
  const cardAppeared = await card
    .waitFor({ state: 'visible', timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  if (cardAppeared) {
    const mobileInput = card.locator('xpath=..').getByRole('textbox');
    const currentValue = await mobileInput.inputValue();

    if (!isValidMobileNumber(currentValue)) {
      await mobileInput.fill(mobileNumber);
    }
    return;
  }

  // On the approval page the textbox is always either empty or holding an incorrect number, never
  // already-valid, so it's always filled without checking its current value.
  const mobileInput = page.getByRole('textbox');
  const inputAppeared = await mobileInput
    .waitFor({ state: 'visible', timeout: 5000 })
    .then(() => true)
    .catch(() => false);
  if (!inputAppeared) return;

  await mobileInput.fill(mobileNumber);
}

