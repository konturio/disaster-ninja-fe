import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class NavigationMenu extends HelperBase {
  /**
   * This method allows to open map from navigation menu
   */

  async goToMap() {
    await this.page.locator('[value]').getByText('Map').click({ delay: 150 });
  }

  /**
   * This method checks that there is no map at navigation menu
   */

  async checkThereIsNoMap() {
    await expect(this.page.locator('[value]').getByText('Map')).not.toBeVisible();
  }

  /**
   * This method allows to open login page from navigation menu
   */

  async goToLoginPage() {
    await this.page.locator('[value="profile"]').getByText('Login').click({ delay: 150 });
  }

  /**
   * This method opens up the profile page from navigation menu
   */
  async goToProfilePage() {
    await this.page
      .locator('[value="profile"]')
      .getByText('Profile')
      .click({ delay: 150 });
  }

  /**
   * This method opens up the privacy page from navigation menu
   */

  async goToPrivacyPage() {
    await this.page
      .locator('[value="privacy"]')
      .getByText('Privacy')
      .click({ delay: 150 });
  }
}
