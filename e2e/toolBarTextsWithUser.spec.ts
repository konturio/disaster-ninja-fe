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
  'Save as reference area',
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
  'Save as reference area',
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
    project.name === 'atlas'
      ? await pageManager.atMap.goToSpecificAreaByUrl(5, 134, 80, project)
      : await pageManager.fromNavigationMenu.goToMap();

    if (project.name !== 'atlas') {
      await pageManager.atToolBar.checkTextsInToolbar(visibleTexts, hiddenTexts);
    } else {
      await expect(
        await pageManager.atToolBar.getButtonByText('Measure distance'),
      ).not.toBeVisible();
    }
  });
}
