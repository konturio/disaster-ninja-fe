import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class ProfilePage extends HelperBase {
  /**
   * This method checks that at profile page there is a logout button. Also checks that at least one element with "Profile" text is present. After that it compares the email got with email passed to it.
   * @param email expected email to what value should be equal to
   */

  async checkLogoutBtnProfileTitleAndEmail(email: string) {
    const logoutBtn = this.page.getByRole('button', { name: 'Logout' });
    const profileTextElements = this.page.getByText('Profile').nth(1);
    // Check that logout button is present
    await expect(logoutBtn).toBeVisible();
    await expect(profileTextElements).toBeVisible();
    const actualEmail = await this.getEmailValueAndCheckThisFieldIsDisabled();
    expect(actualEmail).toEqual(email);
  }

  /**
   * This method gets email field at the profile page and its value. After that it checks that email field has attribute that shows that the field is disabled
   * @returns email value to then assert it
   */

  async getEmailValueAndCheckThisFieldIsDisabled() {
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
  }

  /**
   * This method checks that page doesn't have any logout button or elements with Profile text
   */
  async checkLogoutBtnAndProfileAbsence() {
    const logoutBtn = this.page.getByRole('button', { name: 'Logout' });
    const profileTextElements = this.page.getByText('Profile').nth(1);
    await expect(logoutBtn).not.toBeVisible();
    await expect(profileTextElements).not.toBeVisible();
  }
}
