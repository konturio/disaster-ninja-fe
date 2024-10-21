import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class PricingPage extends HelperBase {
  /**
   * This method checks that page is visible and has all the texts
   */

  async checkPageAndTextsAvailability() {
    await this.page.getByText('Enterprise').waitFor({ state: 'visible' });
    const plansAndPricingTexts = await this.page.getByText('Plans & Pricing').all();
    await Promise.all([
      expect(await this.page.title()).toContain('Plans & Pricing'),
      expect(this.page.getByText('Professional', { exact: true })).toBeVisible(),
      expect(this.page.getByText('Educational', { exact: true })).toBeVisible(),
      expect(this.page.getByText('Custom', { exact: true })).toBeVisible(),
      expect(
        await this.page.getByText('Book a demo', { exact: true }).getAttribute('href'),
      ).toEqual('https://calendly.com/kbakhanko/atlas-demo'),
      expect(
        await this.page
          .getByText('Request trial', { exact: true })
          .first()
          .getAttribute('href'),
      ).toEqual('https://www.kontur.io/demo-call/'),
      expect(this.page.getByText('Contact sales', { exact: true })).toBeVisible(),
      plansAndPricingTexts.forEach((text) => expect(text).toBeVisible()),
      expect(this.page.getByText('Save 5%', { exact: true })).toBeVisible(),
    ]);
  }
}
