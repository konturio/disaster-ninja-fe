import { test as setup } from '@playwright/test';
import { getProjects } from './page-objects/helperBase.ts';
import { PageManager } from './page-objects/pageManager.ts';

setup('Authentication with PRO', async ({ context }) => {
  const authFile = 'e2e/.auth/user-pro.json';
  const authProjects = getProjects();

  // For dev and test environment storage is shared.
  // So login to, for example, test atlas is shared to test oam and etc.
  // So for test and dev login to any project is enough,
  // With no need to login to all of them

  if (process.env.ENVIRONMENT === 'test' || process.env.ENVIRONMENT === 'dev')
    authProjects.splice(1);

  for (const project of authProjects) {
    const newPage = await context.newPage();
    const pm = new PageManager(newPage);
    await pm.auth(project, process.env.EMAIL_PRO!, process.env.PASSWORD_PRO!, newPage);
  }

  // Only after all logins are successful during browser session,
  // saving browser storage to auth file
  await context.storageState({ path: authFile });
});
