import { expect } from '@playwright/test';
import { HelperBase, Project } from './helperBase';

export class MapCanvas extends HelperBase {
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
}
