import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class MCDAPopup extends HelperBase {
  /**
   * This method checks that popup with MCDA form is visible and has correct texts
   */

  async assertMCDAPopupIsOK() {
    const mcdaPopup = this.page.locator('section', {
      has: this.page.getByTestId('mcda-form'),
    });
    await mcdaPopup.waitFor({ state: 'visible' });
    await Promise.all([
      expect(mcdaPopup.getByText('Multi-criteria decision analysis')).toBeVisible(),
      expect(mcdaPopup.getByText('Analysis name')).toBeVisible(),
      expect(mcdaPopup.getByText('Layer list')).toBeVisible(),
    ]);
  }
}
