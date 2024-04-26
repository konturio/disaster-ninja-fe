import { HelperBase } from './helperBase';

export class NavigationMenu extends HelperBase {
  /**
   * This method allows to open map from navigation menu
   */

  async goToMap() {
    await this.page
      .locator('._actionsBar_1qnbo_1')
      .getByText('Map', { exact: true })
      .click();
  }

  /**
   * This method allows to open login page from navigation menu
   */

  async goToLoginPage() {
    await this.page.locator('._actionsBar_1qnbo_1').getByText('Login').click();
  }
}
