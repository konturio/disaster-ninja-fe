import { Page } from '@playwright/test';
import { LoginPage } from './loginPage';

export class PageManager {
  private readonly page: Page;
  private readonly loginPage: LoginPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
  }

  get onLoginPage() {
    return this.loginPage;
  }
}
