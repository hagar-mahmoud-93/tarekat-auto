import { Page } from '@playwright/test';
import { DivisionAdminPage } from '../pages/division-admin.page';

export async function openDivisionDashboard(adminPage: Page, inheritanceId: string): Promise<void> {
  const divisionAdminPage = new DivisionAdminPage(adminPage);
  await divisionAdminPage.open();
  await divisionAdminPage.searchByInheritanceId(inheritanceId);
  await divisionAdminPage.openDashboard();
}
