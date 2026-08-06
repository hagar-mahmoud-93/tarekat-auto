import { APIResponse } from '@playwright/test';
import { BaseApiClient } from './base.client';
import { loggedPost } from './log-request';

function randomDigits(length: number): string {
  let digits = '';
  for (let i = 0; i < length; i++) digits += Math.floor(Math.random() * 10);
  return digits;
}

/** 10-digit identity number starting with 1 or 2, per the seeder's identityType convention (1 or 2). */
function randomIdentityNumber(): string {
  const firstDigit = Math.random() < 0.5 ? '1' : '2';
  return firstDigit + randomDigits(9);
}

function identityTypeFor(identityNumber: string): 1 | 2 {
  return identityNumber.startsWith('1') ? 1 : 2;
}

function randomId(): number {
  return Number(`${1 + Math.floor(Math.random() * 9)}${randomDigits(4)}`);
}

export type SeedIdentity = { id: number; identityNumber: string; identityType: 1 | 2 };

function randomIdentity(): SeedIdentity {
  const identityNumber = randomIdentityNumber();
  return { id: randomId(), identityNumber, identityType: identityTypeFor(identityNumber) };
}

export type WitnessSeedData = SeedIdentity & { phoneNumber: string; birthDateHijri: string };

export type SeedDataResult = {
  response: APIResponse;
  deceasedIdentity: SeedIdentity;
  deceasedBirthDateHijri: string;
  beneficiaryRelationshipType: string;
  firstWitness: WitnessSeedData;
  secondWitness: WitnessSeedData;
};

export class GenerateSeedDataClient extends BaseApiClient {
  /** Seeds a Tawtheeq case with fresh id/identityNumber/identityType for the deceased, heir, and witnesses on each call. */
  async seed(): Promise<SeedDataResult> {
    const deceasedIdentity = randomIdentity();
    const deceasedBirthDateHijri = '1377/07/19';
    const beneficiaryRelationshipType = 'ابن';
    const heirIdentity = randomIdentity();
    const witnessIdentities = [randomIdentity(), randomIdentity()];
    const firstWitnessPhoneNumber = '0566787654';
    const firstWitnessBirthDateHijri = '1400/09/25';
    const secondWitnessPhoneNumber = '0566787456';
    const secondWitnessBirthDateHijri = '1411/01/23';
    const requestId = randomId();

    const payload = {
      deceased: {
        id: deceasedIdentity.id,
        identityNumber: deceasedIdentity.identityNumber,
        identityType: deceasedIdentity.identityType,
        firstName: 'سارة',
        middleName: 'سعد',
        lastName: 'أحمد',
        familyName: 'الدوسري',
        fullName: 'سارة سعد أحمد الدوسري',
        gender: 2,
        nationalityId: 1,
        birthDate: '1958-02-07T00:00:00',
        birthDateHijri: deceasedBirthDateHijri,
        deathDate: '2025-10-26T00:00:00',
        deathDateHijri: '1447/05/04',
        deathDocumentIssueDate: 'T00:00:00',
        deathDocumentIssueDateHijri: '',
      },
      beneficiary: {
        identityNumber: '1059608891',
        identityType: 1,
        firstName: 'عبدالرحمن',
        middleName: 'احمد',
        lastName: 'محمد',
        familyName: 'الدوسري',
        fullName: 'عبدالرحمن احمد محمد الدوسري',
        gender: 1,
        nationalityId: 1,
        birthDate: '1990-01-01T00:00:00',
        birthDateHijri: '1410/06/04',
        relationshipTypeId: 7,
        relationshipType: beneficiaryRelationshipType,
        beneficiaryTypeId: 1,
        agencyTypeId: 1,
      },
      heirs: [
        {
          id: heirIdentity.id,
          identityNumber: '1059608891',
          identityType: 1,
          firstName: 'عبدالرحمن',
          middleName: 'احمد',
          lastName: 'محمد',
          familyName: 'الدوسري',
          fullName: 'عبدالرحمن احمد محمد الدوسري',
          gender: 1,
          nationalityId: 1,
          birthDate: '1990-01-01T00:00:00',
          birthDateHijri: '1410/06/04',
          relationshipTypeId: 7,
          relationshipType: 'ابن',
          isMinor: false,
          isAdult: true,
          isWifePregnant: null,
          isDead: false,
        },
        {
          id: heirIdentity.id,
          identityNumber: heirIdentity.identityNumber,
          identityType: heirIdentity.identityType,
          firstName: 'عبدالرحمن',
          middleName: 'احمد',
          lastName: 'محمد',
          familyName: 'الدوسري',
          fullName: 'عبدالعليم احمد محمد الدوسري',
          gender: 1,
          nationalityId: 1,
          birthDate: '2001-10-07T00:00:00',
          birthDateHijri: '1422/07/20',
          relationshipTypeId: 7,
          relationshipType: 'ابن',
          isMinor: false,
          isAdult: true,
          isWifePregnant: null,
          isDead: false,
        },
      ],
      infant: null,
      witnesses: [
        {
          id: witnessIdentities[0].id,
          identityNumber: witnessIdentities[0].identityNumber,
          identityType: witnessIdentities[0].identityType,
          firstName: 'احمد',
          middleName: 'محمد',
          lastName: 'احمد',
          familyName: 'عبدالله',
          fullName: 'احمد محمد احمد عبدالله',
          gender: 1,
          nationalityId: 1,
          birthDate: '1980-08-07T00:00:00',
          birthDateHijri: firstWitnessBirthDateHijri,
          phoneNumber: firstWitnessPhoneNumber,
          relationshipTypeId: 13,
        },
        {
          id: witnessIdentities[1].id,
          identityNumber: witnessIdentities[1].identityNumber,
          identityType: witnessIdentities[1].identityType,
          firstName: 'عبدالله',
          middleName: 'احمد',
          lastName: 'عبدالله',
          familyName: 'الاحمد',
          fullName: 'عبدالله احمد عبدالله الاحمد',
          gender: 1,
          nationalityId: 1,
          birthDate: '1990-08-13T00:00:00',
          birthDateHijri: secondWitnessBirthDateHijri,
          phoneNumber: secondWitnessPhoneNumber,
          relationshipTypeId: 13,
        },
      ],
      wakala: [],
      custodianships: [],
      request: {
        id: requestId,
        requestNumber: `QA-SEED-${requestId}`,
        infantRequestId: 600002,
        infantRequestNumber: '800002',
      },
      _name: `seed-${requestId}`,
    };

    const response = await loggedPost(this.request, 'GenerateSeedData', `${this.baseURL}/api/seeder/tawtheeq`, {
      data: payload,
      headers: {
        accept: '*/*',
        'content-type': 'application/json',
        origin: this.baseURL,
        referer: `${this.baseURL}/tawtheeq-seeder`,
      },
    });

    const firstWitness: WitnessSeedData = {
      ...witnessIdentities[0],
      phoneNumber: firstWitnessPhoneNumber,
      birthDateHijri: firstWitnessBirthDateHijri,
    };

    const secondWitness: WitnessSeedData = {
      ...witnessIdentities[1],
      phoneNumber: secondWitnessPhoneNumber,
      birthDateHijri: secondWitnessBirthDateHijri,
    };

    return {
      response,
      deceasedIdentity,
      deceasedBirthDateHijri,
      beneficiaryRelationshipType,
      firstWitness,
      secondWitness,
    };
  }
}
