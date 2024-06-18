import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';
import type { BrowserContext } from '@playwright/test';

type Links = {
  name: string;
  linkShown: string;
  url: string;
  linkValidation: {
    shouldOpen: boolean;
    expectedUrl?: string;
  };
};

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

  /**
   * This method gets links for privacy page
   * @returns array of objects with info about each link
   */

  async getLinks() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const data = fs
      .readFileSync(path.join(__dirname, '../links-privacy.json'))
      .toString();

    const links: Links[] = JSON.parse(data);
    return links;
  }

  async checkLinks(context: BrowserContext) {
    const links = await this.getLinks();
    for (const link of links) {
      const linkElement = this.page.getByText(link.linkShown).first();
      await expect(linkElement).toBeVisible();
      await expect(linkElement).toHaveAttribute('href', link.url);
      if (link.linkValidation.shouldOpen) {
        const newPage = context.waitForEvent('page');
        await linkElement.click();
        const page = await newPage;
        expect(page.url()).toEqual(link.linkValidation.expectedUrl);
        await page.close();
      }
    }
  }
}
