import { APIRequestContext } from '@playwright/test';
import { expect } from '../fixtures/base.fixture';
import { GenerateSeedDataClient } from '../api/clients/generate-seed-data.client';

/** Deletes a previously seeded Tawtheeq case and verifies the deletion succeeded. */
export async function deleteSeed(request: APIRequestContext, baseURL: string, requestNumber: string): Promise<void> {
  const generateSeedDataClient = new GenerateSeedDataClient(request, baseURL);
  const response = await generateSeedDataClient.deleteSeed(requestNumber);

  expect(response.ok()).toBeTruthy();
}
