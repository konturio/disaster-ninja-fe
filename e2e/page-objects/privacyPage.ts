import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export type TitlesCheckOptions = {
  main: string;
  provisions: string;
  personalData: string;
  rightsAndObligations: string;
  rightsGDPR: string;
  privacyPolicy: string;
};

export class PrivacyPage extends HelperBase {
  /**
   * This method checks all the titles at privacy page to fit texts
   * @param titlesCheckOptions - object with all texts of titles except cookie policy title
   * @param cookiePolicy - text of cookie policy title
   */

  async checkTitles(titlesCheckOptions: TitlesCheckOptions, cookiePolicy: string) {
    for (const [_, title] of Object.entries(titlesCheckOptions))
      await expect(this.page.getByRole('heading', { name: title })).toBeVisible();
    await expect(this.page.getByRole('link', { name: cookiePolicy })).toBeVisible();
  }
}
