const { chromium } = require('@playwright/test');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../../../../../Users/sitechmac/tarekat-auto/.env') });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const adminBase = process.env.ADMIN_API_URL || 'https://ops-merath.api.azm-dev.com/admin';
  await page.goto(`${adminBase}/inheritance/settings/8/change/?_changelist_filters=all%3D`);

  // Log in if redirected to login form
  const usernameField = page.locator('#id_username');
  if (await usernameField.isVisible().catch(() => false)) {
    await usernameField.fill(process.env.ADMIN_USERNAME);
    await page.locator('#id_password').fill(process.env.ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForLoadState('networkidle').catch(() => {});
  }

  console.log('URL:', page.url());
  console.log('Title:', await page.title());

  // Dump the form fieldsets
  const html = await page.locator('#content-main, #content').first().innerHTML().catch(() => 'NO CONTENT FOUND');
  console.log('----- FORM HTML -----');
  console.log(html.slice(0, 6000));

  await browser.close();
})();
