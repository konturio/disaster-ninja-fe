import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();

// Create a loop to loop over all the projects and create a test for everyone
for (const project of projects) {
  test(`As Guest, I can log in to ${project.title}, check that this profile is mine, and log out`, async ({
    pageManager,
  }) => {
    await pageManager.atBrowser.openProject(project);
    // TO DO: remove this action after Atlas is launched
    await pageManager.atBrowser.closeAtlasBanner(project);
    await pageManager.fromNavigationMenu.goToLoginPage();
    await pageManager.atLoginPage.typeLoginPasswordAndLogin(
      process.env.EMAIL!,
      process.env.PASSWORD!,
      50,
    );
    // TO DO: remove this action after Atlas is launched. Sometimes actions are too slow there, so 2 notification appears
    try {
      await pageManager.atBrowser.closeAtlasBanner(project);
    } catch {}
    await pageManager.atProfilePage.checkLogoutBtnProfileTitleAndEmail(
      process.env.EMAIL!,
    );
    await pageManager.atProfilePage.clickLogout();
    await pageManager.atProfilePage.checkLogoutBtnAndProfileAbsence();
    await pageManager.atLoginPage.checkLoginAndSignupPresence();
  });
}
