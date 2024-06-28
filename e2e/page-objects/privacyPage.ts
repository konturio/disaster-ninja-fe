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

export class PrivacyPage extends HelperBase {
  /**
   * This method checks all the titles at privacy page to fit texts
   * @param titlesCheckOptions - array with all texts of titles except cookie policy title
   * @param cookiePolicy - text of cookie policy title
   */

  async checkTitles(titlesCheckOptions: string[], cookiePolicy: string) {
    for (const title of titlesCheckOptions)
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

  /**
   * This method checks all links on the privacy page.
   * Input data should be specified in the links-privacy.json file.
   * Link names and URLs are verified, and for some links, the actual URL in the browser is compared to the expected one after click on the link.
   * @param context playwright browser context
   */

  async checkLinks(context: BrowserContext) {
    const links = await this.getLinks();
    for (const link of links) {
      const linkElement = this.page.getByText(link.linkShown).first();
      await linkElement.scrollIntoViewIfNeeded();
      await expect(linkElement).toBeVisible();
      await expect(linkElement).toHaveAttribute('href', link.url);
      if (link.linkValidation.shouldOpen) {
        const [page] = await Promise.all([
          context.waitForEvent('page'),
          linkElement.click(),
        ]);
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toEqual(link.linkValidation.expectedUrl);
        await page.close();
      }
    }
  }

  /**
   * This method opens cookie files policy from privacy page and checks that it was opened and has some content
   */

  async openAndVerifyCookiesPage() {
    await this.page.getByText('Cookie files policy and operational data').click();
    await expect(
      this.page.getByText('Cookie files policy and operational data'),
    ).toBeVisible();
    await expect(this.page.getByText('AnalyticsSyncHistory')).toBeVisible();
    await expect(this.page.getByText('30 days').first()).toBeVisible();
    await expect(this.page.getByText('Description')).toBeVisible();
  }
}
