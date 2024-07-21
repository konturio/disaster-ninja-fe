import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';
import type { Page } from '@playwright/test';
import type { Project } from './helperBase';

export class MapCanvas extends HelperBase {
  /**
   * Splits the provided text by ':' and checks the resulting parts. The first part should match the expected label, and the second part should be a number that is not NaN. Additionally, if the value cannot be zero, this is also checked.
   * @param resultedText Text containing a label and its value separated by ':'
   * @param expectedLabel The expected text of the label
   * @param valueCanNotBe0 True if the value cannot be zero, otherwise false
   */

  checkPopupData(resultedText: string, expectedLabel: string, valueCanNotBe0: boolean) {
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
    const urlForPlace = `${project.url}&map=${zoom}/${latitude}/${longitude}`;
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
    await this.page.mouse.click(box!.x + pixelsForX, box!.y + pixelsForY, { delay: 150 });
  }
  /**
   * This method checks population popup that appears for Population Density layer. Checks data for being complete and not nullish.
   */

  async checkPopulationPopupData() {
    await this.page.locator('.maplibregl-popup-content').waitFor({ state: 'visible' });
    const popup = this.page.locator('.maplibregl-popup-content');

    // Check that popup is generally present and has population text there
    await expect(popup).toContainText('Population');
    const listItemsArray = await popup.getByRole('listitem').all();
    const textsArray = await this.getTextsFromLocators(listItemsArray);

    this.checkPopupData(textsArray[0], 'Population', true);
    this.checkPopupData(textsArray[1], 'Area km2', true);
    this.checkPopupData(textsArray[2], 'Population / Area km2', true);

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

  /**
   * This method gets current url coordinates and returns its integer parts
   * @param page playwright page to get url from
   * @returns object with zoom, latitude, longitude. Integer values
   */

  async getViewportFromUrl(page: Page = this.page) {
    const mapData = page.url().split('map=')[1].split('&')[0];
    expect(mapData).toBeDefined();

    const [zoom, latitude, longitude] = mapData!.split('/').map(Number);
    expect(zoom).not.toBeNaN();
    expect(latitude).not.toBeNaN();
    expect(longitude).not.toBeNaN();

    return {
      zoomInteger: Math.trunc(zoom),
      latitudeInteger: Math.trunc(latitude),
      longitudeInteger: Math.trunc(longitude),
    };
  }
}
