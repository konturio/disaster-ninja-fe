import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';
import type { Page } from '@playwright/test';

export class NavigationMenu extends HelperBase {
  /**
   * This method allows to open pages from navigation menu
   */

  async clickButtonToOpenPage(buttonName: string, operablePage: Page = this.page) {
    const button = operablePage
      .getByTestId('side-bar')
      .getByText(buttonName, { exact: true });
    await button.hover();
    await button.click({ delay: 330 });
  }

  /**
   * This method checks that there is no map at navigation menu
   */

  async checkThereIsNoMap() {
    const sidebar = this.page.getByTestId('side-bar');
    await expect(sidebar).toBeVisible();
    const mapElement = sidebar.getByText('Map', { exact: true });
    await expect(mapElement).not.toBeVisible();
  }
}
