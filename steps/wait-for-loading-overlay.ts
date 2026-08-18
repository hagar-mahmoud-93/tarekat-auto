import { Page } from '@playwright/test';

/**
 * Waits out the full-screen loading overlay shown briefly after wizard step navigation. The overlay
 * covers the next step's already-rendered content, so clicks/fills land on it instead of the real
 * field (Playwright's actionability checks see the target as "visible" since covering doesn't affect
 * that check) unless we explicitly wait for it to disappear first.
 */
export async function waitForLoadingOverlayToDisappear(page: Page): Promise<void> {
  const overlay = page.locator('.fixed.inset-0.bg-black.opacity-60').first();
  const appeared = await overlay
    .waitFor({ state: 'visible', timeout: 1000 })
    .then(() => true)
    .catch(() => false);
  if (!appeared) return;

  await overlay.waitFor({ state: 'hidden', timeout: 15000 });
}
