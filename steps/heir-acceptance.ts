import { Page } from '@playwright/test';
import { SeederPage, SeedResult } from '../pages/seeder.page';
import { RequestsPage } from '../pages/division-pages/requests.page';
import { CashDivisionsPage } from '../pages/division-pages/cash-divisions.page';
import { fillMobileNumberIfPrompted } from './fill-mobile-number';

type DivisionPage = {
  viewDivision(): Promise<void>;
  waitForProposedDivisionCard(): Promise<void>;
  acceptDivisionAgreement(): Promise<void>;
  acceptDivision(): Promise<void>;
};

export class HeirAcceptance {
  constructor(
    private readonly seederPage: SeederPage,
    private readonly result: SeedResult,
    private readonly DivisionPage: new (page: Page) => DivisionPage = CashDivisionsPage,
  ) {}

  /** Logs in as every heir other than the beneficiary and accepts the division. */
  async run(): Promise<void> {
    const otherHeirs = this.result.json.heirs.filter(
      (heir) => heir.identityNumber !== this.result.json.beneficiary.identityNumber,
    );

    for (const heir of otherHeirs) {
      const heirTab = await this.seederPage.loginAsUser(heir.identityNumber);
      //await fillMobileNumberIfPrompted(heirTab);

      const requestsPage = new RequestsPage(heirTab);
      await requestsPage.open();
      await requestsPage.openCaseDetails();
      await requestsPage.openDivisionsListingTab();

      const divisionPage = new this.DivisionPage(heirTab);
      await divisionPage.viewDivision();
      await divisionPage.waitForProposedDivisionCard();
      await divisionPage.acceptDivisionAgreement();
      await divisionPage.acceptDivision();

      await heirTab.close();
    }
  }
}
