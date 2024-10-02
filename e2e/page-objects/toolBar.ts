import { expect } from '@playwright/test';
import { HelperBase, getTestData } from './helperBase';
import type { Locator, Page } from '@playwright/test';

type ToolbarButton = {
  id: string;
  tooltipText: string;
  visibleButtonText: string;
};

export class ToolBar extends HelperBase {
  readonly data: ToolbarButton[];

  constructor(page: Page) {
    super(page);
    this.data = getTestData('toolbar-buttons');
  }
  /**
   * This method gets element by specific text from map. Designed for toolbar buttons like Bivariate Matrix, but can be used for other texts in Toolbar
   * @param text - the text of an entity, like MCDA
   * @returns - playwright locator for the button
   */

  async getButtonByText(text: string) {
    const aliveMap = this.page.locator('.keep-alive-render');
    return aliveMap.getByText(text, { exact: true });
  }

  /**
   * This method clicks arrows at toolbar to make it short or big and asserts toolbar is in the needed state
   * @param collapse - make toolbar short or make it big. true for short
   */

  async resizeToolbar({ collapse = true }: { collapse: boolean }) {
    const toolbarPanel = this.page.getByTestId('toolbar');
    const svgNumberToClick = collapse ? 2 : 1;
    await toolbarPanel.locator('svg').nth(svgNumberToClick).click();
    await expect(toolbarPanel.getByText('Toolbar')).toBeVisible();
    if (collapse) {
      await expect(toolbarPanel.getByText('Select admin boundary')).not.toBeVisible();
    } else {
      await expect(toolbarPanel.getByText('Locate me')).toBeVisible();
    }
  }

  /**
   * This method checks that there are some texts/tooltips that should be visible in big toolbar and also some texts that should not be visible there
   * @param visibleTexts - array of visible texts
   * @param hiddenTexts - array of hidden texts
   */

  async checkTextsAndTooltipsInToolbar(visibleTexts: string[], hiddenTexts: string[]) {
    for (const text of visibleTexts) {
      const element = await this.getButtonByText(text);
      await expect(element).toBeVisible();
      if (text !== 'Save as reference area')
        await this.hoverElAndCheckTooltip(element, text);
    }
    await Promise.all(
      hiddenTexts.map(async (text) => {
        const element = await this.getButtonByText(text);
        await expect(element).not.toBeVisible();
      }),
    );
  }

  /**
   * This method hovers over element and checks if tooltip with specific text is visible and then hides this tooltip ensuring that it is hidden
   * @param element - playwright locator for the element
   * @param tooltipText - text of the tooltip
   */

  async hoverElAndCheckTooltip(element: Locator, tooltipText: string) {
    await element.hover();
    const tooltip = this.page.getByRole('tooltip', { name: tooltipText });
    await tooltip.waitFor({ state: 'visible' });
    await this.page.getByText('Toolbar').hover();
    await tooltip.waitFor({ state: 'hidden' });
  }

  /**
   * This method checks that there are some elements that should be visible in short toolbar and also some elements that should not be visible there. Also it checks if tooltips are visible and hidden correctly
   * @param visibleElements - array of visible elements with ids and tooltips texts
   * @param hiddenElementsIds - array of ids of hidden elements
   */

  async checkTooltipsInShortToolbar(
    visibleElements: { id: string; tooltipText: string }[],
    hiddenElements: { id: string; tooltipText: string }[],
  ) {
    for (const { id, tooltipText } of visibleElements) {
      const element = this.page.getByTestId(id);
      await expect(element).toBeVisible();
      if (tooltipText !== 'Save as reference area')
        await this.hoverElAndCheckTooltip(element, tooltipText);
    }
    await Promise.all(
      hiddenElements.map(
        async (el) => await expect(this.page.getByTestId(el.id)).not.toBeVisible(),
      ),
    );
  }
  /**
   * This method gets data from testData.json file for toolbar buttons. If buttonsTexts is passed, it returns only buttons that have this texts in visibleButtonText field
   * @param buttonsTexts - array of texts that should be in visibleButtonText field
   * @returns - array of objects
   */

  getToolBarData(buttonsTexts?: string[]) {
    if (buttonsTexts) {
      return this.data.reduce((acc: ToolbarButton[], obj: ToolbarButton) => {
        if (buttonsTexts.includes(obj.visibleButtonText)) acc.push(obj);
        return acc;
      }, []);
    } else {
      return this.data;
    }
  }
}
