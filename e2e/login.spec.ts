import { test, expect } from '@playwright/test';
import { getProjects } from './page-objects/helperBase.ts';
import { PageManager } from './page-objects/pageManager.ts';

const projects = getProjects();

// Create a loop to loop over all the projects and create a test for everyone
for (const project of projects) {
  test(`As User, I can login to ${project.title}, check that this profile is mine, and log out`, async ({
    page,
  }) => {
    const pm = new PageManager(page);
    await page.goto(project.url);

    // Expect a title "to contain" a Kontur Atlas.
    await expect(page).toHaveTitle(`${project.title}`);

    // Currently, OAM project doesn't have cookies popups
    if (project.hasCookieBanner) await page.getByText('Accept optional cookies').click();

    await page.getByText('Login').click();

    await pm.onLoginPage.typeLoginPasswordAndLogin(
      process.env.EMAIL!,
      process.env.PASSWORD!,
      50,
    );

    await pm.onProfilePage.checkProfilePageForLogoutBtnAndProfileTitleAndCheckEmailIfNeeded(
      process.env.EMAIL!,
    );
    await pm.onProfilePage.clickLogout();
    await pm.onProfilePage.checkProfilePageForLogoutBtnAndProfileTitleAndCheckEmailIfNeeded(
      undefined,
      false,
    );
    await pm.onLoginPage.checkLoginAndSignupPresence();
  });
}
