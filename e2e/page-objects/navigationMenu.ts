import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';
import type { Page } from '@playwright/test';

export class NavigationMenu extends HelperBase {
  /**
   * Opens a page by clicking a button in the navigation menu.
   * @param buttonName - name of the button to click
   * @param operablePage - playwright page to use
   */

  async clickButtonToOpenPage(buttonName: string, operablePage: Page = this.page) {
    const button = operablePage
      .getByTestId('side-bar')
      .getByText(buttonName, { exact: true });
    await button.hover();
    // Delay is needed to emulate a real user click
    await button.click({ delay: 500 });
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
