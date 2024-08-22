import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();

for (const project of projects) {
  test(`As PRO User, I can go to ${project.title}, open profile page and have default OSM editor`, async ({
    page,
    pageManager,
  }) => {
    await page.route('*/**/active/api/users/current_user', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      await route.fulfill({
        response,
        json: {
          ...json,
          osmEditor: null,
        },
      });
    });
    await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    await pageManager.fromNavigationMenu.goToProfilePage();
    const osmEditorValue = await pageManager.atProfilePage.getOsmEditorValue();
    expect(osmEditorValue).toBe('OpenStreetMap.org default editor');
  });

  const editors: [string, RegExp][] = [
    ['OpenStreetMap.org default editor', /openstreetmap/],
    ['RapiD', /rapideditor/],
    ['iD', /openstreetmap.*editor%3Did/],
    // ['JOSM', /load_and_zoom/], // I can't test this because pl does not allow to open unreachable urls
  ];

  for (const [editor, pattern] of editors) {
    test(`As PRO User, I can go to ${project.title}, open map and open ${editor} at map coordinates`, async ({
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
