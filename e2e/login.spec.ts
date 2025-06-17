import { test } from './fixtures/test-options.ts';
import { getProjects, stepCounter } from './page-objects/helperBase.ts';

// User is not supported for oam as oam has login at map.openaerialmap.org to third-party system.
const projects = getProjects().filter((project) => project.name !== 'oam');
test.beforeEach(() => {
  stepCounter.counter = 0;
});

const linkToSurveyProd = 'https://www.kontur.io/book-a-demo/';

// Create a loop to loop over all the projects and create a test for everyone
for (const project of projects) {
  test(`As User with no rights, I can log in to ${project.title}, check that this profile is mine, and log out`, async ({
    pageManager,
    context,
  }) => {
    await pageManager.atBrowser.openProject(project);
    await pageManager.atNavigationMenu.clickButtonToOpenPage('Login');
    await pageManager.atNavigationMenu.checkThereIsNoTextInNavigationMenu('Profile');
    await pageManager.atLoginPage.typeLoginPasswordAndLogin(
      process.env.EMAIL!,
      process.env.PASSWORD!,
      { shouldSuccess: true, project },
    );
    pageManager.atBrowser.checkCampaignIsAutotest();

    // Atlas redirects to pricing page after login
    if (project.name === 'atlas') {
      await pageManager.atPricingPage.checkPageAndTextsAvailability();
      await pageManager.atPricingPage.clickBtnAndAssertUrl({
        context,
        buttonName: 'Book a demo',
        expectedUrlPart: linkToSurveyProd,
      });
    } else {
      await pageManager.atMap.waitForTextBeingVisible('Toolbar');
    }
    await pageManager.atNavigationMenu.clickButtonToOpenPage('Profile');
    await pageManager.atProfilePage.checkLogoutBtnProfileTitleAndEmail(
      process.env.EMAIL!,
    );
    await pageManager.atProfilePage.clickLogout();
    pageManager.atBrowser.checkCampaignIsAutotest();
    await pageManager.atProfilePage.checkLogoutBtnAndProfileAbsence();
    await pageManager.atLoginPage.checkLoginAndSignupPresence();
  });
}

for (const project of projects) {
  test(`As User with pro rights, I can log in to ${project.title}, check that this profile is mine, and log out`, async ({
    pageManager,
  }) => {
    await pageManager.atBrowser.openProject(project);
    await pageManager.atNavigationMenu.checkThereIsNoTextInNavigationMenu('Profile');
    await pageManager.atNavigationMenu.clickButtonToOpenPage('Login');
    await pageManager.atLoginPage.typeLoginPasswordAndLogin(
      process.env.EMAIL_PRO!,
      process.env.PASSWORD_PRO!,
      { shouldSuccess: true, project },
    );
    pageManager.atBrowser.checkCampaignIsAutotest();
    await pageManager.atMap.waitForTextBeingVisible('Toolbar');
    await pageManager.atNavigationMenu.clickButtonToOpenPage('Profile');
    await pageManager.atProfilePage.checkLogoutBtnProfileTitleAndEmail(
      process.env.EMAIL_PRO!,
    );
    await pageManager.atProfilePage.clickLogout();
    pageManager.atBrowser.checkCampaignIsAutotest();
    await pageManager.atProfilePage.checkLogoutBtnAndProfileAbsence();
    await pageManager.atLoginPage.checkLoginAndSignupPresence();
  });
}
