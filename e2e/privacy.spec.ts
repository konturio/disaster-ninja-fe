import { getProjects } from './page-objects/helperBase.ts';
import { test } from './fixtures/test-options.ts';

const projects = getProjects();

for (const project of projects) {
  test(`As Guest, I can go to ${project.title}, open Privacy tab and analyze this page, verify cookies page`, async ({
    pageManager,
    context,
  }) => {
    await pageManager.atBrowser.openProject(project);
    await pageManager.atNavigationMenu.clickButtonToOpenPage('Privacy');
    await pageManager.atBrowser.waitForUrlToMatchPattern(/privacy/);
    pageManager.atBrowser.checkCampaignIsAutotest();
    await pageManager.atPrivacyPage.checkTitles(
      [
        'Privacy Policy for EU/UK Residents',
        'General Provisions',
        'Personal data collecting, storing, scope, and purpose',
        'The Controller’s and User’s rights and obligations',
        'The User’s rights on the grounds of GDPR',
        'Privacy Policy changes',
      ],
      'Cookie files policy and operational data',
    );

    // Specify links to check at links-privacy.json file
    await pageManager.atPrivacyPage.checkLinks(context);
    pageManager.atBrowser.checkCampaignIsAutotest();
    await pageManager.atPrivacyPage.openAndVerifyCookiesPage();
  });
}
