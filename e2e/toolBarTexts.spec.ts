import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects, stepCounter } from './page-objects/helperBase.ts';

const projects = getProjects();
test.beforeEach(() => {
  stepCounter.counter = 0;
});
const availableToolbarFeaturesGuest = [
  'Locate me',
  'Measure distance',
  'Edit map in OSM',
  'Select admin boundary',
  'Upload GeoJSON',
  'Draw or edit geometry',
];
const availableToolbarFeaturesGuestOAM = [
  'Locate me',
  'Measure distance',
  'Edit map in OSM',
];
const hiddenToolbarFeaturesGuest = [
  'Bivariate matrix',
  'Create MCDA',
  'Upload MCDA',
  'Create layer',
  'Record sensors',
  'Save as reference area',
];

// Create a loop to loop over all the projects and create a test for everyone
for (const project of projects) {
  test(`As Guest, I can go to ${project.title}, open map and see only available for me toolbar buttons`, async ({
    pageManager,
  }) => {
    const visibleTexts =
      project.name === 'oam'
        ? availableToolbarFeaturesGuestOAM
        : availableToolbarFeaturesGuest;

    await pageManager.atBrowser.openProject(project);
    if (project.name === 'atlas') {
      await pageManager.atMap.goToSpecificAreaByUrl(5, 134, 80, project);
    } else {
      await pageManager.atNavigationMenu.clickButtonToOpenPage('Map');
    }

    if (project.name !== 'atlas') {
      await pageManager.atToolBar.checkTextsAndTooltipsInToolbar(
        visibleTexts,
        hiddenToolbarFeaturesGuest,
      );
      await pageManager.atToolBar.resizeToolbar({ collapse: true });
      await pageManager.atToolBar.checkTooltipsInShortToolbar(
        pageManager.atToolBar.getToolBarData(visibleTexts),
        pageManager.atToolBar.getToolBarData(hiddenToolbarFeaturesGuest),
      );
      await pageManager.atToolBar.resizeToolbar({ collapse: false });
      await pageManager.atToolBar.checkTextsAndTooltipsInToolbar(
        visibleTexts,
        hiddenToolbarFeaturesGuest,
      );
    } else {
      await expect(
        pageManager.atToolBar.getButtonByText('Measure distance'),
      ).not.toBeVisible();
    }
  });
}
