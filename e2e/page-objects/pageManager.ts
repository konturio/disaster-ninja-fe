import { Page } from '@playwright/test';
import { LoginPage } from './loginPage';
import { ProfilePage } from './profilePage';
import { HelperBase } from './helperBase';

export class PageManager {
  private readonly page: Page;
  private readonly loginPage: LoginPage;
  private readonly profilePage: ProfilePage;
  private readonly helperBase: HelperBase;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.profilePage = new ProfilePage(this.page);
    this.helperBase = new HelperBase(this.page);
  }

  get atLoginPage() {
    return this.loginPage;
  }

  get atProfilePage() {
    return this.profilePage;
  }

  get atBrowser() {
    return this.helperBase;
  }
}
