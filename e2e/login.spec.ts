import { test, expect } from '@playwright/test';

// Get data from config about projects and convert to JS object setting TS types

const projects = JSON.parse(process.env.PROJECTS!) as Record<
  string,
  { url: string; app: string; title: string }
>;

// Get arrays of urls, apps, titles from that object using just one loop with reduce method

const { urls, apps, titles } = Object.values(projects).reduce(
  (acc: { urls: string[]; apps: string[]; titles: string[] }, project) => {
    acc.urls.push(project.url);
    acc.apps.push(project.app);
    acc.titles.push(project.title);
    return acc;
  },
  { urls: [], apps: [], titles: [] },
);

// Create old-school loop to loop over all the projects and create a test for everyone

for (let i = 0; i < urls.length; i++) {
  test(`As User, I can login to ${titles[i]}`, async ({ page }) => {
    await page.goto(`${urls[i]}active/?app=${apps[i]}`);

    // Expect a title "to contain" a Kontur Atlas.
    await expect(page).toHaveTitle(`${titles[i]}`);

    await page.getByText('Login').click();

    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();

    // Getting email field and filling in
    const emailInput = page.getByRole('textbox').first();
    await emailInput.fill(process.env.TEST_EMAIL!);

    // Getting password field and filling in
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill(process.env.TEST_PASSWORD!);

    // Currently OAM and Atlas apps don't have cookies popups
    if (titles[i] !== projects.oam.title && titles[i] !== projects.atlas.title) {
      await page.getByText('Accept optional cookies').click();
    }
    // Getting Log in button and clicking
    await page.getByRole('button', { name: 'Log in' }).click();

    // Check that logout button is present
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });
}
