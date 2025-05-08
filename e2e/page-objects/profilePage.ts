import { expect, test } from '@playwright/test';
import { HelperBase, step } from './helperBase';
import type { Project } from './helperBase';

type ProfileOptions = {
  shouldOsmEditorBeSeenOnAtlas: boolean;
  isUsrPro: boolean;
};

type ProfileData = {
  [k: string]: string | boolean | null;
};

export class ProfilePage extends HelperBase {
  /**
   * This method checks that at profile page there is a log out button. Also checks that at least one element with "profile title text is present. After that it compares the email got with email passed to it.
   * @param email expected email to what value should be equal to
   */

  @step(
    (args) =>
      `Verify that the logout button is visible, the profile title text is present, and the email matches the expected one: '${args[0]}' + has the 'disabled' attribute.`,
  )
  async checkLogoutBtnProfileTitleAndEmail(email: string) {
    const logoutBtn = this.page.locator('button', { hasText: 'Log out' }).first();
    const profileTitle = this.page.getByText('Personalize your experience');
    await logoutBtn.scrollIntoViewIfNeeded();
    // Check that log out button is present
    await expect(logoutBtn, `Check that logout button is visible`).toBeVisible();
    await expect(profileTitle, `Check that profile title is visible`).toBeVisible();
    const actualEmail = await this.getEmailValueAndCheckThisFieldIsDisabled();
    expect(
      actualEmail,
      `Check that email value (${actualEmail}) fits the expected one (${email})`,
    ).toEqual(email);
  }

  /**
   * This method gets email field at the profile page and its value. After that it checks that email field has attribute that shows that the field is disabled
   * @returns email value to then assert it
   */
  @step(() => 'Get the email value and verify that the email input field is disabled')
  async getEmailValueAndCheckThisFieldIsDisabled() {
    const emailField = this.page.getByText('Email').locator('..').locator('input');
    const emailValue = await emailField.inputValue();
    await expect(emailField, `Check that email field is disabled`).toHaveAttribute(
      'disabled',
    );
    return emailValue;
  }
  /**
   * This method clicks log out and waits a bit after that
   */
  @step(() => 'Click the logout button')
  async clickLogout() {
    const logoutBtn = this.page.locator('button', { hasText: 'Log out' }).first();
    await logoutBtn.click({ delay: 330 });
  }

  /**
   * This method checks that page doesn't have any log out button or elements with Profile text
   */
  @step(
    () => 'Ensure that the logout button and profile title are not visible on the page',
  )
  async checkLogoutBtnAndProfileAbsence() {
    const logoutBtn = this.page.locator('button', { hasText: 'Log out' }).first();
    const profileTitle = this.page.getByText('Personalize your experience');
    await Promise.all([
      expect(logoutBtn, `Check that logout button is not visible`).not.toBeVisible(),
      expect(profileTitle, `Check that profile title is not visible`).not.toBeVisible(),
    ]);
  }

  /**
   * This method gets value of Full Name field
   * @returns string with Full Name
   */
  @step(() => 'Retrieve the full name from the profile page')
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
  @step(() => 'Retrieve the current value of the OSM editor')
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
  @step((args) => `Set the OSM editor value to: '${args[0]}'`)
  async setOsmEditorValue(osmEditorValue: string) {
    await this.getOsmEditorSelect().locator('button').click();
    await this.page.getByRole('option', { name: osmEditorValue, exact: true }).click();
  }

  /**
   * This method sets a new value for the full name field.
   * @param newFullName - new full name in string format
   */
  @step((args) => `Set the full name field to: '${args[0]}'`)
  async setFullNameValue(newFullName: string) {
    const fullNameLocator = this.page
      .getByText('Full Name')
      .locator('..')
      .locator('input');
    await fullNameLocator.fill(newFullName);
  }

  /**
   *  This method sets a new value for the bio field.
   * @param newBio - new bio in string format
   */
  @step((args) => `Set the bio field to: '${args[0]}'`)
  async setBioValue(newBio: string) {
    const bioLocator = this.page.getByText('Bio').locator('..').locator('textarea');
    await bioLocator.fill(newBio);
  }

  /**
   * This method saves changes of the settings and asserts that button gets disabled.
   */
  @step(
    () => 'Save changes and verify that the save button gets disabled after page update',
  )
  async saveChanges() {
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

  async getAndAssertProfileData(
    project: Project,
    { shouldOsmEditorBeSeenOnAtlas, isUsrPro }: ProfileOptions,
  ): Promise<ProfileData> {
    const testResultObj: ProfileData = {};
    // Wait for a profile element to be ready for actions
    await this.page
      .getByText('Your contact info')
      .first()
      .waitFor({ state: 'visible', timeout: 25000 });

    await test.step(`Getting all generally available profile data`, async () => {
      testResultObj.emailValue = await this.getEmailValueAndCheckThisFieldIsDisabled();
      testResultObj.fullNameValue = await this.getFullNameValue();
      testResultObj.bioValue = await this.page
        .getByText('Bio')
        .locator('..')
        .locator('textarea')
        .textContent();
      testResultObj.languageValue = await this.page
        .getByText('Language')
        .locator('..')
        .locator('span')
        .textContent();
      testResultObj.isMetricUnitChecked = await this.page.locator('#metric').isChecked();
      await expect(
        this.page.locator('#metric').locator('..').locator('span'),
        `Check that metric unit has a correct text near radio button`,
      ).toHaveText('metric');
      testResultObj.isImperialUnitChecked = await this.page
        .locator('#imperial')
        .isChecked();
      await expect(
        this.page.locator('#imperial').locator('..').locator('span'),
        `Check that imperial unit has a correct text near radio button`,
      ).toHaveText('imperial (beta)');
    });

    if (project.name === 'disaster-ninja') {
      await test.step(`Getting only ${project.name} available 'Default disaster feed' profile data`, async () => {
        testResultObj.disasterFeedValue = await this.page
          .getByText('Default disaster feed')
          .locator('..')
          .locator('span')
          .textContent();
      });
    }
    if (shouldOsmEditorBeSeenOnAtlas || project.name !== 'atlas') {
      await test.step(`Getting available for ${project.name} osm editor data. ${project.name === 'atlas' ? `OSM editor data on ${project.name} should ${shouldOsmEditorBeSeenOnAtlas ? '' : 'not '}be visible` : ''}`, async () => {
        testResultObj.osmEditorValue = await this.page
          .getByText('Default OpenStreetMap editor (beta)')
          .locator('..')
          .locator('span')
          .textContent();
      });
    }
    if (!shouldOsmEditorBeSeenOnAtlas && project.name === 'atlas') {
      await expect(
        this.page.getByText('Default OpenStreetMap editor (beta)'),
        `Expect no 'Default OpenStreetMap editor (beta)' text to be visible on the page of ${project.name}`,
      ).not.toBeVisible();
    }

    if (project.name !== 'disaster-ninja') {
      await expect(
        this.page.getByText('Default disaster feed'),
        `Check that disaster feed for ${project.name} is not visible`,
      ).not.toBeVisible();
    }

    if (project.name === 'atlas' || project.name === 'smart-city') {
      await test.step(`Getting only ${project.name} available user data`, async () => {
        testResultObj.phoneValue = await this.page
          .getByText('Phone number with country code')
          .locator('..')
          .locator('input')
          .inputValue();
        testResultObj.linkedinValue = await this.page
          .getByText('LinkedIn profile')
          .locator('..')
          .locator('input')
          .inputValue();
        testResultObj.organisationValue = await this.page
          .getByText('Organization name')
          .locator('..')
          .locator('input')
          .inputValue();
        testResultObj.positionValue = await this.page
          .getByText('Position')
          .locator('..')
          .locator('input')
          .inputValue();
        testResultObj.gisSpecialistsNumber = await this.page
          .getByText('GIS specialists in your team')
          .locator('..')
          .locator('span')
          .textContent();
      });
    } else {
      await this.checkPageHasNoTexts([
        'Phone number with country code',
        'LinkedIn profile',
        'Organization name',
        'Position',
        'GIS specialists in your team',
      ]);
    }

    const analysisObjectivesTexts = [
      'Improves analysis',
      `For better personalization, please include details such as:`,
      'your current job',
      'area of expertise',
      'challenges',
      `This information is compatible with AI tools`,
    ];

    const referenceAreaTexts = [
      'Reference area',
      'Improves analysis',
      'Save an area you are familiar with as a reference. We will use it as a baseline to compare other areas and explain the differences.',
      'You can redefine your reference area on map. Select an area and click "Save as reference area" on toolbar.',
    ];

    if (project.name === 'atlas' && isUsrPro) {
      await test.step(`Getting ${project.name} available pro user data and asserting it`, async () => {
        const analysisObjectivesSection = this.page.locator('#analysis-objectives');
        const referenceAreaSection = this.page.locator('#reference-area');
        testResultObj.analysisObjectivesValue = await analysisObjectivesSection
          .locator('textarea')
          .textContent();
        testResultObj.referenceAreaValue = await referenceAreaSection
          .locator('h4')
          .textContent();
        await Promise.all([
          ...analysisObjectivesTexts.map((text) =>
            expect(
              analysisObjectivesSection.getByText(text),
              `Check that '${text}' is visible in analysis objectives section`,
            ).toBeVisible(),
          ),
          ...referenceAreaTexts.map((text) =>
            expect(
              referenceAreaSection.getByText(text, { exact: true }),
              `Check that '${text}' is visible in reference area section`,
            ).toBeVisible(),
          ),
        ]);
        expect(
          await analysisObjectivesSection.locator('h3').textContent(),
          `Expect 'Analysis objectives' to be the title of analysis objectives section`,
        ).toEqual('Analysis objectives');
        expect(
          await analysisObjectivesSection
            .locator('textarea')
            .locator('..')
            .locator('div')
            .textContent(),
          `Expect 'Analysis objectives' text to be the name of textarea in analysis objectives section`,
        ).toEqual('Analysis objectives');
      });
    } else {
      await this.checkPageHasNoTexts([
        ...analysisObjectivesTexts,
        ...referenceAreaTexts,
        'Analysis objectives',
      ]);
    }
    return testResultObj;
  }
}
