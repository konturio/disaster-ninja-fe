import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
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

test.describe(`As PRO User, I can use different OSM editors to open the map and I can update details of my profile`, () => {
  test.describe.configure({ mode: 'serial' });
  for (const project of limitedProjects) {
    for (const [editor, pattern] of editors) {
      test(`As PRO User, I can go to ${project.title}, update profile details, open map and open ${editor} at map coordinates`, async ({
        context,
        pageManager,
        page,
      }) => {
        const newFullName = faker.person.fullName();
        const newBio = faker.lorem.paragraph();
        await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
        await pageManager.atNavigationMenu.clickButtonToOpenPage('Profile');
        const osmEditorValue = await pageManager.atProfilePage.getOsmEditorValue();
        await pageManager.atProfilePage.setBioValue(newBio);
        await pageManager.atProfilePage.setFullNameValue(newFullName);
        if (osmEditorValue !== editor) {
          await pageManager.atProfilePage.setOsmEditorValue(editor);
          await pageManager.atProfilePage.saveChanges();
          const editedOsmEditorValue =
            await pageManager.atProfilePage.getOsmEditorValue();
          expect(editedOsmEditorValue).toEqual(editor);
        } else {
          await pageManager.atProfilePage.saveChanges();
        }
        const newProfileData = await pageManager.atProfilePage.getProfileData(project, {
          shouldOsmEditorBeSeenOnAtlas: true,
        });
        expect(newProfileData.bioValue, 'Bio should be updated').toStrictEqual(newBio);
        expect(newProfileData.fullNameValue, 'Full name should be updated').toStrictEqual(
          newFullName,
        );

        await Promise.all([
          pageManager.atNavigationMenu.clickButtonToOpenPage('Map'),
          pageManager.atMap.waitForUrlToMatchPattern(/\?map=/i, page, 'domcontentloaded'),
        ]);
        await pageManager.atMap.waitForTextBeingVisible('Tools', page);

        // TO DO: async behaviour of app being loaded is not stable and waiting for events like router-layout-ready is not possible for already loaded app, so waiting for timeout is needed + to emulate real user behaviour
        await page.waitForTimeout(process.env.CI ? 7000 : 5000);

        const coordinates = await pageManager.atMap.getViewportFromUrl();

        const editMapBtn = pageManager.atToolBar.getButtonByText('Edit map in OSM', page);
        await editMapBtn.hover();

        const [newPage] = await Promise.all([
          context.waitForEvent('page', { timeout: 25000 }),
          editMapBtn.click({
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
