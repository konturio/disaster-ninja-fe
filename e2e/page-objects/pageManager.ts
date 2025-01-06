import { LoginPage } from './loginPage';
import { ProfilePage } from './profilePage';
import { HelperBase } from './helperBase';
import { NavigationMenu } from './navigationMenu';
import { MapCanvas } from './mapPage';
import { ToolBar } from './toolBar';
import { KeycloakPage } from './keycloakPage';
import { PrivacyPage } from './privacyPage';
import { PricingPage } from './pricingPage';
import { MCDAPopup } from './mcdaPopup';
import { LegendPanel } from './legendPanel';
import type { Project } from './helperBase';
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
  private readonly pricingPage: PricingPage;
  private readonly mcdaPopup: MCDAPopup;
  private readonly legendPanel: LegendPanel;

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
    this.pricingPage = new PricingPage(this.page);
    this.mcdaPopup = new MCDAPopup(this.page);
    this.legendPanel = new LegendPanel(this.page);
  }

  get atLoginPage() {
    return this.loginPage;
  }

  get atMCDAPopup() {
    return this.mcdaPopup;
  }

  get atProfilePage() {
    return this.profilePage;
  }

  get atBrowser() {
    return this.helperBase;
  }

  get atNavigationMenu() {
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

  get atLegendPanel() {
    return this.legendPanel;
  }

  get atPricingPage() {
    return this.pricingPage;
  }

  /**
   * This page manager method is used to authenticate at the application
   * @param project - object with details about project to open like name, url, title, etc.
   * @param email - email to use during login
   * @param password - password to use during login
   * @param operablePage - playwright page
   */

  async auth(project: Project, email: string, password: string, operablePage: Page) {
    await this.atBrowser.openProject(project, { operablePage });
    await this.atNavigationMenu.clickButtonToOpenPage('Login', operablePage);
    await this.atLoginPage.typeLoginPasswordAndLogin(email, password, {
      shouldSuccess: true,
      project,
      operablePage,
    });
  }
}
