import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();
const availableToolbarFeaturesAtlasProUser = [
  'Locate me',
  'Measure distance',
  'Edit map in OSM',
  'Select admin boundary',
  'Upload GeoJSON',
  'Draw or edit geometry',
  'Create MCDA',
  'Upload MCDA',
  'Save as reference area',
];

const hiddenToolbarFeaturesAtlasProUser = [
  'Bivariate matrix',
  'Record sensors',
  'Create layer',
];

const availableToolbarFeaturesOAMProUser = [
  'Locate me',
  'Measure distance',
  'Edit map in OSM',
];

const hiddenToolbarFeaturesOAMProUser = [
  'Bivariate matrix',
  'Record sensors',
  'Create layer',
  'Select admin boundary',
  'Upload GeoJSON',
  'Draw or edit geometry',
  'Create MCDA',
  'Upload MCDA',
  'Save as reference area',
];

const availableToolbarFeaturesSmartCityProUser = [
  'Locate me',
  'Measure distance',
  'Edit map in OSM',
  'Select admin boundary',
  'Upload GeoJSON',
  'Draw or edit geometry',
  'Record sensors',
];

const hiddenToolbarFeaturesSmartCityProUser = [
  'Bivariate matrix',
  'Create MCDA',
  'Upload MCDA',
  'Create layer',
  'Save as reference area',
];

const availableToolbarFeaturesDisasterNinjaProUser = [
  'Locate me',
  'Measure distance',
  'Edit map in OSM',
  'Select admin boundary',
  'Upload GeoJSON',
  'Draw or edit geometry',
];

const hiddenToolbarFeaturesDisasterNinjaProUser = [
  'Record sensors',
  'Bivariate matrix',
  'Create MCDA',
  'Upload MCDA',
  'Create layer',
  'Save as reference area',
];

// Create a loop to loop over all the projects and create a test for everyone
for (const project of projects) {
  test(`As PRO user, I can go to ${project.title}, open map and see only available for me toolbar buttons`, async ({
    pageManager,
  }) => {
    let visibleTexts: string[];
    let hiddenTexts: string[];

    switch (project.name) {
      case 'atlas':
        visibleTexts = availableToolbarFeaturesAtlasProUser;
        hiddenTexts = hiddenToolbarFeaturesAtlasProUser;
        break;
      case 'oam':
        visibleTexts = availableToolbarFeaturesOAMProUser;
        hiddenTexts = hiddenToolbarFeaturesOAMProUser;
        break;
      case 'smart-city':
        visibleTexts = availableToolbarFeaturesSmartCityProUser;
        hiddenTexts = hiddenToolbarFeaturesSmartCityProUser;
        break;
      case 'disaster-ninja':
        visibleTexts = availableToolbarFeaturesDisasterNinjaProUser;
        hiddenTexts = hiddenToolbarFeaturesDisasterNinjaProUser;
        break;
      default:
        visibleTexts = ['Configuration not available'];
        hiddenTexts = ['Configuration not available'];
        break;
    }

    await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    await pageManager.fromNavigationMenu.goToMap();
    await pageManager.atToolBar.checkTextsAndTooltipsInToolbar(visibleTexts, hiddenTexts);
  });
}
