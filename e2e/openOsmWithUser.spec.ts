import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

let projects = getProjects();

// Atlas has no 'Edit map in OSM' feature for user with no rights
projects = projects.filter((arg) => arg.name !== 'atlas');

for (const project of projects) {
  const editors: [string, RegExp][] = [
    ['OpenStreetMap.org default editor', /openstreetmap/],
    ['RapiD', /rapideditor/],
    ['iD', /openstreetmap.*editor%3Did/],
    // ['JOSM', /load_and_zoom/], // TODO: Fix that waitForUrlToMatchPattern is not working with JOSM
    // JOSM example url:http://127.0.0.1:8111/load_and_zoom?left=86.92857142857143&right=87.07142857142857&top=23.595428571428574&bottom=23.452571428571428
  ];

  for (const [editor, pattern] of editors) {
    test(`As User with no rights, I can go to ${project.title}, open map and open ${editor} at map coordinates`, async ({
      context,
      pageManager,
    }) => {
      await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
      await pageManager.fromNavigationMenu.goToProfilePage();
      const osmEditorValue = await pageManager.atProfilePage.getOsmEditorValue();
      if (osmEditorValue !== editor) {
        await pageManager.atProfilePage.setOsmEditorValue(editor);
      }
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

      await pageManager.atMap.waitForUrlToMatchPattern(pattern, newPage);
      const osmCoordinates = await pageManager.atMap.getViewportFromUrl(newPage);
      expect(osmCoordinates).toStrictEqual(coordinates);
    });
  }
}
