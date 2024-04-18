import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class LoginPage extends HelperBase {
  /**
   * This method checks the Log in button visibility and then fills in email and password with special speed emulating real user typing
   * @param email - should be email in form of string
   * @param password - should be password in form of string
   * @param speed - delay between keyboard clicks in ms. High numbers increase test execution!
   */

  async typeLoginPasswordAndLogin(email: string, password: string, speed: number) {
    await this.checkLoginAndSignupPresence();
    // Getting email field and type in like real user
    const emailInput = this.page.getByRole('textbox').first();
    await emailInput.pressSequentially(email, { delay: speed });

    // Getting password field and type in like real user
    const passwordInput = this.page.locator('input[type="password"]');
    await passwordInput.pressSequentially(password, { delay: speed });

    // Getting Log in button and clicking
    await this.page.getByRole('button', { name: 'Log in' }).click();
  }

  /**
   * This method checks that there are login and sign up elements
   */
  async checkLoginAndSignupPresence() {
    await expect(this.page.getByRole('button', { name: 'Log in' })).toBeVisible();
    await expect(this.page.getByText('Sign up')).toBeVisible();
  }
}
