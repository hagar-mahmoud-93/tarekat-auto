import { Page } from '@playwright/test';
import { DivisionAdminPage } from '../pages/division-admin.page';

export async function openDivisionDashboard(page: Page, inheritanceId: string): Promise<void> {
  const divisionAdminPage = new DivisionAdminPage(page);
  await divisionAdminPage.open();
  await divisionAdminPage.searchByInheritanceId(inheritanceId);
  await divisionAdminPage.openDashboard();
}
