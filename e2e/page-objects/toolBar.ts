import { expect } from '@playwright/test';
import { HelperBase, getTestData, step } from './helperBase';
import type { Locator, Page, BrowserContext } from '@playwright/test';

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
   * @param page - playwright page to use
   * @returns - playwright locator for the button
   */

  getButtonByText(text: string, page: Page = this.page): Locator {
    const aliveMap = page.locator('.keep-alive-render');
    return aliveMap.getByText(text, { exact: true });
  }

  /**
   * This method clicks arrows at toolbar to make it short or big and asserts toolbar is in the needed state
   * @param collapse - make toolbar short or make it big. true for short
   */

  @step(
    (args) =>
      `Resize the toolbar. Set it to ${args[0].collapse ? 'short' : 'big'} state and verify the state.`,
  )
  async resizeToolbar({ collapse = true }: { collapse: boolean }) {
    const toolbarPanel = this.page.getByTestId('toolbar');
    const svgNumberToClick = collapse ? 2 : 1;
    await toolbarPanel.locator('svg').nth(svgNumberToClick).click();
    await expect(
      toolbarPanel.getByText('Toolbar'),
      `Expect toolbar text to be visible and to be ${collapse ? 'short' : 'big'}`,
    ).toBeVisible();
    if (collapse) {
      await expect(
        toolbarPanel.getByText('Select admin boundary'),
        `Expect select admin boundary text not to be visible`,
      ).not.toBeVisible();
    } else {
      await expect(
        toolbarPanel.getByText('Locate me'),
        `Expect locate me text to be visible`,
      ).toBeVisible();
    }
  }

  /**
   * This method checks that there are some texts/tooltips that should be visible in big toolbar and also some texts that should not be visible there
   * @param visibleTexts - array of visible texts
   * @param hiddenTexts - array of hidden texts
   */

  @step(
    (args) =>
      `Check that the following texts in toolbar are visible: ${args[0].join(', ')} and the following texts are hidden: ${args[1].join(', ')}. Check tooltips for visible texts.`,
  )
  async checkTextsAndTooltipsInToolbar(visibleTexts: string[], hiddenTexts: string[]) {
    for (const text of visibleTexts) {
      const element = await this.getButtonByText(text);
      await expect(
        element,
        `Expect element with text '${text}' to be visible on the map side of app`,
      ).toBeVisible();
      if (text !== 'Save as reference area')
        await this.hoverElAndCheckTooltip(element, text);
    }
    await Promise.all(
      hiddenTexts.map(async (text) => {
        const element = await this.getButtonByText(text);
        await expect(
          element,
          `Expect element with text '${text}' to be hidden on the map side of app`,
        ).not.toBeVisible();
      }),
    );
  }

  /**
   * This method hovers over element and checks if tooltip with specific text is visible and then hides this tooltip ensuring that it is hidden
   * @param element - playwright locator for the element
   * @param tooltipText - text of the tooltip
   */
  @step(
    (args) =>
      `Hover over the element to check the tooltip with text '${args[1]}'. Ensure tooltip becomes visible and then hide it by hovering over toolbar again.`,
  )
  async hoverElAndCheckTooltip(element: Locator, tooltipText: string) {
    await element.hover();
    const tooltip = this.page.getByRole('tooltip', { name: tooltipText });
    await tooltip.waitFor({ state: 'visible' });
    await this.page.getByText('Collapse').hover();
    await tooltip.waitFor({ state: 'hidden' });
  }

  /**
   * This method checks that there are some elements that should be visible in short toolbar and also some elements that should not be visible there. Also it checks if tooltips are visible and hidden correctly
   * @param visibleElements - array of visible elements with ids and tooltips texts
   * @param hiddenElementsIds - array of ids of hidden elements
   */

  @step(
    (args) =>
      `Check that the following elements are visible in short toolbar with correct tooltips: ${args[0]
        .map((el) => el.tooltipText)
        .join(
          ', ',
        )}. Also, verify the following elements are hidden (check by ids): ${args[1]
        .map((el) => el.id)
        .join(', ')}.`,
  )
  async checkTooltipsInShortToolbar(
    visibleElements: { id: string; tooltipText: string }[],
    hiddenElements: { id: string; tooltipText: string }[],
  ) {
    for (const { id, tooltipText } of visibleElements) {
      const element = this.page.getByTestId(id);
      await expect(
        element,
        `Expect element with test id '${id}' to be visible`,
      ).toBeVisible();
      if (tooltipText !== 'Save as reference area')
        await this.hoverElAndCheckTooltip(element, tooltipText);
    }
    await Promise.all(
      hiddenElements.map(
        async (el) =>
          await expect(
            this.page.getByTestId(el.id),
            `Check that element with test id '${el.id}' is hidden`,
          ).not.toBeVisible(),
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

  /**
   * This method hovers and clicks 'Edit map in OSM' button and waits for OSM to open
   * @param context - browser context passed by Playwright
   * @returns newly opened page
   */

  @step(() => `Hover and click 'Edit map in OSM' button and wait for OSM to open`)
  async clickEditMapInOSMBtnAndWaitForOSMOpen(context: BrowserContext) {
    const editMapBtn = this.getButtonByText('Edit map in OSM');
    await editMapBtn.hover();

    const [newPage] = await Promise.all([
      context.waitForEvent('page', { timeout: 35000 }),
      editMapBtn.click({
        delay: 330,
      }),
    ]);
    return newPage;
  }
}
