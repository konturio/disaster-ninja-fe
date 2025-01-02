import { expect } from '@playwright/test';
import { HelperBase, getTestData } from './helperBase';
import type { BrowserContext, Page } from '@playwright/test';

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
  readonly data: Links[];

  constructor(page: Page) {
    super(page);
    this.data = getTestData('links-privacy');
  }
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
   * This method checks all links on the privacy page.
   * Input data should be specified in the links-privacy.json file.
   * Link names and URLs are verified, and for some links, the actual URL in the browser is compared to the expected one after click on the link.
   * @param context playwright browser context
   */

  async checkLinks(context: BrowserContext) {
    let links: Links[] = this.data;
    // TO DO: remove filtering when issue 19468 is fixed
    links = links.filter(
      (arg) => arg.name !== 'your-online-choice' && arg.name !== 'polish-gov',
    );
    for (const link of links) {
      // TO DO: remove {exact: true} below when issue 19468 is fixed
      const linkElement = this.page.getByText(link.linkShown, { exact: true }).first();
      await linkElement.scrollIntoViewIfNeeded();
      await expect(linkElement).toBeVisible();
      await expect(linkElement).toHaveAttribute('href', link.url);
      if (link.linkValidation.shouldOpen) {
        const [page] = await Promise.all([
          context.waitForEvent('page', { timeout: 15000 }),
          linkElement.click({ delay: 330 }),
        ]);
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toEqual(link.linkValidation.expectedUrl);
        await Promise.all([page.close(), this.page.waitForLoadState('domcontentloaded')]);
      }
    }
  }

  /**
   * This method opens cookie files policy from privacy page and checks that it was opened and has some content
   */

  async openAndVerifyCookiesPage() {
    await Promise.all([
      this.page.getByText('Cookie files policy and operational data').click(),
      this.page.waitForURL(/cookies/),
      this.page.waitForLoadState('domcontentloaded'),
    ]);
    await this.page.locator('#hdr-1').scrollIntoViewIfNeeded();
    await Promise.all([
      expect(
        this.page.getByText('Cookie files policy and operational data'),
      ).toBeVisible(),
      expect(this.page.getByText('AnalyticsSyncHistory')).toBeVisible(),
      expect(this.page.getByText('30 days').first()).toBeVisible(),
      expect(this.page.getByText('Description')).toBeVisible(),
    ]);
  }
}
