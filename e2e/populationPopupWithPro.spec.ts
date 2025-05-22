import { test } from './fixtures/test-options.ts';
import { getProjects, stepCounter } from './page-objects/helperBase.ts';
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
test.beforeEach(() => {
  stepCounter.counter = 0;
});

// Oam has no layers, smart-city has no population density layer
const excludedNames = ['oam', 'smart-city'];

projects = projects.filter((arg: Project) => !excludedNames.includes(arg.name));

test.describe.configure({ retries: process.env.CI ? 3 : 2 });

const testPopulation = async function (inputData: InputData) {
  await inputData.pageManager.atMap.goToSpecificAreaByUrl(
    inputData.zoom,
    inputData.latitude,
    inputData.longitude,
    inputData.project,
  );
  await inputData.pageManager.atMap.clickPlaceOnMapView(
    inputData.x,
    inputData.y,
    inputData.project,
  );
  await inputData.pageManager.atMap.checkPopulationPopupData();
  await inputData.pageManager.atMap.closePopulationPopup();
};

projects.forEach((project: Project) => {
  test.describe(`As PRO User, I can see popup about population at ${project.title} after clicking at hexagon`, () => {
    test.beforeEach(async ({ pageManager }) => {
      await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
    });
    test('Normal population in USA', async ({ pageManager, page }) => {
      test.fixme(
        true,
        'Fix https://kontur.fibery.io/Tasks/Task/Population-density-layer-is-calculated-more-then-1-2-min-for-high-zooms-21601 to activate this test',
      );
      await testPopulation({
        page: page,
        pageManager: pageManager,
        project: project,
        zoom: 13.548,
        latitude: 40.2283,
        longitude: -74.0298,
        x: 240,
        y: 200,
      });
    });
    test('Huge population in Mumbai', async ({ pageManager, page }) => {
      test.fixme(
        true,
        'Fix https://kontur.fibery.io/Tasks/Task/Population-density-layer-is-calculated-more-then-1-2-min-for-high-zooms-21601 to activate this test',
      );
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
        test.fixme(
          true,
          'Fix https://kontur.fibery.io/Tasks/Task/Population-density-layer-is-calculated-more-then-1-2-min-for-high-zooms-21601 to activate this test',
        );
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
      test.fixme(
        true,
        'Fix https://kontur.fibery.io/Tasks/Task/Population-density-layer-is-calculated-more-then-1-2-min-for-high-zooms-21601 to activate this test',
      );
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
