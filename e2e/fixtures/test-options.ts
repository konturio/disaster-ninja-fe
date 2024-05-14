import { test as basis, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import type { Project } from '../page-objects/helperBase.ts';

export type TestOptions = {
  pageManager: PageManager;
  project: Project;
  loginWithNoRightsUser: string;
};

export const test = basis.extend<TestOptions>({
  project: [
    {
      env: 'prod',
      name: '',
      url: '',
      title: '',
      hasCookieBanner: false,
      hasAtlasBanner: false,
      authUrl: '',
    },
    { option: true },
  ],
  pageManager: async ({ page }, use) => {
    const pm = new PageManager(page);
    await use(pm);
  },
});
