import { Page, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

type Project = {
  env: 'prod' | 'dev' | 'test';
  name: string;
  url: string;
  title: string;
  hasCookieBanner: boolean;
};

export class HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openProject(project: Project) {
    await this.page.goto(project.url);

    // Expect a title "to contain" a project name.
    await expect(this.page).toHaveTitle(`${project.title}`);

    // Currently, OAM project doesn't have cookies popups
    if (project.hasCookieBanner)
      await this.page.getByText('Accept optional cookies').click();
  }
}

export function getProjects() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const data = fs.readFileSync(path.join(__dirname, 'projects-config.json')).toString();

  const appName = process.env.APP_NAME ?? 'all';
  const environment = process.env.ENVIRONMENT ?? 'prod';
  const projects: Project[] = JSON.parse(data)
    .filter((project: Project) => project.env === environment)
    .filter((project: Project) => appName === 'all' || project.name === appName);

  return projects;
}
