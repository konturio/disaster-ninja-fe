import { test } from './fixtures/test-options.ts';
import { getProjects } from './page-objects/helperBase.ts';
import type { Page } from '@playwright/test';
import type { Project } from './page-objects/helperBase.ts';
import type { PageManager } from './page-objects/pageManager.ts';

type InputData = {
  page: Page;
  pageManager: PageManager;
  project: Project;
  zoom: number;
  latitude: number;
  longitude: number;
  x: number;
  y: number;
};

let projects = getProjects();
// Oam has no layers, smart-city has no population density layer
// Disaster-ninja temporally switched off untill 15482 issue is fixed
// Atlas has no 'layers' feature for guest (and layers theirself)
projects = projects.filter((arg) => {
  arg.name !== 'atlas' &&
    arg.name !== 'oam' &&
    arg.name !== 'disaster-ninja' &&
    arg.name !== 'smart-city';
});

const testPopulation = async function (inputData: InputData) {
  await inputData.pageManager.atMap.goToSpecificAreaByUrl(
    inputData.zoom,
    inputData.latitude,
    inputData.longitude,
    inputData.project,
  );
  await inputData.pageManager.atMap.clickPlaceOnMapView(inputData.x, inputData.y);
  await inputData.pageManager.atMap.checkPopulationPopupData();
  await inputData.pageManager.atMap.closePopulationPopup();
};

projects.forEach((project) => {
  test.describe(`As Guest, I can see popup about population at ${project.title} after clicking at hexagon`, () => {
    test.beforeEach(async ({ pageManager }) => {
      await pageManager.atBrowser.openProject(project);
    });
    test('Normal population in USA', async ({ pageManager, page }) => {
      await testPopulation({
        page: page,
        pageManager: pageManager,
        project: project,
        zoom: 13.548,
        latitude: 40.2283,
        longitude: -74.0298,
        x: 230,
        y: 200,
      });
    });
    test('Huge population in Mumbai', async ({ pageManager, page }) => {
      await testPopulation({
        page: page,
        pageManager: pageManager,
        project: project,
        zoom: 15.878,
        latitude: 19.0811,
        longitude: 72.8609,
        x: 230,
        y: 200,
      });
    });
    if (project.env !== 'dev')
      test('Tiny population in Antarctica', async ({ pageManager, page }) => {
        await testPopulation({
          page: page,
          pageManager: pageManager,
          project: project,
          zoom: 15.928,
          latitude: -69.4047,
          longitude: 76.3963,
          x: 110,
          y: 300,
        });
      });
    test('Near equator', async ({ pageManager, page }) => {
      await testPopulation({
        page: page,
        pageManager: pageManager,
        project: project,
        zoom: 15.307,
        latitude: -0.0191,
        longitude: 10.3915,
        x: 200,
        y: 200,
      });
    });
  });
});
