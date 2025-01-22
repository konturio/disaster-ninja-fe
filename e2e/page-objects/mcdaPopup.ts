import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';

type MCDAInput = {
  analysisName: string;
  layers: string[];
  inputs: string[];
  expectedSuggestions: string[];
};

export class MCDAPopup extends HelperBase {
  /**
   * This method checks that popup with MCDA form is visible and has correct texts
   */

  async assertMCDAPopupIsOK() {
    const mcdaPopup = this.page.locator('section', {
      has: this.page.getByTestId('mcda-form'),
    });
    const submitButton = mcdaPopup.locator('button[type="submit"]');
    await mcdaPopup.waitFor({ state: 'visible' });
    await Promise.all([
      expect(
        mcdaPopup.getByText('Multi-criteria decision analysis'),
        'Check the title of the popup',
      ).toBeVisible(),
      expect(
        mcdaPopup.getByText('Analysis name'),
        'Check the analysis info is present',
      ).toBeVisible(),
      expect(
        mcdaPopup.getByText('Layer list'),
        'Check the layers list title is present',
      ).toBeVisible(),
      expect(
        mcdaPopup.locator('button[type="reset"]'),
        'Check the reset button is present with correct text',
      ).toHaveText('Cancel'),
      expect(
        submitButton,
        'Check the save button is present with correct text',
      ).toHaveText('Save analysis'),
      expect(
        submitButton,
        'Check that the save button is disabled by default',
      ).toHaveAttribute('disabled'),
    ]);
  }

  /**
   * This method creates MCDA with provided inputs, checks that popup is visible and has correct layers, then clicks save button and checks that popup is closed
   * @param MCDAInput - object with analysis name, layers, inputs and expected suggestions
   */

  async createMCDA({ analysisName, layers, inputs, expectedSuggestions }: MCDAInput) {
    // Method should support any number of layers and inputs, so better check it during runtime and not by ts compiler
    expect(
      layers.length,
      'Check create MCDA method inputs. Number of wanted to choose layers and inputs should be equal',
    ).toEqual(inputs.length);
    expect(
      inputs.length,
      'Check create MCDA method inputs. Number of inputs and expected layers shown in the list should be equal',
    ).toEqual(expectedSuggestions.length);

    const mcdaPopup = this.page.locator('section', {
      has: this.page.getByTestId('mcda-form'),
    });
    const mcdaInput = mcdaPopup.getByTestId('mcda-input-layer-name');
    await expect(
      mcdaInput.locator('..'),
      'Check that layer name input has a placeholder',
    ).toContainText('Climate change');

    await mcdaInput.pressSequentially(analysisName, { delay: 100 });
    await expect(
      mcdaInput,
      'Check that layer name input has a value after user inserts it',
    ).toHaveValue(analysisName);
    await mcdaPopup
      .getByText('Preparing data')
      .waitFor({ state: 'hidden', timeout: 5000 });
    for (let i = 0; i < inputs.length; i++) {
      // We should better get a new locator for each iteration
      const layerInput = mcdaPopup.getByPlaceholder('Select layers');
      await layerInput.pressSequentially(inputs[i], { delay: 50 });
      // Wait for the list of layers to be visible
      const listbox = mcdaPopup.getByRole('listbox');
      await listbox.waitFor({ state: 'visible' });

      await expect(
        listbox,
        'Check that the list of layers suggested is as expected',
      ).toHaveText(expectedSuggestions[i]);

      const layerToSelect = listbox.getByText(layers[i]);
      await layerToSelect.scrollIntoViewIfNeeded();
      await layerToSelect.click({ delay: 100 });

      const expectedLayersInInput = layers.reduce(
        (acc, arg, index) => (index <= i ? acc + arg.trim() : acc),
        '',
      );

      await expect(
        layerInput.locator('..').locator('..'),
        `Check that '${expectedLayersInInput}' is present in the input after '${layers[i]}' is selected`,
      ).toHaveText(expectedLayersInInput);
    }

    const saveButton = mcdaPopup.getByText('Save analysis');
    await expect(
      saveButton,
      'Check that after inputs save button is not disabled',
    ).not.toHaveAttribute('disabled');
    await saveButton.click({ delay: 100, position: { x: 15, y: 15 } });
    // Wait for the popup to close
    await mcdaPopup.waitFor({ state: 'hidden' });
  }
}
