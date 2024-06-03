import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();
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
    await pageManager.fromNavigationMenu.goToMap();

    // TO DO: 7525 task will make map a feature and hidden for atlas. Adapt test once map is hidden
    if (project.name !== 'atlas') {
      await pageManager.atToolBar.checkTextsInToolbar(
        visibleTexts,
        hiddenToolbarFeaturesGuest,
      );
    } else {
      await expect(
        await pageManager.atToolBar.getButtonByText('Measure distance'),
      ).not.toBeVisible();
    }
  });
}
