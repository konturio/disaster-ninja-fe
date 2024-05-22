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
}
