import { expect } from '@playwright/test';
import { HelperBase, Project } from './helperBase';

export class MapCanvas extends HelperBase {
  /**
   * This method devides text by ':' and expects 2 parts. 1 part - label with expectedLabel text and 2 - number. Number is checked for being not NaN. If value can not be 0, then it will be checked for being not 0 too.
   * @param resultedText text with ':' separator that should have label and its value
   * @param expectedLabel expected label text to be equal to displayed
   * @param valueCanNotBe0 set to true if value can not be 0
   */

  checkShownPopupResultData(
    resultedText: string,
    expectedLabel: string,
    valueCanNotBe0: boolean,
  ) {
    const arr = resultedText.split(':');
    expect(arr.length).toEqual(2);
    expect(arr[0].trim()).toEqual(expectedLabel);
    const value = Number(arr[1].trim());
    expect(value).not.toBeNaN();
    if (valueCanNotBe0) expect(value).not.toEqual(0.0);
  }

  /**
   * This method waits different time depending on the fact of running tests in CI. For CI - 12 secs, for local run - 6 secs. Designed for waiting for zoom on map.
   */

  async waitForZoom() {
    const zoomTimeout = process.env.CI ? 12000 : 6000;
    await this.page.waitForTimeout(zoomTimeout);
  }
  /**
   * This method compares map with the screenshot of map made during the first run. For not too much precise comparison, accepts customable allowed difference in pixels.
   * @param allowedPixelsDifference - An acceptable ratio of pixels that are different to the total amount of pixels, between 0 and 1, by default = 0
   */

  async compareScreenshotsOfMap(allowedPixelsDifference: number = 0) {
    const map = this.page.locator('#map-view');
    await expect(map).toHaveScreenshot({
      maxDiffPixelRatio: allowedPixelsDifference,
    });
  }

  /**
   * This method waits for URL to match specific regexp pattern. It is mostly useful for testing maps.
   * @param pattern value for url to have inside in form of RegExp
   */

  async waitForUrlToMatchPattern(pattern: RegExp) {
    await this.page.waitForURL(pattern);
  }

  /**
   * This method opens map for desired project by zoom, latitude, longitude at specific place
   * @param zoom number like 13.548
   * @param latitude number like 40.2283
   * @param longitude number like -74.0298
   * @param project desired project
   */
  async goToSpecificAreaByUrl(
    zoom: number,
    latitude: number,
    longitude: number,
    project: Project,
  ) {
    const urlForPlace =
      project.env === 'prod'
        ? `${project.url}/active/?map=${zoom}/${latitude}/${longitude}`
        : `${project.url}&map=${zoom}/${latitude}/${longitude}`;
    await this.page.goto(urlForPlace, { waitUntil: 'domcontentloaded' });
    await this.waitForZoom();
  }

  /**
   * This method gets current map view and clicks by X and Y on the map element. Coordinates start in the top left corner of the map element
   * @param pixelsForX number of pixels for X scale
   * @param pixelsForY number of pixels for Y scale
   */

  async clickPlaceOnMapView(pixelsForX: number, pixelsForY: number) {
    const map = this.page.locator('#map-view');
    const box = await map.boundingBox();
    expect(box).not.toBeNull();
    await this.page.mouse.click(box!.x + pixelsForX, box!.y + pixelsForY);
  }
  /**
   * This method checks population popup that appears for Population Density layer. Checks data for being complete and not nullish.
   */

  async checkPopulationPopupData() {
    const popup = this.page.locator('.maplibregl-popup-content');

    // Check that popup is generally present and has population text there
    await expect(popup).toContainText('Population');
    const listItemsArray = await popup.getByRole('listitem').all();
    const textsArray = await this.getTextsFromAllLocators(listItemsArray);

    this.checkShownPopupResultData(textsArray[0], 'Population', true);
    this.checkShownPopupResultData(textsArray[1], 'Area km2', true);
    this.checkShownPopupResultData(textsArray[2], 'Population / Area km2', true);

    expect(listItemsArray[3]).toBeUndefined();
  }
  /**
   * This method closes population popup for Population density layer. And expects it to be closed with map being displayed.
   */
  async closePopulationPopup() {
    await this.page
      .locator('.maplibregl-popup-content')
      .getByLabel('Close popup')
      .click();
    await expect(
      this.page.locator('.maplibregl-popup-content', { hasText: 'Population' }),
    ).not.toBeVisible();
    await expect(this.page.locator('#map-view')).toBeVisible();
  }
}
