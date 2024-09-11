import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class ToolBar extends HelperBase {
  /**
   * This method gets element by specific text from map. Designed for toolbar buttons like Bivariate Matrix, but can be used for other texts in Toolbar
   * @param text - the text of an entity, like MCDA
   * @returns - playwright locator for the button
   */

  async getButtonByText(text: string) {
    const aliveMap = this.page.locator('#withKeepAlivemap');
    return aliveMap.getByText(text, { exact: true });
  }

  /**
   * This method checks that there are some texts that should be visible in toolbar and also some texts that should not be visible there
   * @param visibleTexts - array of visible texts
   * @param hiddenTexts - array of hidden texts
   */

  async checkTextsInToolbar(visibleTexts: string[], hiddenTexts: string[]) {
    for (const text of visibleTexts) {
      const element = await this.getButtonByText(text);
      await expect(element).toBeVisible();
    }
    for (const text of hiddenTexts) {
      const element = await this.getButtonByText(text);
      await expect(element).not.toBeVisible();
    }
  }
}
