import { expect } from '@playwright/test';
import { HelperBase, step } from './helperBase';
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

  @step(
    (args) =>
      `Fill email and password, click 'Log in' and wait for ${args[2]?.project.authUrl || 'keycloak'} to answer. ${args[2]?.project.shouldSuccess ? 'Expect keycloak to answer 200 ok.' : ''}`,
  )
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
    if (shouldSuccess)
      expect(loginResponse.status(), 'Expected response status to be 200').toEqual(200);
  }

  /**
   * This method checks that there are login and sign up elements
   */

  @step(() => `Expect log in and sign up buttons to be visible`)
  async checkLoginAndSignupPresence(operablePage: Page = this.page) {
    await Promise.all([
      expect(
        operablePage.getByRole('button', { name: 'Log in' }),
        'Log in button should be visible',
      ).toBeVisible(),
      expect(
        operablePage.getByText('Sign up'),
        'Sign up button should be visible',
      ).toBeVisible(),
    ]);
  }

  /**
   * This method clicks sign up and waits for keycloak page to open. Then it checks the title of a new page to have Sign in text.
   * @param context - playwright context to use for page waiting
   * @returns a keycloak playwright page to use
   */
  @step(
    () =>
      `Click sign up button, wait for new page with keycloak page being opened, check that keycloak page title has 'Sign in' text`,
  )
  async clickSignUpAndNavigateToKeycloak(context: BrowserContext) {
    // Start waiting for new page being opened and click sign up
    const [keycloakPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 25000 }),
      this.page.getByText('Sign up').click({ delay: 330 }),
    ]);
    await keycloakPage.waitForLoadState();
    await expect(keycloakPage, 'Keycloak page should have title "Sign in"').toHaveTitle(
      /Sign in/,
    );
    return keycloakPage;
  }
}
