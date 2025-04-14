import { getProjects, stepCounter } from './page-objects/helperBase.ts';
import { test } from './fixtures/test-options.ts';

const projects = getProjects();
test.beforeEach(() => {
  stepCounter.counter = 0;
});

for (const project of projects) {
  test(`As PRO user, I can go to ${project.title}, open Privacy tab, analyze this page, verify cookies page`, async ({
    pageManager,
    context,
  }) => {
    await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
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
