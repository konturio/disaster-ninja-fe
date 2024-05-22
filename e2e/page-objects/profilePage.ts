import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class ProfilePage extends HelperBase {
  /**
   * This method checks that at profile page there is a log out button. Also checks that at least one element with "Profile" text is present. After that it compares the email got with email passed to it.
   * @param email expected email to what value should be equal to
   */

  async checkLogoutBtnProfileTitleAndEmail(email: string) {
    const logoutBtn = this.page.getByRole('button', { name: 'Log out' });
    const profileTextElements = this.page.getByText('Profile').nth(1);
    // Check that log out button is present
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
    await this.page.getByRole('button', { name: 'Log out' }).click();
  }

  /**
   * This method checks that page doesn't have any log out button or elements with Profile text
   */
  async checkLogoutBtnAndProfileAbsence() {
    const logoutBtn = this.page.getByRole('button', { name: 'Log out' });
    const profileTextElements = this.page.getByText('Profile').nth(1);
    await expect(logoutBtn).not.toBeVisible();
    await expect(profileTextElements).not.toBeVisible();
  }

  /**
   * This method gets all values/texts of textboxes in settings like Full name and etc. Also it gets statuses of radio buttons, are they checked or not.
   * @returns object with strings for values and booleans for statuses of radio buttons
   */
  async getAllProfileValuesAndStatuses() {
    const emailValue = await this.getEmailValueAndCheckThisFieldIsDisabled();
    const fullNameValue = await this.page
      .getByText('Full Name')
      .locator('..')
      .locator('input')
      .inputValue();
    const bioValue = await this.page
      .getByText('Bio')
      .locator('..')
      .locator('textarea')
      .textContent();
    const themeValue = await this.page
      .getByText('Theme')
      .locator('..')
      .locator('span')
      .textContent();
    const languageValue = await this.page
      .getByText('Language')
      .locator('..')
      .locator('span')
      .textContent();
    const isMetricUnitChecked = await this.page
      .getByRole('radio', { name: 'metric' })
      .isChecked();
    const isImperialUnitChecked = await this.page
      .getByRole('radio', { name: 'imperial (beta)' })
      .isChecked();
    const disasterFeedValue = await this.page
      .getByText('Default disaster feed')
      .locator('..')
      .locator('span')
      .textContent();
    const osmEditorValue = await this.page
      .getByText('Default OpenStreetMap editor (beta)')
      .locator('..')
      .locator('span')
      .textContent();

    return {
      fullNameValue,
      emailValue,
      bioValue,
      themeValue,
      languageValue,
      isMetricUnitChecked,
      isImperialUnitChecked,
      disasterFeedValue,
      osmEditorValue,
    };
  }
}
