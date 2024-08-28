import sinon from 'sinon';
import { configRepo } from '~core/config';
import { PagesDocumentRenderer } from './index';

// Create a stub for configRepo.get()
const configRepoStub = sinon.stub(configRepo, 'get');

// Configure the stub to return the mocked config values
configRepoStub.returns({
  baseUrl: '/active/',
  // @ts-ignore
  initialUrl: {
    layers: ['kontur_lines', 'population_density'],
  },
  apiGateway: 'https://disaster.ninja/active/api',
  reportsApiGateway: '/active/reports',
  bivariateTilesRelativeUrl: 'api/tiles/bivariate/v1/',
  bivariateTilesIndicatorsClass: 'all',
  refreshIntervalSec: 300,
  sentryDsn: '',
  keycloakUrl: 'https://keycloak01.kontur.io',
  keycloakRealm: 'kontur',
  keycloakClientId: 'kontur_platform',
  // intercomDefaultName: null,
  intercomAppId: 'e59cl64z',
  intercomSelector: '#kontur_header_chat_btn',
  defaultFeed: 'kontur-public',
  osmEditors: [
    {
      id: 'josm',
      title: 'JOSM',
      url: 'https://www.openstreetmap.org/edit?editor=remote#map=',
    },
    {
      id: 'id',
      title: 'iD',
      url: 'https://www.openstreetmap.org/edit?editor=id&node=2188188227#map=',
    },
    {
      id: 'rapid',
      title: 'RapiD',
      url: 'https://mapwith.ai/rapid#map=',
    },
  ],
  autofocusZoom: 13,
  mapBlankSpaceId: 'map-view',
  mapBaseStyle:
    'https://prod-basemap-tileserver.k8s-01.konturlabs.com/layers/tiles/basemap/style_ninja_en.json',
  featuresByDefault: {
    events_list: true,
    current_event: true,
    reports: true,
    current_episode: true,
    episode_list: true,
    osm_edit_link: true,
    side_bar: true,
    analytics_panel: true,
    map_layers_panel: true,
    focused_geometry_layer: true,
    map_ruler: true,
    boundary_selector: true,
    draw_tools: true,
    geometry_uploader: true,
    legend_panel: true,
    // @ts-ignore
    url_store: true,
    feature_settings: true,
    layers_in_area: true,
    toasts: true,
    interactive_map: true,
    feed_selector: true,
    header: true,
    intercom: true,
    geocoder: true,
    communities: true,
    tooltip: true,
  },
  id: '9043acf9-2cf3-48ac-9656-a5d7c4b7593d',
  name: 'Kontur Atlas',
  description: 'Kontur SAAS application',
  ownedByUser: false,
  extent: [-135, 0, 63, 62],
  sidebarIconUrl:
    '/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/favicon.svg',
  faviconUrl: '/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/favicon.svg',
  faviconPack: {
    'favicon.svg':
      '/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/favicon.svg',
    'favicon.ico':
      '/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/favicon.ico',
    'apple-touch-icon.png':
      '/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/apple-touch-icon.png',
    'icon-192x192.png':
      '/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/icon-192x192.png',
    'icon-512x512.png':
      '/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/icon-512x512.png',
  },
  // @ts-ignore
  features: {
    side_bar: true,
    intercom: true,
    tooltip: true,
    subscription: {
      billingMethodsDetails: [
        {
          id: 'paypal',
          clientId:
            'AW4yVOLCGT89y4ffoXvFOvutdDbcZA8fjHDmR-qidk72xgmjatdlENL9BKTS--xUM-miagNfo5sMF-IB',
        },
      ],
      billingCyclesDetails: [
        {
          id: 'month',
          name: 'Monthly',
          note: null,
        },
        {
          id: 'year',
          name: 'Annually',
          note: 'Save 5%',
        },
      ],
      plans: [
        {
          id: 'kontur_atlas_edu',
          name: 'Educational',
          style: 'basic',
          description:
            'For students, hobbyists, and anyone testing the entry-level option before upgrading',
          highlights: [
            'Multi-criteria decision analyses',
            'AI analytics',
            'Favorite area of interest',
            'Download analyses',
          ],
          billingCycles: [
            {
              id: 'month',
              initialPricePerMonth: null,
              pricePerMonth: 100,
              pricePerYear: null,
              billingMethods: [
                {
                  id: 'paypal',
                  billingPlanId: 'P-000000000000000000000000',
                },
              ],
            },
            {
              id: 'year',
              initialPricePerMonth: 100,
              pricePerMonth: 95,
              pricePerYear: 1140,
              billingMethods: [
                {
                  id: 'paypal',
                  billingPlanId: 'P-000000000000000000000000',
                },
              ],
            },
          ],
        },
        {
          id: 'kontur_atlas_pro',
          name: 'Professional',
          style: 'premium',
          description:
            'For GIS data analysts and managers who work with GIS on a daily basis',
          highlights: [
            'Multi-criteria decision analyses',
            'AI analytics',
            'Favorite area of interest',
            'Download analyses',
            'Customer support',
            'Custom requests',
            'Upload custom indicators for analytics',
          ],
          billingCycles: [
            {
              id: 'month',
              initialPricePerMonth: null,
              pricePerMonth: 1000,
              pricePerYear: null,
              billingMethods: [
                {
                  id: 'paypal',
                  billingPlanId: 'P-000000000000000000000000',
                },
              ],
            },
            {
              id: 'year',
              initialPricePerMonth: 1000,
              pricePerMonth: 950,
              pricePerYear: 11400,
              billingMethods: [
                {
                  id: 'paypal',
                  billingPlanId: 'P-000000000000000000000000',
                },
              ],
            },
          ],
        },
      ],
    },
    app_login: true,
    toasts: true,
    use_3rdparty_analytics: true,
    about_page: {
      tabName: 'About',
      assetUrl: '/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/about.md',
      subTabs: [
        {
          tabName: 'Terms',
          assetUrl:
            '/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/terms.md',
        },
        {
          tabName: 'Privacy',
          assetUrl:
            '/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/privacy.md',
        },
      ],
    },
  },
  public: true,
  initialUser: {
    username: '',
    email: '',
    fullName: '',
    language: 'en',
    useMetricUnits: true,
    subscribedToKonturUpdates: false,
    bio: '',
    osmEditor: 'josm',
    defaultFeed: 'kontur-public',
    theme: 'kontur',
  },
  defaultLayers: [
    {
      id: 'kontur_lines',
      source: {
        type: 'maplibre-style-url',
        urls: [
          'https://prod-basemap-tileserver.k8s-01.konturlabs.com/layers/tiles/basemap/style_ninja_en.json',
        ],
      },
      ownedByUser: false,
    },
    {
      id: 'population_density',
      // @ts-ignore
      source: {
        urls: [
          'https://disaster.ninja/active/api/tiles/bivariate/v1/{z}/{x}/{y}.mvt?indicatorsClass=general',
        ],
      },
      // @ts-ignore
      legend: {
        type: 'simple',
        steps: [
          {
            stepName: '0 - 1.27',
            stepShape: 'square',
            style: {
              color: '#F0F0D6',
              'fill-color': '#F0F0D6',
              'fill-opacity': 0.8,
            },
          },
          {
            stepName: '1.27 - 2.45',
            stepShape: 'square',
            style: {
              color: '#ECECC4',
              'fill-color': '#ECECC4',
              'fill-opacity': 0.8,
            },
          },
          {
            stepName: '2.45 - 5.75',
            stepShape: 'square',
            style: {
              color: '#EAEAB0',
              'fill-color': '#EAEAB0',
              'fill-opacity': 0.8,
            },
          },
          {
            stepName: '5.75 - 12.43',
            stepShape: 'square',
            style: {
              color: '#E8E89D',
              'fill-color': '#E8E89D',
              'fill-opacity': 0.8,
            },
          },
          {
            stepName: '12.43 - 28.47',
            stepShape: 'square',
            style: {
              color: '#E1D689',
              'fill-color': '#E1D689',
              'fill-opacity': 0.8,
            },
          },
          {
            stepName: '28.47 - 66.03',
            stepShape: 'square',
            style: {
              color: '#DAC075',
              'fill-color': '#DAC075',
              'fill-opacity': 0.8,
            },
          },
          {
            stepName: '66.03 - 172.46',
            stepShape: 'square',
            style: {
              color: '#D1A562',
              'fill-color': '#D1A562',
              'fill-opacity': 0.8,
            },
          },
          {
            stepName: '172.46 - 535.67',
            stepShape: 'square',
            style: {
              color: '#C98A50',
              'fill-color': '#C98A50',
              'fill-opacity': 0.8,
            },
          },
          {
            stepName: '535.67 - 46200',
            stepShape: 'square',
            style: {
              color: '#BF6C3F',
              'fill-color': '#BF6C3F',
              'fill-opacity': 0.8,
            },
          },
        ],
      },
      ownedByUser: false,
    },
  ],
  activeLayers: ['kontur_lines', 'population_density'],
});

export default {
  PagesDocumentRenderer: (
    <PagesDocumentRenderer
      doc={[
        {
          type: 'md',
          data: `
#Kontur Atlas
Atlas is your GPS for big decisions. It's a tool that helps you use maps and data to figure out a wide range of things, from where to open a new store to exploring environmental sustainability.
`,
        },
        {
          type: 'css',
          data: `
h1 { background-color: #f2f2f2; }
p { background-color: #BF6C3F; }
`,
        },
      ]}
    />
  ),
  Plans: (
    <PagesDocumentRenderer
      doc={[
        {
          type: 'css',
          data: `
h1 { background-color: #f2f2f2; }
p { background-color: #BF6C3F; }
`,
        },
        {
          type: 'md',
          data: `
## Plans & Pricing

Monthly

Annually

Save 5%
<!-- col3_6 -->
#### Educational

$100

$

95

/mo\*

For students, hobbyists, and anyone testing the entry-level option before upgrading

Sign in to subscribe

*   Multi-criteria decision analyses
*   AI analytics
*   Favorite area of interest
*   Download analyses

\* Billed as 1140 once yearly
<!-- col3_6 -->
#### Professional

$1000

$

950

/mo\*

For GIS data analysts and managers who work with GIS on a daily basis

Sign in to subscribe

*   Multi-criteria decision analyses
*   AI analytics
*   Favorite area of interest
*   Download analyses
*   Customer support
*   Custom requests
*   Upload custom indicators for analytics

\* Billed as 11400 once yearly`,
        },
      ]}
    />
  ),
  WithCustomLink: (
    <PagesDocumentRenderer
      doc={[
        {
          type: 'md',
          data: `
[Link](https://example.com)

Controller using this email: [hello@kontur.io](mailto:hello@kontur.io) or contact address.

Controller using this email: <hello@kontur.io> or contact address.

hello@kontur.io

kancelaria@uodo.gov.pl

ng: <kancelaria@uodo.gov.pl>

http://www.youronlinechoices.com/

ng: <http://www.youronlinechoices.com/>
`,
        },
      ]}
    />
  ),
  WithSections: (
    <PagesDocumentRenderer
      doc={[
        {
          type: 'css',
          data: /*css*/ `

    h1 {
    font-size: 32px;
    }

    h2 {
    font-size: 28px;
    }

    h3 {
    font-size: 20px;
    }

    h4 {
    font-size: 16px;
    }

    blockquote {
    column-count: 2;
    column-gap: 1rem;
    margin: 0;
    }

    blockquote img {
    break-inside: column;
    }

    blockquote h3 {
    break-before: column;
    margin-top: 0;
    }

    blockquote * {
    padding-left: 0 !important;
    }

    section.col3_6 {
      display: contents;

      & div {
        margin-left: 33%;
        & p{ position: relative; }
      }

      img {
        left: -50%;
        position: absolute;
      }
    }

    `,
        },
        {
          type: 'md',
          data: `
![Kontur Atlas](about-atlas-1.png)

#Kontur Atlas
Atlas is your GPS for big decisions. It's a tool that helps you use maps and data to figure out a wide range of things, from where to open a new store to exploring environmental sustainability.


![Geospatial Data with Ease](about-atlas-2.png)

##Geospatial Data with Ease
###Browse & Choose Data
We've got tons of info like who lives where and how people get around. Find the data that'll answer your questions.

###Make Maps
With a few clicks, Atlas turns that data into maps and visuals so it's easy to understand.

###Analyze & Decide
Use these insights to make smart decisions, like picking the perfect spot for your next big project or making concussions based on spatial patterns.

###Jump in and start exploring
Your next big opportunity is waiting to be mapped out!

[Get access](https://www.kontur.io/atlas)

[Log in](action://profile "Lo-X")

##How to Use

<!-- col3_6 -->

![Area Selection](about-atlas-3.png)
###Area Selection
To choose an area for analysis, you can use the toolbar to select an administrative unit, draw a shape manually, or import a GeoJSON file.

<!-- col3_6 -->

![Analytics Panel](about-atlas-4.png)
### Analytics Panel
This panel displays essential data about your selected area.

#### AI Insights
Compares your area's data with global averages, alerting you to any significant discrepancies.

#### Personalized AI Insights
Reference Area: This allows you to set a known area as a reference point for comparisons and highlights differences.
Bio: Here, you can record details like who you're working for, your analysis purpose, and key topics, helping to personalize AI conclusions.


<!-- col3_6 -->

![Creating Custom Analysis](about-atlas-5.png)

### Creating Custom Analysis
To create your own analysis, select the "MCDA" button in the toolbar.

#### Choosing Relevant Layers
Start by picking data layers appropriate for your requirements — this could include anything from population density to environmental risk factors.

#### Browse the map
By default, the map displays red hexagons in high-value areas and green hexagons where values are minimal. Click on any hexagon to access detailed info for that particular sector.

#### Layer Customization
Enhance your analysis by fine-tuning the range and what is bad and good of each layer. This means you can focus specifically on aspects crucial to your study.


          `,
        },
      ]}
    />
  ),
};
