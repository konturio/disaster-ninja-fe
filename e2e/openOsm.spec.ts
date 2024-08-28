import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

let projects = getProjects();

// Atlas has no 'Edit map in OSM' feature for guest
projects = projects.filter((arg) => arg.name !== 'atlas');

for (const project of projects) {
  test.fixme(
    `As Guest, I can go to ${project.title}, open map and open OSM at map coordinates`,
    {
      annotation: {
        type: 'issue',
        description: `Fix issue https://kontur.fibery.io/Tasks/Task/FE-Guest-opens-incorrect-location-in-OSM-using-'Edit-map-in-OSM'-feature-19485to activate this tests`,
      },
    },
    async ({ context, pageManager }) => {
      await pageManager.atBrowser.openProject(project);
      await pageManager.fromNavigationMenu.goToMap();

      // TO DO: remove this action after 18582 issue is fixed
      await pageManager.atMap.goToSpecificAreaByUrl(10.597, 53.9196, 27.5097, project);

      const coordinates = await pageManager.atMap.getViewportFromUrl();

      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        (await pageManager.atToolBar.getButtonByText('Edit map in OSM')).click({
          delay: 150,
        }),
      ]);

      await pageManager.atMap.waitForUrlToMatchPattern(/openstreetmap/, newPage);
      const osmCoordinates = await pageManager.atMap.getViewportFromUrl(newPage);
      expect(osmCoordinates).toStrictEqual(coordinates);
    },
  );
}
