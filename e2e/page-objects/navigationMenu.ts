import { expect } from '@playwright/test';
import { HelperBase, step } from './helperBase';
import type { Page } from '@playwright/test';

export class NavigationMenu extends HelperBase {
  /**
   * Opens a page by clicking a button in the navigation menu.
   * @param buttonName - name of the button to click
   * @param operablePage - playwright page to use
   */

  @step(
    (args) =>
      `Click the '${args[0]}' button in the navigation menu to open the corresponding page. The button is hovered before clicking, and a delay is added to emulate user behavior.`,
  )
  async clickButtonToOpenPage(buttonName: string, operablePage: Page = this.page) {
    const sideBar = operablePage.getByTestId('side-bar');
    const button = sideBar.locator('button', { hasText: buttonName }).first();
    await button.hover();
    // Delay is needed to emulate a real user click
    await button.click({ delay: 500 });
    // Wait for animation of button to happen
    await operablePage.waitForTimeout(500);
    await expect(
      button,
      `Expect button element with text "${buttonName}" to be visible after click`,
    ).toBeVisible();
    await expect(
      button,
      `Expect button "${buttonName}" to be marked in CSS as active after clicking it`,
    ).toHaveClass(/active/);
  }

  /**
   * This method checks that there is no map at navigation menu
   */
  @step(
    (args) =>
      `Verify that there is no '${args[0]}' text in the navigation menu. Ensure that the sidebar is visible, and the element with '${args[0]}' text is not displayed.`,
  )
  async checkThereIsNoTextInNavigationMenu(text: string) {
    const sidebar = this.page.getByTestId('side-bar');
    await expect(sidebar).toBeVisible();
    const mapElement = sidebar.getByText(text, { exact: true });
    await expect(mapElement).not.toBeVisible();
  }
}
