import { APIRequestContext } from '@playwright/test';
import { expect } from '../fixtures/base.fixture';
import { SeedManagementClient } from '../api/clients/seed-management.client';

/** Deletes a previously seeded Tawtheeq case and verifies the deletion succeeded. */
export async function deleteSeed(request: APIRequestContext, baseURL: string, requestNumber: string): Promise<void> {
  const seedManagementClient = new SeedManagementClient(request, baseURL);
  const response = await seedManagementClient.deleteSeed(requestNumber);

  expect(response.ok()).toBeTruthy();
}
