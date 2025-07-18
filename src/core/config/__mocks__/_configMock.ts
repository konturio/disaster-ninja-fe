// patch configRepo to return mock data
// import this file first to have effect on configRepo
import { configRepo } from '~core/config';

const _configDataMock = {
  baseUrl: '/active/',
  initialUrl:
    'https://disaster.ninja/active/map?map=4.920/37.682/112.588&event=1c1eb9ce-2fb0-4660-ae2e-ee93d15f8874&layers=kontur_lines%2CactiveContributors%2CeventShape%2ChotProjects_outlines%2Cpopulation_density%2Cfocused-geometry',
  initialUrlData: {
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
  matomoContainerUrl: 'https://matomo.kontur.io/js/container_R9VsLLth.js',
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
    oam_auth: {
      requiredRoutes: ['profile-external', 'upload-imagery'],
      authUrl: 'https://api.openaerialmap.org/oauth/google',
      sessionCookieName: 'oam-session',
      sessionCheckIntervalMs: 30000,
      redirectUriParamName: 'original_uri',
    },
    subscription: {
      billingMethodsDetails: [
        {
          id: 'paypal',
          clientId: 'xxxxxxx-xxxx-xxxxxxxxxxxxxx',
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
        {
          id: 'kontur_atlas_custom',
          name: 'Custom',
          style: 'custom',
          actions: [
            {
              name: 'contact_sales',
              params: {
                link: 'https://calendly.com/',
              },
            },
            {
              name: 'book_a_demo',
            },
          ],
        },
      ],
    },
    app_login: true,
    toasts: true,
    use_3rdparty_analytics: true,
    about_page: {
      tabId: 'about',
      assetUrl: 'about.md',
      subTabs: [
        {
          tabId: 'terms',
          assetUrl: 'terms.md',
        },
        {
          tabId: 'privacy',
          assetUrl: 'privacy.md',
        },
        {
          tabId: 'user-guide',
          assetUrl: 'user_guide.md',
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
};

configRepo.get = () => _configDataMock;

export { configRepo };
