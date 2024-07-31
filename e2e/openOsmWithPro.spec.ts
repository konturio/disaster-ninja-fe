import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();

for (const project of projects) {
  test(`As PRO User, I can go to ${project.title}, open map and open Rapid OSM editor at map coordinates`, async ({
    context,
    pageManager,
  }) => {
    await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    await pageManager.fromNavigationMenu.goToMap();

    // TO DO: remove this action after 18582 issue is fixed
    await pageManager.atMap.goToSpecificAreaByUrl(10.597, 53.9196, 27.5097, project);

    const coordinates = await pageManager.atMap.getViewportFromUrl();

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      (await pageManager.atToolBar.getButtonByText('Edit map in OSM')).click({
        delay: 330,
      }),
    ]);

    await pageManager.atMap.waitForUrlToMatchPattern(/rapideditor/, newPage);
    const osmCoordinates = await pageManager.atMap.getViewportFromUrl(newPage);
    expect(osmCoordinates).toStrictEqual(coordinates);
  });
}
