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
    page,
    pageManager,
    context,
    playwright,
  }) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;

    const username = `${firstName}${lastName}${faker.number.int(1000)}`.toLowerCase();
    const email = `${username}@testdeleteme.com`;

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

    const userId = await pageManager.atKeycloakPage.verifyEmailUsingAPIAndReturnUserId({
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

    // Without logout app will crash after current user deletion
    await pageManager.atProfilePage.clickLogout();

    // Get new token and wait for 1 sec in parallel
    const [newAdminToken] = await Promise.all([
      pageManager.atKeycloakPage.getAdminToken({
        project,
        apiContext,
        adminName: process.env.ADMIN_KEYCLOAK!,
        adminPassword: process.env.ADMIN_KEYCLOAK_PASSWORD!,
      }),
      page.waitForTimeout(1000),
    ]);

    // It won't delete test user in case of failed test,
    // But it is the safest way to clean up
    await pageManager.atKeycloakPage.deleteUserById({
      adminToken: newAdminToken,
      project,
      apiContext,
      userId,
    });
  });
}
