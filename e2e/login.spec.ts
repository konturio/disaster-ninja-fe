import { test, expect } from '@playwright/test';

// Get data from config about projects and convert to JS object setting TS types

const projects = JSON.parse(process.env.PROJECTS!) as Record<
  string,
  { url: string; app: string; title: string }
>;

// Create a loop to loop over all the projects and create a test for everyone

for (const project of Object.keys(projects)) {
  test(`As User, I can login to ${projects[project].title}`, async ({ page }) => {
    await page.goto(`${projects[project].url}active/?app=${projects[project].app}`);

    // Expect a title "to contain" a Kontur Atlas.
    await expect(page).toHaveTitle(`${projects[project].title}`);

    await page.getByText('Login').click();

    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();

    // Getting email field and filling in
    const emailInput = page.getByRole('textbox').first();
    await emailInput.fill(process.env.TEST_EMAIL!);

    // Getting password field and filling in
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill(process.env.TEST_PASSWORD!);

    // Currently OAM and Atlas apps don't have cookies popups
    // TO DO: fix when bug fixes are done
    if (
      projects[project].title !== projects.oam.title &&
      projects[project].title !== projects.atlas.title
    ) {
      await page.getByText('Accept optional cookies').click();
    }
    // Getting Log in button and clicking
    await page.getByRole('button', { name: 'Log in' }).click();

    // Check that logout button is present
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });
}
