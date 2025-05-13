import { test as setup } from '@playwright/test';
import { getProjects } from './page-objects/helperBase.ts';
import { PageManager } from './page-objects/pageManager.ts';

setup('Authentication with PRO', async ({ context }) => {
  const authFile = 'e2e/.auth/user-pro.json';
  // Pro user is not supported for oam as oam has login at map.openaerialmap.org to third-party system.
  let authProjects = getProjects().filter((project) => project.name !== 'oam');

  // Caching authentication to avoid invoking login for each test.
  // Authentication is performed for each domain, but on dev, test, and local envs, the same domain is used.
  // Therefore, it's sufficient to authenticate one project from getProjects. (getProjects returns projects already filtered by env)

  if (process.env.ENVIRONMENT !== 'prod')
    // Any project is enough to setup auth at dev or test envs
    authProjects = [authProjects[0]];

  for (const project of authProjects) {
    const newPage = await context.newPage();
    const pm = new PageManager(newPage);
    await pm.auth(project, process.env.EMAIL_PRO!, process.env.PASSWORD_PRO!, newPage);
  }

  // Only after all logins are successful during browser session,
  // saving browser storage to auth file
  await context.storageState({ path: authFile });
});
