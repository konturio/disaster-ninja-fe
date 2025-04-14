import { expect } from '@playwright/test';
import { HelperBase, getTestData, step } from './helperBase';
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

  @step(
    (args) =>
      `Check that all the following titles are visible on the privacy page: ${args[0].join(', ')}. Also, verify that the link to the cookie policy with text '${args[1]}' is visible.`,
  )
  async checkTitles(titlesCheckOptions: string[], cookiePolicy: string) {
    for (const title of titlesCheckOptions)
      await expect(
        this.page.getByRole('heading', { name: title }),
        `Check that title '${title}' is visible`,
      ).toBeVisible();
    await expect(
      this.page.getByRole('link', { name: cookiePolicy }),
      `Check that cookie policy link with text '${cookiePolicy}' is visible`,
    ).toBeVisible();
  }

  /**
   * This method checks all links on the privacy page.
   * Input data should be specified in the links-privacy.json file.
   * Link names and URLs are verified, and for some links, the actual URL in the browser is compared to the expected one after click on the link.
   * @param context playwright browser context
   */
  @step(
    () =>
      `Check the visibility, href attribute, and functionality of the links on the privacy page. If link should be opened according to test data, check that it opens the expected url.`,
  )
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
      await expect(
        linkElement,
        `Expect link with text '${link.linkShown}' to be visible`,
      ).toBeVisible();
      await expect(
        linkElement,
        `Expect element with text '${link.linkShown}' to have href attribute`,
      ).toHaveAttribute('href', link.url);
      if (link.linkValidation.shouldOpen) {
        const [page] = await Promise.all([
          context.waitForEvent('page', { timeout: 15000 }),
          linkElement.click({ delay: 330 }),
        ]);
        await page.waitForLoadState('domcontentloaded');
        expect(
          page.url(),
          `Expect ${page.url} to be '${link.linkValidation.expectedUrl}'`,
        ).toEqual(link.linkValidation.expectedUrl);
        await Promise.all([page.close(), this.page.waitForLoadState('domcontentloaded')]);
      }
    }
  }

  /**
   * This method opens cookie files policy from privacy page and checks that it was opened and has some content
   */
  @step(
    () =>
      `Open the cookie files policy from the privacy page. Verify that the cookie policy page is opened successfully, and ensure that key elements such as policy title, analytics history, and retention periods are visible.`,
  )
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
        `Check that the cookie files policy and operational data title is visible`,
      ).toBeVisible(),
      expect(
        this.page.getByText('AnalyticsSyncHistory'),
        `Expect analytics sync history to be visible`,
      ).toBeVisible(),
      expect(
        this.page.getByText('30 days').first(),
        `Expect 30 days to be visible`,
      ).toBeVisible(),
      expect(
        this.page.getByText('Description'),
        `Expect description to be visible`,
      ).toBeVisible(),
    ]);
  }
}
