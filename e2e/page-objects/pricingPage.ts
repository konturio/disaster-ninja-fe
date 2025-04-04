import { expect } from '@playwright/test';
import { HelperBase, step } from './helperBase';

export class PricingPage extends HelperBase {
  /**
   * This method checks that pricing page is visible and has all the texts in it. It also checks that the page is not empty, links to sale are present.
   */

  @step(
    () =>
      'Verify that the pricing page is visible. Check that all relevant texts are displayed, including titles, plan names, and texts to sale.',
  )
  async checkPageAndTextsAvailability() {
    await this.page.getByText('Enterprise').waitFor({ state: 'visible' });
    const plansAndPricingTexts = await this.page.getByText('Plans & Pricing').all();
    await Promise.all([
      expect(this.page, 'Expect title to be plans and pricing').toHaveTitle(
        /Plans & Pricing/,
      ),
      expect(
        this.page.getByText('Professional', { exact: true }),
        'Expect professional plan to be visible',
      ).toBeVisible(),
      expect(
        this.page.getByText('Educational', { exact: true }),
        'Expect educational plan to be visible',
      ).toBeVisible(),
      expect(
        this.page.getByText('Custom', { exact: true }),
        'Expect custom plan to be visible',
      ).toBeVisible(),
      expect(
        this.page.getByText('Contact sales', { exact: true }),
        'Expect contact sales text to be visible',
      ).toBeVisible(),
      plansAndPricingTexts.forEach((textEl) =>
        expect(
          textEl,
          `Assert plans and pricint texts: expect '${textEl.textContent}' to be visible`,
        ).toBeVisible(),
      ),
      expect(
        this.page.getByText('Save 5%', { exact: true }),
        'Expect save 5% text to be visible',
      ).toBeVisible(),
    ]);
  }
}
