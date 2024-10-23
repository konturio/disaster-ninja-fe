import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';

const projects = getProjects();

// Create a loop to loop over all the projects and create a test for everyone
for (const project of projects) {
  test(`As Guest, I can log in to ${project.title}, check that this profile is mine, and log out`, async ({
    pageManager,
    context,
  }) => {
    await pageManager.atBrowser.openProject(project);
    await pageManager.atNavigationMenu.clickButtonToOpenPage('Login');
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
        buttonName: 'Request trial',
        expectedUrlPart: 'demo-call',
      });
      await pageManager.atPricingPage.clickBtnAndAssertUrl({
        context,
        buttonName: 'Book a demo',
        expectedUrlPart: 'atlas-demo',
      });
      await pageManager.atNavigationMenu.clickButtonToOpenPage('Profile');
    }
    await pageManager.atProfilePage.checkLogoutBtnProfileTitleAndEmail(
      process.env.EMAIL!,
    );
    await pageManager.atProfilePage.clickLogout();
    pageManager.atBrowser.checkCampaignIsAutotest();
    await pageManager.atProfilePage.checkLogoutBtnAndProfileAbsence();
    await pageManager.atLoginPage.checkLoginAndSignupPresence();
  });
}
