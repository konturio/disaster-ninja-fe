import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

let projects = getProjects();

// Atlas has no 'Edit map in OSM' feature for user with no rights
projects = projects.filter((arg) => arg.name !== 'atlas');

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
    await pageManager.atMap.waitForTextBeingVisible('Tools');

    const coordinates = await pageManager.atMap.getViewportFromUrl();

    const editMapBtn = pageManager.atToolBar.getButtonByText('Edit map in OSM');
    await editMapBtn.hover();

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      editMapBtn.click({
        delay: 330,
      }),
    ]);

    await pageManager.atMap.waitForUrlToMatchPattern(/rapideditor/, newPage);
    const osmCoordinates = await pageManager.atMap.getViewportFromUrl(newPage);
    expect(osmCoordinates).toStrictEqual(coordinates);
  });
}
