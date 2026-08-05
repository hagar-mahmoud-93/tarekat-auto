import { Page } from '@playwright/test';
import { DivisionAdminPage } from '../pages/division-pages/division-admin.page';

export async function openDivisionDashboard(adminPage: Page, inheritanceId: string): Promise<string> {
  const divisionAdminPage = new DivisionAdminPage(adminPage);
  await divisionAdminPage.open();
  await divisionAdminPage.searchByInheritanceId(inheritanceId);
  const divisionId = await divisionAdminPage.openDashboard();
  console.log('Division dashboard URL:', adminPage.url());
  return divisionId;
}
