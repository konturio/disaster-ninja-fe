import { getProjects } from './page-objects/helperBase.ts';
import { test } from './fixtures/test-options.ts';
import type { Project } from './page-objects/helperBase.ts';

const projects: Project[] = getProjects();

const projectsWithMCDA = projects.filter((project) => project.name === 'atlas');
const areaToSearch = 'Homewood, USA';
const desiredLocation = 'Homewood, Jefferson County, Alabama, United States';
const queryToSearchRegExp = /&query=Homewood%2C\+USA/;

for (const project of projectsWithMCDA) {
  test.describe(`As PRO user, I can go to map at ${project.title}, find '${areaToSearch}' location and work with MCDA`, () => {
    test(`Search for create MCDA`, async ({ pageManager }) => {
      await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
      await pageManager.atNavigationMenu.clickButtonToOpenPage('Map');
      await pageManager.atMap.searchForLocation(
        areaToSearch,
        desiredLocation,
        queryToSearchRegExp,
      );
      await pageManager.atMap.assertLocationInBreadcrumbs(
        desiredLocation.split(', ').reverse(),
      );
    });
  });
}
