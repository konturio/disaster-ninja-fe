import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { test, expect } from '@playwright/test';

type Project = {
  env: 'prod' | 'dev' | 'test';
  name: string;
  url: string;
  title: string;
  hasCookieBanner: boolean;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const data = fs.readFileSync(path.join(__dirname, 'projects-config.json')).toString();

const appName = process.env.APP_NAME ?? 'all';
const environment = process.env.ENVIRONMENT ?? 'prod';
const projects: Project[] = JSON.parse(data)
  .filter((project: Project) => project.env === environment)
  .filter((project: Project) => appName === 'all' || project.name === appName);

// Create a loop to loop over all the projects and create a test for everyone
for (const project of projects) {
  test(`As User, I can login to ${project.title}`, async ({ page }) => {
    await page.goto(project.url);

    // Expect a title "to contain" a Kontur Atlas.
    await expect(page).toHaveTitle(`${project.title}`);

    // Currently OAM project doesn't have cookies popups
    if (project.hasCookieBanner) await page.getByText('Accept optional cookies').click();

    await page.getByText('Login').click();

    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();

    // Getting email field and filling in
    const emailInput = page.getByRole('textbox').first();
    await emailInput.fill(process.env.EMAIL!);

    // Getting password field and filling in
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill(process.env.PASSWORD!);

    // Getting Log in button and clicking
    await page.getByRole('button', { name: 'Log in' }).click();

    // Check that logout button is present
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });
}
