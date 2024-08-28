import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';
import type { Page } from '@playwright/test';

export class NavigationMenu extends HelperBase {
  /**
   * This method allows to open map from navigation menu
   */

  async goToMap() {
    // TO DO: replace locator here once 19141 task is done, refactor this logics
    // When no need will be present to get locator every time
    await this.waitForTextBeingVisible('Map');
    await this.page.getByText('Map', { exact: true }).hover();
    await this.page.getByText('Map', { exact: true }).click({ delay: 330 });
  }

  /**
   * This method checks that there is no map at navigation menu
   */

  async checkThereIsNoMap() {
    // TO DO: replace locator here once 19141 task is done
    await this.page.locator('[value]').first().waitFor({ state: 'visible' });
    await expect(this.page.locator('[value]').getByText('Map')).not.toBeVisible();
  }

  /**
   * This method allows to open login page from navigation menu
   */

  async goToLoginPage(operablePage: Page = this.page) {
    // TO DO: replace locator here once 19141 task is done, refactor this logics
    // When no need will be present to get locator every time
    await operablePage.locator('[value="profile"]').first().waitFor({ state: 'visible' });
    await operablePage.locator('[value="profile"]').getByText('Login').hover();
    await operablePage
      .locator('[value="profile"]')
      .getByText('Login')
      .click({ delay: 330 });
  }

  /**
   * This method opens up the profile page from navigation menu
   */
  async goToProfilePage() {
    // TO DO: replace locator here once 19141 task is done, refactor this logics
    // When no need will be present to get locator every time
    await this.page.locator('[value="profile"]').first().waitFor({ state: 'visible' });
    await this.page.locator('[value="profile"]').getByText('Profile').hover();
    await this.page
      .locator('[value="profile"]')
      .getByText('Profile')
      .click({ delay: 330 });
  }

  /**
   * This method opens up the privacy page from navigation menu
   */

  async goToPrivacyPage() {
    // TO DO: replace locator here once 19141 task is done, refactor this logics
    // When no need will be present to get locator every time
    await this.page.locator('[value="privacy"]').first().waitFor({ state: 'visible' });
    await this.page.locator('[value="privacy"]').getByText('Privacy').hover();
    await this.page
      .locator('[value="privacy"]')
      .getByText('Privacy')
      .click({ delay: 330 });
  }
}
