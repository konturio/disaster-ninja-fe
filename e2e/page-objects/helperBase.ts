import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

type Options = {
  skipCookieBanner?: boolean;
};

export type Project = {
  env: 'prod' | 'dev' | 'test';
  name: string;
  url: string;
  title: string;
  hasCookieBanner: boolean;
  hasAtlasBanner: boolean;
  authUrl: string;
};

export class HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  /**
   * This method opens up a project like disaster-ninja, atlas, etc. After that it checks the title to correspond to this project and accepts cookies if needed
   * @param project object with details about project to open like name, url, title, etc.
   * @param skipCookieBanner should cookie banner acceptance be skipped
   */

  async openProject(project: Project, { skipCookieBanner = false }: Options = {}) {
    await this.page.goto(project.url, { waitUntil: 'domcontentloaded' });
    // Expect a title to match a project name.
    await expect(this.page).toHaveTitle(`${project.title}`);

    // Currently, OAM project doesn't have cookies popups
    if (project.hasCookieBanner && !skipCookieBanner)
      await this.page.getByText('Accept optional cookies').click();
  }

  async closeAtlasBanner(project: Project) {
    if (project.hasAtlasBanner) {
      await this.page.waitForSelector('[title="Intercom live chat banner"]');
      // Waiting for animation of element display to happen
      await this.page.waitForTimeout(400);
      // Skipping autowaiting for click method
      await this.page
        .frameLocator('[title="Intercom live chat banner"]')
        .getByLabel('Close')
        .click({ force: true, delay: 150 });
    }
  }
  /**
   * This method gets texts from locators array passed in. Checks if text is present and then returns array of this texts. Before using this method try to use allTextContents method present in Playwright. Fails if 1 of elements has no text
   * @param locators array of playwright locators from DOM returned by all() method
   * @returns array of texts where all texts are defined.
   */
  async getTextsFromLocators(locators: Locator[]) {
    const textsArray: string[] = [];
    for (const locator of locators) {
      const text = await locator.textContent();
      expect(text).not.toBeNull();
      textsArray.push(text!);
    }
    return textsArray;
  }

  /**
   * This method saves current url, reloads the page and expects new url to equal it. Also checks the correct project to be opened
   * @param project - object with details about project to open like name, url, title, etc.
   */

  async compareUrlsAfterReload(project: Project) {
    const currentUrl = this.page.url().replace(/\//g, '');
    await this.page.reload({ waitUntil: 'load' });
    expect(this.page.url().replace(/\//g, '')).toEqual(currentUrl);
    await expect(this.page).toHaveTitle(`${project.title}`);
  }

  /**
   * This method gets url and returns its domain
   * @param url string of url
   * @returns domain in string format
   */

  getDomainFromUrl(url: string) {
    const urlObj = new URL(url);
    return urlObj.origin;
  }

  /**
   * This method waits for URL to match specific regexp pattern. It is mostly useful for testing maps.
   * @param pattern value for url to have inside in form of RegExp
   * @param page playwright page to wait for
   */

  async waitForUrlToMatchPattern(pattern: RegExp, page: Page = this.page) {
    await page.waitForURL(pattern);
  }
}

export function getProjects() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const data = fs
    .readFileSync(path.join(__dirname, '../projects-config.json'))
    .toString();

  const appName = process.env.APP_NAME ?? 'all';
  const environment = process.env.ENVIRONMENT ?? 'prod';
  const projects: Project[] = JSON.parse(data)
    .filter((project: Project) => project.env === environment)
    .filter((project: Project) => appName === 'all' || project.name === appName);

  return projects;
}
