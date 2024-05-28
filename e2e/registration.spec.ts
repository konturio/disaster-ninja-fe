import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects().filter((project) => project.env !== 'prod');

// Create a loop to loop over all the projects and create a test for everyone
for (const project of projects) {
  test(`As Guest, I can register at ${project.title}, verify email, login and check that this profile is mine`, async ({
    pageManager,
    context,
  }) => {
    await pageManager.atBrowser.openProject(project);
    // TO DO: remove this action after Atlas is launched
    await pageManager.atBrowser.closeAtlasBanner(project);
    await pageManager.fromNavigationMenu.goToLoginPage();
    const keycloakPage =
      await pageManager.atLoginPage.clickSignUpAndNavigateToKeycloak(context);
  });
}
