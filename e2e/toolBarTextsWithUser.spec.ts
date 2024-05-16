import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();
const shouldBeVisibleForUserWithNoRightsTexts = [
  'Locate me',
  'Measure distance',
  'Edit map in OSM',
  'Select admin unit',
  'Upload GeoJSON',
  'Draw or edit geometry',
];
const shouldBeVisibleForUserWithNoRightsTextsOAM = [
  'Locate me',
  'Measure distance',
  'Edit map in OSM',
];
const shouldBeNotVisibleForUserWithNoRightsTexts = [
  'Bivariate Matrix',
  'MCDA',
  'Upload MCDA',
  'Create layer',
  'Record sensors',
];

// Create a loop to loop over all the projects and create a test for everyone
for (const project of projects) {
  test(`As User with no rights, I can go to ${project.title}, open map and see only available for me toolbar buttons`, async ({
    pageManager,
  }) => {
    const visibleTexts =
      project.name === 'oam'
        ? shouldBeVisibleForUserWithNoRightsTextsOAM
        : shouldBeVisibleForUserWithNoRightsTexts;

    await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    await pageManager.fromNavigationMenu.goToMap();
    await pageManager.atToolBar.checkTextsInToolbar(
      visibleTexts,
      shouldBeNotVisibleForUserWithNoRightsTexts,
    );
  });
}
