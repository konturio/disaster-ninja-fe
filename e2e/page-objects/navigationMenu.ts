import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class NavigationMenu extends HelperBase {
  /**
   * This method allows to open map from navigation menu
   */

  async goToMap() {
    await this.page.locator('[value="map"]').first().waitFor({ state: 'visible' });
    const map = this.page.locator('[value="map"]').getByText('Map');
    await map.hover();
    await map.click({ delay: 330 });
  }

  /**
   * This method checks that there is no map at navigation menu
   */

  async checkThereIsNoMap() {
    await this.page.locator('[value="map"]').first().waitFor({ state: 'visible' });
    await expect(this.page.locator('[value="map"]').getByText('Map')).not.toBeVisible();
  }

  /**
   * This method allows to open login page from navigation menu
   */

  async goToLoginPage() {
    await this.page.locator('[value="profile"]').first().waitFor({ state: 'visible' });
    const login = this.page.locator('[value="profile"]').getByText('Login');
    await login.hover();
    await login.click({ delay: 330 });
  }

  /**
   * This method opens up the profile page from navigation menu
   */
  async goToProfilePage() {
    await this.page.locator('[value="profile"]').first().waitFor({ state: 'visible' });
    const profile = this.page.locator('[value="profile"]').getByText('Profile');
    await profile.hover();
    await profile.click({ delay: 330 });
  }

  /**
   * This method opens up the privacy page from navigation menu
   */

  async goToPrivacyPage() {
    await this.page.locator('[value="privacy"]').first().waitFor({ state: 'visible' });
    const privacy = this.page.locator('[value="privacy"]').getByText('Privacy');
    await privacy.hover();
    await privacy.click({ delay: 330 });
  }
}
