import { expect } from '@playwright/test';
import { HelperBase, step } from './helperBase';
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
    expect(arr.length, `Check that ${resultedText} has 2 parts delimited by ":"`).toEqual(
      2,
    );
    expect(
      arr[0].trim(),
      `Check that first part of ${resultedText} equals to '${expectedLabel}' label`,
    ).toEqual(expectedLabel);
    const value = Number(arr[1].trim());
    expect(
      value,
      `Check that second part of ${resultedText}, being precise, ${value}, is not NaN after converting to number`,
    ).not.toBeNaN();
    if (valueCanNotBe0)
      expect(
        value,
        `Check that second part of ${resultedText}, being precise, ${value}, is not zero`,
      ).not.toEqual(0.0);
  }

  /**
   * This method compares map with the screenshot of map made during the first run. For not too much precise comparison, accepts customable allowed difference in pixels.
   * @param allowedPixelsDifference - An acceptable ratio of pixels that are different to the total amount of pixels, between 0 and 1, by default = 0
   */
  @step(
    (args) =>
      `Get a map view image and compare it with the expected screenshot of it with ${args[0] * 100 || 0}% pixels allowed difference`,
  )
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

  @step(
    (args) =>
      `Go to ${args[3].url}&map=${args[0]}/${args[1]}/${args[2]} and wait for layout being ready. After that wait for zoom`,
  )
  async goToSpecificAreaByUrl(
    zoom: number,
    latitude: number,
    longitude: number,
    project: Project,
  ) {
    const urlForPlace = `${project.url}&map=${zoom}/${latitude}/${longitude}`;
    await this.page.goto(urlForPlace, { waitUntil: 'commit' });
    await Promise.all([
      this.waitForEventWithFilter(this.page, 'METRICS', 'router-layout-ready'),
      this.page.waitForLoadState(),
    ]);
    await this.waitForZoom();
  }

  /**
   * This method gets current map view and clicks by X and Y on the map element. Coordinates start in the top left corner of the map element
   * @param pixelsForX number of pixels for X scale
   * @param pixelsForY number of pixels for Y scale
   * @param project project to be used
   */

  @step(
    (args) =>
      `Uncheck the checkbox "Active contributors" if needed and click with left click on the map view at ${args[0]} pixels for X and ${args[1]} pixels for Y`,
  )
  async clickPlaceOnMapView(pixelsForX: number, pixelsForY: number, project: Project) {
    if (project.name === 'disaster-ninja') {
      await this.page.getByText('Active contributors').click();
    }
    const map = this.page.locator('#map-view');
    const box = await map.boundingBox();
    expect(
      box,
      'Expect map view element to be displayed and be parseable to Playwright bounding box',
    ).not.toBeNull();
    await this.page.mouse.click(box!.x + pixelsForX, box!.y + pixelsForY, { delay: 120 });
  }

  /**
   * This method checks population popup that appears for Population Density layer. Checks data for being complete and not nullish.
   */

  @step(() => `Check that population popup is visible and has correct texts`)
  async checkPopulationPopupData() {
    await this.page.locator('.maplibregl-popup-content').waitFor({ state: 'visible' });
    const popup = this.page.locator('.maplibregl-popup-content');

    // Check that popup is generally present and has population text there
    await expect(popup, 'Check that popup has "Population" text').toContainText(
      'Population',
    );
    const listItemsArray = await popup.getByRole('listitem').all();
    const textsArray = await this.getTextsFromLocators(listItemsArray);

    this.checkPopupData(textsArray[0], 'Population', true);
    this.checkPopupData(textsArray[1], 'Area km2', true);
    this.checkPopupData(textsArray[2], 'Population / Area km2', true);

    expect(
      listItemsArray[3],
      'Check that there is no 4-th element in the list of data at the population popup',
    ).toBeUndefined();
  }
  /**
   * This method closes population popup for Population density layer. And expects it to be closed with map being displayed.
   */
  @step(
    () =>
      `Close population popup with 'Close popup' label and check that it is closed and map is displayed`,
  )
  async closePopulationPopup() {
    await this.page
      .locator('.maplibregl-popup-content')
      .getByLabel('Close popup')
      .click({ delay: 330 });
    await expect(
      this.page.locator('.maplibregl-popup-content', { hasText: 'Population' }),
      `Check that popup with 'Population' text is not visible`,
    ).not.toBeVisible();
    await expect(
      this.page.locator('#map-view'),
      'Check that map view element is displayed',
    ).toBeVisible();
  }

  /**
   * This method gets current url coordinates and returns its integer parts
   * @param page playwright page to get url from
   * @returns object with zoom, latitude, longitude. Integer values
   */

  @step(
    (args) =>
      `Get viewport from application url ${args[0]?.url() || ''} and check that map data is defined and that zoom, latitude and longitude are not NaN`,
  )
  async getViewportFromUrl(page: Page = this.page) {
    const mapData = page.url().split('map=')[1].split('&')[0];
    expect(mapData, `Check that map data (${mapData}) is defined`).toBeDefined();

    const [zoom, latitude, longitude] = mapData!.split('/').map(Number);
    expect(zoom, `Check that zoom (${zoom}) is not NaN`).not.toBeNaN();
    expect(latitude, `Check that latitude (${latitude}) is not NaN`).not.toBeNaN();
    expect(longitude, `Check that longitude (${longitude}) is not NaN`).not.toBeNaN();

    return {
      zoomInteger: Math.trunc(zoom),
      latitudeInteger: Math.trunc(latitude),
      longitudeInteger: Math.trunc(longitude),
    };
  }

  /**
   * This method searches for location in map by text
   * @param searchText text to search for
   * @param desiredLocation location to choose from search results
   * @param queryToSearchRegExp regexp to wait for response of api call
   */
  @step(
    (args) =>
      `Write in search bar '${args[0]}', click button, wait for response of api call (regexp: ${args[2].toString()}). Then check that location '${args[1]}' is present in the list of search results by clicking on it`,
  )
  async searchForLocation(
    searchText: string,
    desiredLocation: string,
    queryToSearchRegExp: RegExp,
  ) {
    await this.page
      .getByPlaceholder('Search or ask AI')
      .pressSequentially(searchText, { delay: 30 });
    await Promise.all([
      this.page.getByLabel('search', { exact: true }).click({ delay: 100 }),
      this.page.waitForResponse(queryToSearchRegExp),
    ]);
    await this.page.getByText(desiredLocation).click({ delay: 100 });
  }

  /**
   * This method checks that breadcrumbs contain expected locations in order specified in array
   * @param expectedLocations array of expected locations in breadcrumbs as strings
   */

  @step(
    (args) =>
      `Verify that breadcrumbs contain the expected locations in the correct order: ${args.join(', ')}. Iterate through each breadcrumb and assert its text matches the corresponding expected value.`,
  )
  async assertLocationInBreadcrumbs(expectedLocations: string[]) {
    const breadcrumbsPanel = this.page.getByLabel('breadcrumb', { exact: true });
    for (let i = 0; i < expectedLocations.length; i++) {
      await expect(
        breadcrumbsPanel.locator('span').nth(i),
        `Check that a breadcrumb contains ${expectedLocations[i]}`,
      ).toHaveText(expectedLocations[i]);
    }
  }

  /**
   * This method checks that KONTUR_MAP object in the page has correct coordinates
   * @param param0 - object with expected latitude and longitude
   */

  @step(
    (args) =>
      `Assert that KONTUR_MAP object in the page has correct coordinates (${JSON.stringify(args[0])})`,
  )
  async assertLocationInMapObject({
    expectedLatitude,
    expectedLongitude,
  }: {
    expectedLatitude: number;
    expectedLongitude: number;
  }) {
    const center = await this.page.evaluate(() => {
      //@ts-expect-error KONTUR_MAP is defined in the page at window object
      const { lat, lng } = window.KONTUR_MAP.getCenter();
      return { lat, lng };
    });
    expect(center.lat, `Expect latitude to be close to ${expectedLatitude}`).toBeCloseTo(
      expectedLatitude,
    );
    expect(
      center.lng,
      `Expect longitude to be close to ${expectedLongitude}`,
    ).toBeCloseTo(expectedLongitude);
  }
}
