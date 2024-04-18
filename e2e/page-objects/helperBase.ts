import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export class HelperBase {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}

export function getProjects() {
  type Project = {
    env: 'prod' | 'dev' | 'test';
    name: string;
    url: string;
    title: string;
    hasCookieBanner: boolean;
  };

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
