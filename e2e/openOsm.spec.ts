import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';
import type { Project } from './page-objects/helperBase.ts';

let projects = getProjects();

// Atlas has no 'Edit map in OSM' feature for guest
projects = projects.filter((arg: Project) => arg.name !== 'atlas');

for (const project of projects) {
  test.fixme(
    `As Guest, I can go to ${project.title}, open map and open OSM at map coordinates`,
    {
      annotation: {
        type: 'issue',
        description: `Fix issue https://kontur.fibery.io/Tasks/Task/FE-Guest-opens-incorrect-location-in-OSM-using-'Edit-map-in-OSM'-feature-19485 to activate this tests`,
      },
    },
    async ({ context, pageManager, page }) => {
      await pageManager.atBrowser.openProject(project);
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

      await pageManager.atMap.waitForUrlToMatchPattern(/openstreetmap/, newPage);
      const osmCoordinates = await pageManager.atMap.getViewportFromUrl(newPage);
      expect(osmCoordinates).toStrictEqual(coordinates);
    },
  );
}
