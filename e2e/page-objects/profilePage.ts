import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';
import type { Project } from './helperBase';

type ProfileOptions = {
  shouldOsmEditorBeSeenOnAtlas: boolean;
};

export class ProfilePage extends HelperBase {
  /**
   * This method checks that at profile page there is a log out button. Also checks that at least one element with "Profile" text is present. After that it compares the email got with email passed to it.
   * @param email expected email to what value should be equal to
   */

  async checkLogoutBtnProfileTitleAndEmail(email: string) {
    const logoutBtn = this.page.getByRole('button', { name: 'Log out' });
    const profileTextElements = this.page.getByText('Profile').nth(1);
    await logoutBtn.scrollIntoViewIfNeeded();
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
    await this.page.getByRole('button', { name: 'Log out' }).click({ delay: 330 });
  }

  /**
   * This method checks that page doesn't have any log out button or elements with Profile text
   */
  async checkLogoutBtnAndProfileAbsence() {
    const logoutBtn = this.page.getByRole('button', { name: 'Log out' });
    const profileTextElements = this.page.getByText('Profile').nth(1);
    await Promise.all([
      expect(logoutBtn).not.toBeVisible(),
      expect(profileTextElements).not.toBeVisible(),
    ]);
  }

  /**
   * This method gets value of Full Name field
   * @returns string with Full Name
   */

  async getFullNameValue() {
    const fullNameValue = await this.page
      .getByText('Full Name')
      .locator('..')
      .locator('input')
      .inputValue();
    return fullNameValue;
  }

  /**
   * This method gets osm editor selector
   * @returns locator of osm editor
   */
  getOsmEditorSelect() {
    return this.page.getByTestId('osmEditor');
  }

  /**
   * This method retrieves the current value of the OSM editor.
   * @returns the current OSM editor value
   */
  async getOsmEditorValue() {
    const osmEditorValue = await this.getOsmEditorSelect()
      .locator('button')
      .locator('span')
      .textContent();
    return osmEditorValue;
  }

  /**
   * This method sets a new value for the OSM editor.
   * @param osmEditorValue the new value to set for the OSM editor
   */
  async setOsmEditorValue(osmEditorValue: string) {
    await this.getOsmEditorSelect().locator('button').click();
    await this.page.getByRole('option', { name: osmEditorValue, exact: true }).click();
    const saveChangesEl = this.page.getByText('Save changes');
    await saveChangesEl.click();
    const saveChangesBtn = this.page.locator('button', { has: saveChangesEl });
    await saveChangesBtn.waitFor({ state: 'visible' });
    await expect(saveChangesBtn).toHaveAttribute('disabled', { timeout: 30000 });
  }

  /**
   * This method gets all values/texts of textboxes in settings like Full name and etc. Also it gets statuses of radio buttons, are they checked or not.
   * @param project tested project
   * @param shouldOsmEditorBeSeenOnAtlas set to true to check if osm editor should be available for tested atlas role
   * @returns object with strings for values and booleans for statuses of radio buttons
   */
  async getProfileData(
    project: Project,
    { shouldOsmEditorBeSeenOnAtlas }: ProfileOptions,
  ) {
    // TO DO: remove  once 19141 task is done
    await this.page.waitForTimeout(1000);
    // Wait for a profile element to be ready for actions
    await this.page.getByText('Settings').waitFor({ state: 'visible' });

    const emailValue = await this.getEmailValueAndCheckThisFieldIsDisabled();
    const fullNameValue = await this.getFullNameValue();
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
    const disasterFeedValue =
      project.name === 'disaster-ninja'
        ? await this.page
            .getByText('Default disaster feed')
            .locator('..')
            .locator('span')
            .textContent()
        : 'No data';
    const osmEditorValue =
      shouldOsmEditorBeSeenOnAtlas || project.name !== 'atlas'
        ? await this.page
            .getByText('Default OpenStreetMap editor (beta)')
            .locator('..')
            .locator('span')
            .textContent()
        : 'No access';

    if (project.name !== 'disaster-ninja')
      await expect(this.page.getByText('Default disaster feed')).not.toBeVisible();
    if (!shouldOsmEditorBeSeenOnAtlas && project.name === 'atlas')
      await expect(
        this.page.getByText('Default OpenStreetMap editor (beta)'),
      ).not.toBeVisible();

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
