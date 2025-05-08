import { expect } from '@playwright/test';
import { HelperBase, step } from './helperBase';

export class LegendPanel extends HelperBase {
  /**
   * This method checks that legend panel has correct texts
   * @param expectedTexts - array of expected texts
   */

  @step(
    () =>
      `Check that legend panel has expected texts (open this step to see all of them)`,
  )
  async assertLegendPanelTexts(expectedTexts: string[]) {
    const legendPanel = this.page.locator('#layers_and_legends');
    for (const text of expectedTexts) {
      await expect(
        legendPanel.getByText(text).first(),
        `Check that legend panel has '${text}' text`,
      ).toBeVisible();
    }
  }
}
