import { APIRequestContext } from '@playwright/test';
import { expect } from '../fixtures/base.fixture';
import { SeedManagementClient, SeedIdentity, WitnessSeedData } from '../api/clients/seed-management.client';

export type MockSeedData = {
  deceasedIdentity: SeedIdentity;
  deceasedBirthDateHijri: string;
  beneficiaryRelationshipType: string;
  firstWitness: WitnessSeedData;
  secondWitness: WitnessSeedData;
};

/** Seeds a fresh Tawtheeq mock case (deceased + witness identities) and asserts the seed succeeded. */
export async function mockSeedDataPreparation(request: APIRequestContext, baseURL: string): Promise<MockSeedData> {
  const seedManagementClient = new SeedManagementClient(request, baseURL);
  const { response, deceasedIdentity, deceasedBirthDateHijri, beneficiaryRelationshipType, firstWitness, secondWitness } =
    await seedManagementClient.seed();

  expect(response.ok()).toBeTruthy();

  return { deceasedIdentity, deceasedBirthDateHijri, beneficiaryRelationshipType, firstWitness, secondWitness };
}
