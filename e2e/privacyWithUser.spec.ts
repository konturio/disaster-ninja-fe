import { expect } from '@playwright/test';
import { getProjects } from './page-objects/helperBase.ts';
import { test } from './fixtures/test-options.ts';

const projects = getProjects();

for (const project of projects) {
  test(`As User with no rights, I can go to ${project.title}, open Privacy tab, analyze this page, verify cookies page`, async ({
    pageManager,
    page,
    context,
  }) => {
    await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    await pageManager.fromNavigationMenu.goToPrivacyPage();
    await pageManager.atBrowser.waitForUrlToMatchPattern(/privacy/);
    // TO DO: activate this check once 19103 issue is done
    // expect(page.url()).toContain('autotests');
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
    // TO DO: activate this check once 19103 issue is done
    // expect(page.url()).toContain('autotests');
    await pageManager.atPrivacyPage.openAndVerifyCookiesPage();
  });
}
