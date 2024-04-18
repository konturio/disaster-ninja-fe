import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class ProfilePage extends HelperBase {
  /**
   * By default, this method checks that at profile page there is a logout button. Also checks that at least one element with "Profile" text is present. After that it compares the email got with email passed to it. But also it can check that no 'Profile' texts and logout buttons are present
   * @param email expected email to what value should be equal to
   * @param isVisible true to check profile presence, false - profile absence
   */

  async checkProfilePageForLogoutBtnAndProfileTitleAndCheckEmailIfNeeded(
    email: string = 'email',
    isVisible: boolean = true,
  ) {
    const logoutBtn = await this.page.getByRole('button', { name: 'Logout' });
    const profileTextElements = await this.page.getByText('Profile').nth(1);

    if (isVisible) {
      // Check that logout button is present
      await expect(logoutBtn).toBeVisible();
      await expect(profileTextElements).toBeVisible();
      const actualEmail = await this.getProfileEmailValueAndCheckFieldIsDisabled();
      expect(actualEmail).toEqual(email);
    } else {
      await expect(logoutBtn).not.toBeVisible();
      await expect(profileTextElements).not.toBeVisible();
    }
  }

  /**
   * This method gets email field at the profile page and its value. After that it checks that email field has attribute that shows that the field is disabled
   * @returns email value to then assert it
   */

  async getProfileEmailValueAndCheckFieldIsDisabled() {
    const emailField = this.page.getByText('Email').locator('..').locator('input');
    const emailValue = await emailField.inputValue();
    await expect(emailField).toHaveAttribute('disabled');
    return emailValue;
  }
  /**
   * This method clicks log out and waits a bit after that
   */
  async clickLogout() {
    await this.page.getByRole('button', { name: 'Logout' }).click();
    await this.page.waitForTimeout(300);
  }
}
