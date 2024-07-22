import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';
import type { BrowserContext } from '@playwright/test';

export class LoginPage extends HelperBase {
  /**
   * This method checks the Log in button visibility and then fills in email and password
   * @param email - should be email in form of string
   * @param password - should be password in form of string
   */

  async typeLoginPasswordAndLogin(email: string, password: string) {
    await this.checkLoginAndSignupPresence();
    // Getting email field and type in like real user
    const emailInput = this.page.getByRole('textbox').first();
    await emailInput.fill(email);

    // Getting password field and type in like real user
    const passwordInput = this.page.locator('input[type="password"]');
    await passwordInput.fill(password);

    // Getting Log in button and clicking
    await this.page.getByRole('button', { name: 'Log in' }).click({ delay: 330 });
  }

  /**
   * This method checks that there are login and sign up elements
   */
  async checkLoginAndSignupPresence() {
    await Promise.all([
      expect(this.page.getByRole('button', { name: 'Log in' })).toBeVisible(),
      expect(this.page.getByText('Sign up')).toBeVisible(),
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
