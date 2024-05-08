import { test as basis } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

export type TestOptions = {
  pageManager: PageManager;
};

export const test = basis.extend<TestOptions>({
  pageManager: async ({ page }, use) => {
    const pm = new PageManager(page);
    await use(pm);
  },
});
