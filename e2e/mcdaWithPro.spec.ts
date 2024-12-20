import { faker } from '@faker-js/faker';
import { getProjects } from './page-objects/helperBase.ts';
import { test } from './fixtures/test-options.ts';
import type { Project } from './page-objects/helperBase.ts';

const projects: Project[] = getProjects();

const projectsWithMCDA = projects.filter((project) => project.name === 'atlas');
const areaToSearch = 'Homewood, USA';
const desiredLocation = 'Homewood, Jefferson County, Alabama, United States';
const queryToSearchRegExp = /&query=Homewood%2C\+USA/;
const layers = [
  '　🛒 Food shops to population (n/ppl)',
  '🌡️↕️ Air temperature monthly amplitude (°C)',
];
const inputs = ['food shops to population', 'air'];
const expectedSuggestions = [
  '　🛒 Food shops to population (n/ppl)',
  '　🛬 Airports to Area (n/km²)　🛬 Airports to buildings (n/n)　🛬 Airports to populated area (n/km²)　🛬 Airports to population (n/ppl)　🛬 Airports to Total road length (n/km)　🌡️ Air temperature average (°C)🌡️🔥 Air temperature maximum (°C)🌡️❄️ Air temperature minimum (°C)🌡️↕️ Air temperature monthly amplitude (°C)',
];

const expectedLegendPanelTextsAfterMCDACreation = [
  'Legend',
  'Reference area',
  'Hexagons are colored based on analysis layer settings. Click a hexagon to see its values',
  'Transformation: no transformation',
  'Reverse to Bad → Good',
  'Transformation: log₁₀(x - xmin + ε)',
  '°C',
  'good',
  'bad',
  'Food shops to population (n/ppl)',
  'Air temperature monthly amplitude (°C)',
];

for (const project of projectsWithMCDA) {
  test.describe(`As PRO user, I can go to map at ${project.title}, find '${areaToSearch}' location and work with MCDA`, () => {
    test(`Search for area, create MCDA`, async ({ pageManager }) => {
      const analysisName = faker.string.alphanumeric({ length: { min: 1, max: 30 } });
      await pageManager.atBrowser.openProject(project, { skipCookieBanner: true });
      await pageManager.atNavigationMenu.clickButtonToOpenPage('Map');
      await pageManager.atMap.searchForLocation(
        areaToSearch,
        desiredLocation,
        queryToSearchRegExp,
      );
      await pageManager.atMap.assertLocationInBreadcrumbs(
        desiredLocation.split(', ').reverse(),
      );
      await pageManager.atToolBar.getButtonByText('Create MCDA').click();
      await pageManager.atMCDAPopup.assertMCDAPopupIsOK();
      await pageManager.atMCDAPopup.createMCDA({
        analysisName,
        layers,
        inputs,
        expectedSuggestions,
      });
      await pageManager.atLegendPanel.assertLegendPanelTexts([
        ...expectedLegendPanelTextsAfterMCDACreation,
        analysisName,
      ]);
    });
  });
}

// TO DO: Add test for creating MCDA with no layers
// TO DO: add screenshots comparison after MCDA creation. Check that layers are displayed in Legend panel. Check that after clicking Reverse to Good -> Bad, the layers are reversed (compare screenshots). Edit layer in mcda with simple edit like weight, normalization, etc. Check that after editing the layer, it is displayed in the legend panel and the map. Edit MCDA itself in the popup. Check that after editing the MCDA, map has new MCDA applied
