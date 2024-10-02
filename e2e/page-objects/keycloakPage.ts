import { expect } from '@playwright/test';
import { HelperBase } from './helperBase';
import type { Project } from './helperBase';
import type { Page, APIRequestContext } from '@playwright/test';

type DeleteUsersInfo = {
  adminToken: string;
  project: Project;
  apiContext: APIRequestContext;
  userId: string;
};

type GetUserArrayData = {
  project: Project;
  text: string;
  adminToken: string;
  apiContext: APIRequestContext;
  domain: string;
};

type GetTokenData = {
  project: Project;
  apiContext: APIRequestContext;
  adminName: string;
  adminPassword: string;
};

type RegistrationData = {
  fullName: string;
  email: string;
  password: string;
};

type VerifyEmailInfo = {
  project: Project;
  apiContext: APIRequestContext;
  email: string;
  username: string;
  adminToken: string;
  adminName: string;
  adminPassword: string;
};

type KeycloakUser = {
  id: string;
  origin: string;
  createdTimestamp: number;
  username: string;
  enabled: boolean;
  totp: boolean;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  email: string;
  disableableCredentialTypes: string[];
  requiredActions: string[];
  notBefore: number;
  access: {
    manageGroupMembership: boolean;
    view: boolean;
    mapRoles: boolean;
    impersonate: boolean;
    manage: boolean;
  };
};

export class KeycloakPage extends HelperBase {
  /**
   * This method fills in firstName, email and password, clicks Register and then checks that info about email being sent is shown to the person
   * @param page - playwright page to operate, should be keycloak page
   * @param param1 - object with fullName, email and password fields to use it as input data
   */

  async registerAndSeeVerificationEmailInfo(
    project: Project,
    page: Page,
    { fullName, email, password }: RegistrationData,
  ) {
    await page.locator('#firstName').fill(fullName);
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);
    await page.locator('#password-confirm').fill(password);
    if (project.env !== 'dev') await page.locator('#termsAccepted').check();
    await page.locator('[type = "submit"]').click({ force: true });
    await page.locator(':text("Email verification")').waitFor({ state: 'visible' });
    await expect(
      page.getByText('You need to verify your email address to activate your account.'),
    ).toBeInViewport({ ratio: 1 });
  }

  /**
   * This method gets admin token of Keycloak admin to use it later. Works for dev and test envs only!
   * @param object - object with tested Kontur project, playwright api context, Keycloak admin name and password
   * @returns access token in string format
   */

  async getAdminToken({ project, apiContext, adminName, adminPassword }: GetTokenData) {
    const url =
      project.env === 'test'
        ? project.authUrl.replace('test', 'master')
        : project.authUrl.replace('dev/', 'master/');

    const response = await apiContext.post(url, {
      form: {
        username: adminName,
        grant_type: 'password',
        password: adminPassword,
        client_id: 'security-admin-console',
        scope: 'openid',
      },
    });

    expect(response.status()).toEqual(200);
    const responseBody = await response.json();
    return responseBody.access_token;
  }

  /**
   * This method gets array of users by a specific identifier to search for
   * @param object object with tested Kontur project, playwright api context, Keycloak admin token and text to use to search with it
   * @returns array of objects with users
   */

  async getUsers({ domain, project, text, adminToken, apiContext }: GetUserArrayData) {
    const endpointToSearchForUser = `${domain}/admin/realms/${project.env === 'test' ? 'test' : 'dev'}/users?search=${text}`;

    const userResponse = await apiContext.get(endpointToSearchForUser, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    expect(userResponse.status()).toEqual(200);

    const userObjArray = await userResponse.json();
    return userObjArray;
  }

  /**
   * This method verifies email of created user using API requests
   * @param object object with Kontur project, playwright api context, email, admin token, Keycloak admin name and password, part of email before '@'
   */

  async verifyEmail({
    project,
    apiContext,
    email,
    adminToken,
    adminName,
    adminPassword,
    username,
  }: VerifyEmailInfo) {
    // Get registered user info
    const domain = this.getDomainFromUrl(project.authUrl);

    const userObjArray = await this.getUsers({
      domain,
      project,
      apiContext,
      adminToken,
      text: username,
    });

    const [userObj] = userObjArray.filter((user: KeycloakUser) => user.email === email);

    // Assertion is here not to test, but to fail
    // and stop test if user object is
    // for some reason undefined
    expect(userObj).toBeDefined();

    // To make debug easier
    // console.log(userObj);

    const id = userObj.id;

    // Update the admin token
    const newAdminToken = await this.getAdminToken({
      project,
      apiContext,
      adminName,
      adminPassword,
    });

    // Update registered user
    userObj.emailVerified = true;
    userObj.requiredActions = [];
    const updateUserUrl = `${domain}/admin/realms/${project.env === 'test' ? 'test' : 'dev'}/users/${id}`;
    const updatedUserResponse = await apiContext.put(updateUserUrl, {
      data: userObj,
      headers: {
        Authorization: `Bearer ${newAdminToken}`,
      },
    });
    expect(updatedUserResponse.status()).toEqual(204);
    return id;
  }

  /**
   * This method deletes user by id.
   * @param deleteObj - object with Kontur project, playwright api context, admin token, user id
   */

  async deleteUserById({ adminToken, project, apiContext, userId }: DeleteUsersInfo) {
    // Get registered user info
    const domain = this.getDomainFromUrl(project.authUrl);

    const deleteUserUrl = `${domain}/admin/realms/${project.env === 'test' ? 'test' : 'dev'}/users/${userId}`;

    const userDeletionResponse = await apiContext.delete(deleteUserUrl, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    expect(userDeletionResponse.status()).toEqual(204);
  }
}
