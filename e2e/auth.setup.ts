import { test as setup } from '@playwright/test';
import { getProjects } from './page-objects/helperBase.ts';
import { PageManager } from './page-objects/pageManager.ts';

setup('Authentication', async ({ context }) => {
  const authFile = 'e2e/.auth/user.json';
  let authProjects = getProjects();

  // Caching authentication to avoid invoking login for each test.
  // Authentication is performed for each domain, but on dev, test, and local envs, the same domain is used.
  // Therefore, it's sufficient to authenticate one project from getProjects. (getProjects returns projects already filtered by env)

  if (process.env.ENVIRONMENT !== 'prod')
    // Any project is enough to setup auth at dev, test, local envs
    authProjects = [authProjects[0]];

  for (const project of authProjects) {
    const newPage = await context.newPage();
    const pm = new PageManager(newPage);
    await pm.auth(project, process.env.EMAIL!, process.env.PASSWORD!, newPage);
  }

  // Only after all logins are successful during browser session,
  // saving browser storage to auth file
  await context.storageState({ path: authFile });
});
