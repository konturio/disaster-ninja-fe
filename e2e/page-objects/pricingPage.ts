import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class PricingPage extends HelperBase {
  /**
   * This method checks that pricing page is visible and has all the texts in it. It also checks that the page is not empty, links to sale are present.
   */

  async checkPageAndTextsAvailability() {
    await this.page.getByText('Enterprise').waitFor({ state: 'visible' });
    const plansAndPricingTexts = await this.page.getByText('Plans & Pricing').all();
    await Promise.all([
      expect(this.page).toHaveTitle(/Plans & Pricing/),
      expect(this.page.getByText('Professional', { exact: true })).toBeVisible(),
      expect(this.page.getByText('Educational', { exact: true })).toBeVisible(),
      expect(this.page.getByText('Custom', { exact: true })).toBeVisible(),
      expect(this.page.getByText('Book a demo', { exact: true })).toHaveAttribute(
        'href',
        'https://calendly.com/kbakhanko/atlas-demo',
      ),
      expect(
        this.page.getByText('Request trial', { exact: true }).first(),
      ).toHaveAttribute('href', 'https://www.kontur.io/demo-call/'),
      expect(this.page.getByText('Contact sales', { exact: true })).toBeVisible(),
      plansAndPricingTexts.forEach((text) => expect(text).toBeVisible()),
      expect(this.page.getByText('Save 5%', { exact: true })).toBeVisible(),
    ]);
  }
}
