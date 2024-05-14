import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();
const shouldBeVisibleForGuestTexts = [
  'Locate me',
  'Measure distance',
  'Edit map in OSM',
  'Select admin unit',
  'Upload GeoJSON',
  'Draw or edit geometry',
];
const shouldBeVisibleForGuestTextsOAM = [
  'Locate me',
  'Measure distance',
  'Edit map in OSM',
];
const shouldBeNotVisibleForGuestTexts = [
  'Bivariate Matrix',
  'MCDA',
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
        ? shouldBeVisibleForGuestTextsOAM
        : shouldBeVisibleForGuestTexts;

    await pageManager.atBrowser.openProject(project);
    await pageManager.fromNavigationMenu.goToMap();
    await pageManager.atToolBar.checkTextsInToolbar(
      visibleTexts,
      shouldBeNotVisibleForGuestTexts,
    );
  });
}
