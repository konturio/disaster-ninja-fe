import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';
import type { APIRequestContext } from '@playwright/test';

const projects = getProjects().filter((project) => project.env !== 'prod');

// Registration tests should run one by one not to kill application
test.describe.configure({ mode: 'serial' });

// Create a loop to loop over all the projects and create a test for everyone
for (const project of projects) {
  test(`As Guest, I can register at ${project.title}, verify email, login and check that this profile is mine`, async ({
    pageManager,
    context,
    playwright,
  }) => {
    const fullName = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const username =
      `${fullName.replace(' ', '')}${faker.number.int(1000)}`.toLowerCase();
    const email = username + '@testdeleteme.com';
    const password = faker.internet.password({ length: 12 });

    await pageManager.atBrowser.openProject(project);
    await pageManager.fromNavigationMenu.goToLoginPage();

    const keycloakPage =
      await pageManager.atLoginPage.clickSignUpAndNavigateToKeycloak(context);

    // Create new context for API separate from browser context
    const apiContext: APIRequestContext = await playwright.request.newContext();

    // Register and get admin token in parallel
    const [_, adminToken] = await Promise.all([
      pageManager.atKeycloakPage.registerAndSeeVerificationEmailInfo(keycloakPage, {
        fullName,
        email,
        password,
      }),
      pageManager.atKeycloakPage.getAdminToken({
        project,
        apiContext,
        adminName: process.env.ADMIN_KEYCLOAK!,
        adminPassword: process.env.ADMIN_KEYCLOAK_PASSWORD!,
      }),
    ]);

    await pageManager.atKeycloakPage.verifyEmailUsingAPIAndReturnUserId({
      project,
      apiContext,
      email,
      adminToken,
      adminName: process.env.ADMIN_KEYCLOAK!,
      adminPassword: process.env.ADMIN_KEYCLOAK_PASSWORD!,
      username,
    });

    await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    await pageManager.fromNavigationMenu.goToLoginPage();
    await pageManager.atLoginPage.typeLoginPasswordAndLogin(email, password, 1);

    await pageManager.atProfilePage.checkLogoutBtnProfileTitleAndEmail(email);

    const fullNameAfterRegistration = await pageManager.atProfilePage.getFullNameValue();
    expect(fullNameAfterRegistration).toEqual(fullName);
  });
}
