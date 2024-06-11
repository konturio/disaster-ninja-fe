import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

let projects = getProjects();

// Atlas has no 'Edit map in OSM' feature for guest
projects = projects.filter((arg) => arg.name !== 'atlas');

for (const project of projects) {
  test(`As Guest, I can go to ${project.title}, open map and open OSM at map coordinates`, async ({
    context,
    pageManager,
  }) => {
    await pageManager.atBrowser.openProject(project);
    await pageManager.fromNavigationMenu.goToMap();

    // TO DO: remove this action after 18582 issue is fixed
    await pageManager.atMap.goToSpecificAreaByUrl(10.597, 53.9196, 27.5097, project);

    const coordinates = await pageManager.atMap.getViewportFromUrl();

    // Start waiting for new page being opened
    const newPagePromise = context.waitForEvent('page');

    await (await pageManager.atToolBar.getButtonByText('Edit map in OSM')).click();
    const newPage = await newPagePromise;

    await pageManager.atMap.waitForUrlToMatchPattern(/openstreetmap/, newPage);
    const osmCoordinates = await pageManager.atMap.getViewportFromUrl(newPage);
    expect(osmCoordinates).toStrictEqual(coordinates);
  });
}
