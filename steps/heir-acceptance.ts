import { SeederPage, SeedResult } from '../pages/seeder.page';
import { RequestsPage } from '../pages/requests.page';
import { CashDivisionsPage } from '../pages/cash-divisions.page';
import { fillMobileNumberIfPrompted } from './fill-mobile-number';

export class HeirAcceptance {
  constructor(
    private readonly seederPage: SeederPage,
    private readonly result: SeedResult,
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

      const cashDivisionsPage = new CashDivisionsPage(heirTab);
      await cashDivisionsPage.viewDivision();
      await cashDivisionsPage.acceptDivisionAgreement();
      await cashDivisionsPage.acceptDivision();

      await heirTab.close();
    }
  }
}
