import { LoginPage } from './loginPage';
import { ProfilePage } from './profilePage';
import { HelperBase } from './helperBase';
import { NavigationMenu } from './navigationMenu';
import { MapCanvas } from './mapPage';
import { ToolBar } from './toolBar';
import { KeycloakPage } from './keycloakPage';
import { PrivacyPage } from './privacyPage';
import type { Page } from '@playwright/test';

export class PageManager {
  private readonly page: Page;
  private readonly loginPage: LoginPage;
  private readonly profilePage: ProfilePage;
  private readonly helperBase: HelperBase;
  private readonly navigationMenu: NavigationMenu;
  private readonly mapCanvas: MapCanvas;
  private readonly toolBar: ToolBar;
  private readonly keycloakPage: KeycloakPage;
  private readonly privacyPage: PrivacyPage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.profilePage = new ProfilePage(this.page);
    this.helperBase = new HelperBase(this.page);
    this.navigationMenu = new NavigationMenu(this.page);
    this.mapCanvas = new MapCanvas(this.page);
    this.toolBar = new ToolBar(this.page);
    this.keycloakPage = new KeycloakPage(this.page);
    this.privacyPage = new PrivacyPage(this.page);
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

  get fromNavigationMenu() {
    return this.navigationMenu;
  }

  get atMap() {
    return this.mapCanvas;
  }

  get atToolBar() {
    return this.toolBar;
  }

  get atKeycloakPage() {
    return this.keycloakPage;
  }

  get atPrivacyPage() {
    return this.privacyPage;
  }
}
