import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';
import type { Project } from './helperBase';
import type { BrowserContext, Page } from '@playwright/test';

type LoginOptions = {
  shouldSuccess: boolean;
  operablePage?: Page;
  project: Project;
};

export class LoginPage extends HelperBase {
  /**
   * This method checks the Log in button visibility and then fills in email and password
   * @param email - should be email in form of string
   * @param password - should be password in form of string
   * @param shouldSuccess - should login be successful or not
   * @param project - kontur project to test
   * @param operablePage - playwright page to use
   */

  async typeLoginPasswordAndLogin(
    email: string,
    password: string,
    { shouldSuccess, project, operablePage = this.page }: LoginOptions,
  ) {
    await this.checkLoginAndSignupPresence(operablePage);
    // Getting email field and type in
    const emailInput = operablePage.getByRole('textbox').first();
    await emailInput.fill(email);

    // Getting password field and type in
    const passwordInput = operablePage.locator('input[type="password"]');
    await passwordInput.fill(password);

    // Getting Log in button, clicking and waiting for response
    const [_, loginResponse] = await Promise.all([
      operablePage.getByRole('button', { name: 'Log in' }).click({ delay: 330 }),
      operablePage.waitForResponse(project.authUrl),
    ]);

    // Expect keycloak answer 200 ok if required
    if (shouldSuccess) expect(loginResponse.status()).toEqual(200);
  }

  /**
   * This method checks that there are login and sign up elements
   */
  async checkLoginAndSignupPresence(operablePage: Page = this.page) {
    await Promise.all([
      expect(operablePage.getByRole('button', { name: 'Log in' })).toBeVisible(),
      expect(operablePage.getByText('Sign up')).toBeVisible(),
    ]);
  }

  /**
   * This method clicks sign up and waits for keycloak page to open. Then it checks the title of a new page to have Sign in text.
   * @param context - playwright context to use for page waiting
   * @returns a keycloak playwright page to use
   */

  async clickSignUpAndNavigateToKeycloak(context: BrowserContext) {
    // Start waiting for new page being opened and click sign up
    const [keycloakPage] = await Promise.all([
      context.waitForEvent('page'),
      this.page.getByText('Sign up').click({ delay: 330 }),
    ]);
    await expect(keycloakPage).toHaveTitle(/Sign in/);
    return keycloakPage;
  }
}
