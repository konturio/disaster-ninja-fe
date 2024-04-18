import { Page } from '@playwright/test';
import { LoginPage } from './loginPage';
import { ProfilePage } from './profilePage';

export class PageManager {
  private readonly page: Page;
  private readonly loginPage: LoginPage;
  private readonly profilePage: ProfilePage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.profilePage = new ProfilePage(this.page);
  }

  get onLoginPage() {
    return this.loginPage;
  }

  get onProfilePage() {
    return this.profilePage;
  }
}
