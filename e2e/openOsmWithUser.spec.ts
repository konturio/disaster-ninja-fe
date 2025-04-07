import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects, stepCounter } from './page-objects/helperBase.ts';
import type { Project } from './page-objects/helperBase.ts';

let projects = getProjects();
test.beforeEach(() => {
  stepCounter.counter = 0;
});

// Atlas has no map for user with no rights
projects = projects.filter((arg: Project) => arg.name !== 'atlas');

for (const project of projects) {
  test(`As User with no rights, I can go to ${project.title}, open map and open Rapid OSM editor at map coordinates`, async ({
    context,
    pageManager,
    page,
  }) => {
    await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    await Promise.all([
      pageManager.atNavigationMenu.clickButtonToOpenPage('Map'),
      pageManager.atMap.waitForUrlToMatchPattern(/\?map=/i, page, 'domcontentloaded'),
    ]);
    await pageManager.atMap.waitForTextBeingVisible('Tools', page);

    // TO DO: async behaviour of app being loaded is not stable and waiting for events like router-layout-ready is not possible for already loaded app, so waiting for timeout is needed + to emulate real user behaviour
    await page.waitForTimeout(process.env.CI ? 7000 : 5000);

    const coordinates = await pageManager.atMap.getViewportFromUrl();

    const newPage =
      await pageManager.atToolBar.clickEditMapInOSMBtnAndWaitForOSMOpen(context);

    await pageManager.atMap.waitForUrlToMatchPattern(/rapideditor/, newPage);
    const osmCoordinates = await pageManager.atMap.getViewportFromUrl(newPage);
    expect(
      osmCoordinates,
      `Expect osm coordinates at Rapid OSM editor to be equal to ${JSON.stringify(coordinates)}`,
    ).toStrictEqual(coordinates);
  });
}
