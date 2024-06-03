import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();
const availableToolbarFeaturesUserWithNoRights = [
  'Locate me',
  'Measure distance',
  'Edit map in OSM',
  'Select admin boundary',
  'Upload GeoJSON',
  'Draw or edit geometry',
];
const availableToolbarFeaturesOAMUserWithNoRights = [
  'Locate me',
  'Measure distance',
  'Edit map in OSM',
];
const hiddenToolbarFeaturesUserWithNoRights = [
  'Bivariate matrix',
  'Create MCDA',
  'Upload MCDA',
  'Create layer',
  'Record sensors',
];

const availableToolbarFeaturesSmartCityUserWithNoRights = [
  'Locate me',
  'Measure distance',
  'Edit map in OSM',
  'Select admin boundary',
  'Upload GeoJSON',
  'Draw or edit geometry',
  'Record sensors',
];

const hiddenToolbarFeaturesSmartCityUserWithNoRights = [
  'Bivariate matrix',
  'Create MCDA',
  'Upload MCDA',
  'Create layer',
];

// Create a loop to loop over all the projects and create a test for everyone
for (const project of projects) {
  test(`As User with no rights, I can go to ${project.title}, open map and see only available for me toolbar buttons`, async ({
    pageManager,
  }) => {
    let visibleTexts = availableToolbarFeaturesUserWithNoRights;
    let hiddenTexts = hiddenToolbarFeaturesUserWithNoRights;

    switch (project.name) {
      case 'oam':
        visibleTexts = availableToolbarFeaturesOAMUserWithNoRights;
        break;
      case 'smart-city':
        visibleTexts = availableToolbarFeaturesSmartCityUserWithNoRights;
        hiddenTexts = hiddenToolbarFeaturesSmartCityUserWithNoRights;
        break;
    }

    await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    await pageManager.fromNavigationMenu.goToMap();

    // TO DO: 7525 task will make map a feature and hidden for atlas. Adapt test once map is hidden
    if (project.name !== 'atlas') {
      await pageManager.atToolBar.checkTextsInToolbar(visibleTexts, hiddenTexts);
    } else {
      await expect(
        await pageManager.atToolBar.getButtonByText('Measure distance'),
      ).not.toBeVisible();
    }
  });
}
