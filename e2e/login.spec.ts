import { test } from '@playwright/test';
import { getProjects } from './page-objects/helperBase.ts';
import { PageManager } from './page-objects/pageManager.ts';

const projects = getProjects();

// Create a loop to loop over all the projects and create a test for everyone
for (const project of projects) {
  test(`As User, I can login to ${project.title}, check that this profile is mine, and log out`, async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await pm.atBrowser.openProject(project);
    await page.getByText('Login').click();
    await pm.atLoginPage.typeLoginPasswordAndLogin(
      process.env.EMAIL!,
      process.env.PASSWORD!,
      50,
    );
    await pm.atProfilePage.checkLogoutBtnProfileTitleAndEmail(process.env.EMAIL!);
    await pm.atProfilePage.clickLogout();
    await pm.atProfilePage.checkLogoutBtnAndProfileAbsence();
    await pm.atLoginPage.checkLoginAndSignupPresence();
  });
}
