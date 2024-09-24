import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';
import type { Project } from './page-objects/helperBase.ts';

const projects = getProjects();
let limitedProjects = Object.create(projects);
// TO DO: remove logics with limitation for DN once 19469 issue is done
limitedProjects = limitedProjects.filter(
  (project: Project) => project.name !== 'disaster-ninja',
);

const editors: [string, RegExp][] = [
  ['OpenStreetMap.org default editor', /openstreetmap/],
  ['RapiD', /rapideditor/],
  ['iD', /openstreetmap.*editor%3Did/],
];

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
    await pageManager.atNavigationMenu.clickButtonToOpenPage('Profile');
    const osmEditorValue = await pageManager.atProfilePage.getOsmEditorValue();
    expect(osmEditorValue).toBe('OpenStreetMap.org default editor');
  });
}

test.describe(`As PRO User, I can use different OSM editors to open the map`, () => {
  test.describe.configure({ mode: 'serial' });
  for (const project of limitedProjects) {
    for (const [editor, pattern] of editors) {
      test(`As PRO User, I can go to ${project.title}, open map and open ${editor} at map coordinates`, async ({
        context,
        pageManager,
      }) => {
        await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
        await pageManager.atNavigationMenu.clickButtonToOpenPage('Profile');
        const osmEditorValue = await pageManager.atProfilePage.getOsmEditorValue();
        if (osmEditorValue !== editor) {
          await pageManager.atProfilePage.setOsmEditorValue(editor);
          const editedOsmEditorValue =
            await pageManager.atProfilePage.getOsmEditorValue();
          expect(editedOsmEditorValue).toEqual(editor);
        }

        await pageManager.atNavigationMenu.clickButtonToOpenPage('Map');

        await pageManager.atMap.waitForTextBeingVisible('Toolbar');
        await pageManager.atMap.waitForUrlToMatchPattern(/\?map=/i);

        const coordinates = await pageManager.atMap.getViewportFromUrl();

        const [newPage] = await Promise.all([
          context.waitForEvent('page', { timeout: 25000 }),
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
});
