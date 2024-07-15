import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class NavigationMenu extends HelperBase {
  /**
   * This method allows to open map from navigation menu
   */

  async goToMap() {
    await this.page
      .locator('div', { hasText: 'Collapse' })
      .getByText('Map', { exact: true })
      .click();
  }

  /**
   * This method checks that there is no map at navigation menu
   */

  async checkThereIsNoMap() {
    await expect(
      this.page.locator('div', { hasText: 'Collapse' }).getByText('Map', { exact: true }),
    ).not.toBeVisible();
  }

  /**
   * This method allows to open login page from navigation menu
   */

  async goToLoginPage() {
    await this.page.locator('div', { hasText: 'Collapse' }).getByText('Login').click();
  }

  /**
   * This method opens up the profile page from navigation menu
   */
  async goToProfilePage() {
    await this.page.locator('div', { hasText: 'Collapse' }).getByText('Profile').click();
  }

  /**
   * This method opens up the privacy page from navigation menu
   */

  async goToPrivacyPage() {
    await this.page
      .locator('div', { hasText: 'Collapse' })
      .getByText('Privacy', { exact: true })
      .click();
  }
}
