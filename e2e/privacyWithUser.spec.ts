import { getProjects } from './page-objects/helperBase.ts';
import { test } from './fixtures/test-options.ts';

const projects = getProjects();

for (const project of projects) {
  test(`As User with no rights, I can go to ${project.title}, open Privacy tab and analyze this page`, async ({
    pageManager,
    page,
    context,
  }) => {
    await pageManager.atBrowser.openProject(project);
    await pageManager.fromNavigationMenu.goToPrivacyPage();
    await pageManager.atBrowser.waitForUrlToMatchPattern(/privacy/, page);
    await pageManager.atPrivacyPage.checkTitles(
      {
        main: 'Privacy Policy for EU/UK Residents',
        provisions: 'General Provisions',
        personalData: 'Personal data collecting, storing, scope, and purpose',
        rightsAndObligations: 'The Controller’s and User’s rights and obligations',
        rightsGDPR: 'The User’s rights on the grounds of GDPR',
        privacyPolicy: 'Privacy Policy changes',
      },
      'Cookie files policy and operational data',
    );
    await pageManager.atPrivacyPage.checkLinks(context);
  });
}
