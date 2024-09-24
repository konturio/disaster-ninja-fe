import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

type OpenProjectOptions = {
  skipCookieBanner?: boolean;
  operablePage?: Page;
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
   * @param operablePage playwright page to work with
   */

  async openProject(
    project: Project,
    { skipCookieBanner = false, operablePage = this.page }: OpenProjectOptions = {},
  ) {
    await operablePage.goto(project.url);
    await operablePage.waitForLoadState();
    await this.waitForLayoutReady(operablePage);

    // Expect correct app to be opened.
    await this.waitForTextBeingVisible(`${project.title}`, operablePage);

    // Currently, OAM project doesn't have cookies popups
    if (project.hasCookieBanner && !skipCookieBanner)
      await operablePage.getByText('Accept optional cookies').click();
  }

  /**
   * This method waits for layout to be ready for tests. It enters a browser console and waits for METRICS event to be emitted. If it is not emitted in several seconds, it fails the test.
   * @param operablePage playwright page to use
   */

  async waitForLayoutReady(operablePage: Page) {
    const zoomTimeout = process.env.CI ? 30000 : 20000;
    // Entering browser console to wait for layout to be ready
    const layoutReadyEvent: CustomEvent = await operablePage.evaluate((zoomTimeout) => {
      return new Promise((resolve, reject) => {
        // Reject Promise if event is late
        const timeout = setTimeout(() => {
          reject(
            new Error(
              `Timeout waiting for 'METRICS' event in the browser (layout is not ready in ${zoomTimeout}ms)`,
            ),
          );
        }, zoomTimeout);
        // Clear timeout if event is emitted and resolve Promise with event
        globalThis.addEventListener('METRICS', (event: Event) => {
          clearTimeout(timeout);
          resolve(event as CustomEvent);
        });
      });
    }, zoomTimeout);
    expect(
      layoutReadyEvent,
      '"METRICS" event should be emitted, be defined',
    ).toBeDefined();
    // expect(
    //   layoutReadyEvent?.detail?.name,
    //   `Name of 'METRICS' event should be 'router-layout-ready', see 'detail' property of 'METRICS' event: ${layoutReadyEvent?.detail} `,
    // ).toEqual('router-layout-ready');
  }

  /**
   * This method waits for a specific page to have a specific text
   */

  async waitForTextBeingVisible(text: string, page: Page = this.page) {
    await page
      .getByText(text, { exact: true })
      .waitFor({ state: 'visible', timeout: 20000 });
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
        .click({ force: true, delay: 330 });
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
    await expect(this.page).toHaveTitle(new RegExp(project.title));
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
    await page.waitForURL(pattern, { timeout: 30000 });
  }

  /**
   * This method checks that campaign is autotests. It is needed for Google Analytics and other tracking services to differ normal users and autotests
   */

  checkCampaignIsAutotest(): void {
    expect(this.page.url()).toContain('utm_campaign=autotests');
  }
}

/**
 * This function replaces domain in url of project from json file to desired one
 */

const replaceDomain = (domain: string) => (project: Project) => {
  const localhostUrl = project.url.replace(new URL(project.url).origin, domain);
  return { ...project, url: localhostUrl };
};

/**
 * This function transforms projects got from json file adapting them for localhost env
 */

const getLocalhostProjects = (data: string, appName: string, environment: string) => {
  const [_, env] = environment.split('-');

  const projects: Project[] = JSON.parse(data).filter(
    (project: Project) => appName === 'all' || project.name === appName,
  );

  const prodAuthUrl = projects.find((project) => project.env === 'prod')!.authUrl;

  if (env === 'prod') {
    return projects
      .filter((project: Project) => project.env === 'dev') // We need the urls from the dev because they have 'app' in the url
      .map(replaceDomain(`https://localhost:3000`))
      .map((project: Project) => {
        if (env === 'prod') return { ...project, authUrl: prodAuthUrl };
        return project;
      })
      .map((project: Project) => ({ ...project, env }));
  }

  return projects
    .filter((project: Project) => project.env === env)
    .map(replaceDomain(`https://localhost:3000`));
};

/**
 * This function gets projects to test from json file with all needed info to run e2e tests
 */

export function getProjects() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const data = fs
    .readFileSync(path.join(__dirname, '../testsData/projects-config.json'))
    .toString();

  const appName = process.env.APP_NAME ?? 'all';
  const environment = process.env.ENVIRONMENT ?? 'prod';

  if (environment.startsWith('local-')) {
    return getLocalhostProjects(data, appName, environment);
  }

  return JSON.parse(data)
    .filter((project: Project) => project.env === environment)
    .filter((project: Project) => appName === 'all' || project.name === appName);
}

/**
 * This function gets data from testData folder
 * @param fileName name of the file with data
 * @returns info from the file
 */

export function getTestData(fileName: string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const data = fs
    .readFileSync(path.join(__dirname, `../testsData/${fileName}.json`))
    .toString();

  return JSON.parse(data);
}
