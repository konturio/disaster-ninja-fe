import { test, expect } from '@playwright/test';

test('As User, I can login to Kontur Atlas', async ({ page }) => {
  await page.goto(
    'https://maps.kontur.io/active?app=9043acf9-2cf3-48ac-9656-a5d7c4b7593d',
  );

  // Expect a title "to contain" a Kontur Atlas.
  await expect(page).toHaveTitle(/Kontur Atlas/);

  await page.getByText('Login').click();

  // Getting email field and filling in
  const emailInput = page.getByRole('textbox').first();
  await emailInput.fill(process.env.TEST_EMAIL!);

  // Getting password field and filling in
  const passwordInput = page.locator('input[type="password"]');
  await passwordInput.fill(process.env.TEST_PASSWORD!);

  // Getting Log in button and clicking
  await page.getByRole('button', { name: 'Log in' }).click();

  // Waiting happens automatically for Logout element and then clicking

  await page.locator('button:has(span:has-text("Logout"))').click();

  // Expecting to see the Login button again
  await page.getByText('Login').isVisible();
});
