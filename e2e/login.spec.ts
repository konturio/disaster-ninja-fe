import { expect } from '@playwright/test';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();

// Create a loop to loop over all the projects and create a test for everyone
for (const project of projects) {
  test(`As Guest, I can log in to ${project.title}, check that this profile is mine, and log out`, async ({
    page,
    pageManager,
  }) => {
    await pageManager.atBrowser.openProject(project);
    await pageManager.fromNavigationMenu.goToLoginPage();
    await pageManager.atLoginPage.typeLoginPasswordAndLogin(
      process.env.EMAIL!,
      process.env.PASSWORD!,
    );
    // TO DO: activate this check once 19103 issue is done
    // expect(page.url()).toContain('autotests');
    await pageManager.atProfilePage.checkLogoutBtnProfileTitleAndEmail(
      process.env.EMAIL!,
    );
    await pageManager.atProfilePage.clickLogout();
    expect(page.url()).toContain('autotests');
    await pageManager.atProfilePage.checkLogoutBtnAndProfileAbsence();
    await pageManager.atLoginPage.checkLoginAndSignupPresence();
  });
}
