import { test, expect } from '@playwright/test';
import projects from './projects-config.json' assert { type: 'json' };

// Create a loop to loop over all the projects and create a test for everyone

for (const project of Object.keys(projects)) {
  const testProject = projects[project];
  test(`As User, I can login to ${testProject.title}`, async ({ page }) => {
    await page.goto(`${testProject.url}active/?app=${testProject.app}`);

    // Expect a title "to contain" a Kontur Atlas.
    await expect(page).toHaveTitle(`${testProject.title}`);

    await page.getByText('Login').click();

    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();

    // Getting email field and filling in
    const emailInput = page.getByRole('textbox').first();
    await emailInput.fill(process.env.TEST_EMAIL!);

    // Getting password field and filling in
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill(process.env.TEST_PASSWORD!);

    // Currently OAM project doesn't have cookies popups
    if (testProject.title !== projects.oam.title)
      await page.getByText('Accept optional cookies').click();

    // Getting Log in button and clicking
    await page.getByRole('button', { name: 'Log in' }).click();

    // Check that logout button is present
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });
}
