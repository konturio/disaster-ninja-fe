var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _config, _readSessionIntercomSetting, _setIntercomSetting;
import { u as useFixtureState, r as reactExports, R as React, g as getDefaultExportFromCjs, c as commonjsGlobal, a as reactDomExports, b as React$1, d as ReactDOM } from "./index-Bdfyswek.js";
function getDefaultSelectValue({ options, defaultValue }) {
  if (typeof defaultValue === "string") {
    return defaultValue;
  }
  const [firstOption] = options;
  if (typeof firstOption === "object") {
    return firstOption.options[0];
  }
  return firstOption;
}
function useCurrentSelectValue(selectName, args) {
  const [fixtureState] = useFixtureState("inputs");
  const inputFs = fixtureState && fixtureState[selectName];
  return inputFs && inputFs.type === "select" ? inputFs.currentValue : getDefaultSelectValue(args);
}
function useSelectFixtureState(selectName, args) {
  const [, setFixtureState] = useFixtureState("inputs");
  const defaultValue = getDefaultSelectValue(args);
  reactExports.useEffect(() => {
    setFixtureState((prevFs) => {
      const inputFs = prevFs && prevFs[selectName];
      if (inputFs && inputFs.type === "select" && inputFs.defaultValue === defaultValue)
        return prevFs;
      return {
        ...prevFs,
        [selectName]: {
          type: "select",
          options: args.options,
          defaultValue,
          currentValue: defaultValue
        }
      };
    });
  }, [JSON.stringify(args.options), defaultValue, selectName, setFixtureState]);
}
function useSetSelectValue(selectName) {
  const [, setFixtureState] = useFixtureState("inputs");
  return reactExports.useCallback((value) => {
    setFixtureState((prevFs) => {
      const inputFs = prevFs && prevFs[selectName];
      if (!inputFs || inputFs.type !== "select") {
        console.warn(`Invalid fixture state for select: ${selectName}`);
        return prevFs ?? {};
      }
      return {
        ...prevFs,
        [selectName]: {
          ...inputFs,
          currentValue: value
        }
      };
    });
  }, [selectName, setFixtureState]);
}
function useFixtureSelect(selectName, args) {
  if (!args || !args.options || !args.options.length)
    throw new Error("No options provided to useSelect");
  if (typeof args.options[0] === "object") {
    if (!args.options[0].options.length)
      throw new Error("No options provided to useSelect");
  }
  useSelectFixtureState(selectName, args);
  const currentValue = useCurrentSelectValue(selectName, args);
  const setValue = useSetSelectValue(selectName);
  return [currentValue, setValue];
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f$2 = reactExports, k$1 = Symbol.for("react.element"), l$1 = Symbol.for("react.fragment"), m$a = Object.prototype.hasOwnProperty, n$2 = f$2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q$1(c2, a2, g2) {
  var b2, d2 = {}, e = null, h2 = null;
  void 0 !== g2 && (e = "" + g2);
  void 0 !== a2.key && (e = "" + a2.key);
  void 0 !== a2.ref && (h2 = a2.ref);
  for (b2 in a2) m$a.call(a2, b2) && !p$1.hasOwnProperty(b2) && (d2[b2] = a2[b2]);
  if (c2 && c2.defaultProps) for (b2 in a2 = c2.defaultProps, a2) void 0 === d2[b2] && (d2[b2] = a2[b2]);
  return { $$typeof: k$1, type: c2, key: e, ref: h2, props: d2, _owner: n$2.current };
}
reactJsxRuntime_production_min.Fragment = l$1;
reactJsxRuntime_production_min.jsx = q$1;
reactJsxRuntime_production_min.jsxs = q$1;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
class ConfigRepository {
  constructor() {
    __privateAdd(this, _config);
    /* -- Intercom staff -- */
    __privateAdd(this, _readSessionIntercomSetting, (key) => sessionStorage.getItem(`kontur.intercom.${key}`));
    __privateAdd(this, _setIntercomSetting, (k2, v2) => {
      const key = `kontur.intercom.${k2}`;
      v2 ? sessionStorage.setItem(key, v2) : sessionStorage.removeItem(key);
    });
  }
  set({
    baseUrl,
    initialUrl,
    initialUrlData,
    stageConfig,
    appConfig,
    baseMapUrl,
    initialUser,
    defaultLayers,
    activeLayers
  }) {
    __privateSet(this, _config, {
      baseUrl,
      initialUrl,
      initialUrlData,
      ...stageConfig,
      ...appConfig,
      mapBaseStyle: baseMapUrl,
      features: Object.keys(appConfig.features).length > 0 ? appConfig.features : stageConfig.featuresByDefault,
      initialUser,
      defaultLayers,
      activeLayers
    });
  }
  get() {
    return __privateGet(this, _config);
  }
  getIntercomSettings() {
    return {
      intercomAppId: __privateGet(this, _config).intercomAppId,
      intercomSelector: __privateGet(this, _config).intercomSelector,
      name: __privateGet(this, _readSessionIntercomSetting).call(this, "name"),
      email: __privateGet(this, _readSessionIntercomSetting).call(this, "email"),
      phone: __privateGet(this, _readSessionIntercomSetting).call(this, "phone")
    };
  }
  updateIntercomSettings(settings) {
    Object.entries(settings).forEach(([k2, v2]) => __privateGet(this, _setIntercomSetting).call(this, k2, v2));
  }
}
_config = new WeakMap();
_readSessionIntercomSetting = new WeakMap();
_setIntercomSetting = new WeakMap();
const configRepo = new ConfigRepository();
const _configDataMock = {
  baseUrl: "/active/",
  initialUrl: "https://disaster.ninja/active/map?map=4.920/37.682/112.588&event=1c1eb9ce-2fb0-4660-ae2e-ee93d15f8874&layers=kontur_lines%2CactiveContributors%2CeventShape%2ChotProjects_outlines%2Cpopulation_density%2Cfocused-geometry",
  initialUrlData: {
    layers: ["kontur_lines", "population_density"]
  },
  apiGateway: "https://disaster.ninja/active/api",
  reportsApiGateway: "/active/reports",
  bivariateTilesRelativeUrl: "api/tiles/bivariate/v1/",
  bivariateTilesIndicatorsClass: "all",
  refreshIntervalSec: 300,
  sentryDsn: "",
  keycloakUrl: "https://keycloak01.kontur.io",
  keycloakRealm: "kontur",
  keycloakClientId: "kontur_platform",
  // intercomDefaultName: null,
  intercomAppId: "e59cl64z",
  intercomSelector: "#kontur_header_chat_btn",
  defaultFeed: "kontur-public",
  osmEditors: [
    {
      id: "josm",
      title: "JOSM",
      url: "https://www.openstreetmap.org/edit?editor=remote#map="
    },
    {
      id: "id",
      title: "iD",
      url: "https://www.openstreetmap.org/edit?editor=id&node=2188188227#map="
    },
    {
      id: "rapid",
      title: "RapiD",
      url: "https://mapwith.ai/rapid#map="
    }
  ],
  autofocusZoom: 13,
  mapBlankSpaceId: "map-view",
  mapBaseStyle: "https://prod-basemap-tileserver.k8s-01.konturlabs.com/layers/tiles/basemap/style_ninja_en.json",
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
    tooltip: true
  },
  id: "9043acf9-2cf3-48ac-9656-a5d7c4b7593d",
  name: "Kontur Atlas",
  description: "Kontur SAAS application",
  ownedByUser: false,
  extent: [-135, 0, 63, 62],
  sidebarIconUrl: "/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/favicon.svg",
  faviconUrl: "/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/favicon.svg",
  faviconPack: {
    "favicon.svg": "/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/favicon.svg",
    "favicon.ico": "/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/favicon.ico",
    "apple-touch-icon.png": "/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/apple-touch-icon.png",
    "icon-192x192.png": "/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/icon-192x192.png",
    "icon-512x512.png": "/active/api/apps/9043acf9-2cf3-48ac-9656-a5d7c4b7593d/assets/icon-512x512.png"
  },
  // @ts-ignore
  features: {
    side_bar: true,
    intercom: true,
    tooltip: true,
    subscription: {
      billingMethodsDetails: [
        {
          id: "paypal",
          clientId: "xxxxxxx-xxxx-xxxxxxxxxxxxxx"
        }
      ],
      billingCyclesDetails: [
        {
          id: "month",
          name: "Monthly",
          note: null
        },
        {
          id: "year",
          name: "Annually",
          note: "Save 5%"
        }
      ],
      plans: [
        {
          id: "kontur_atlas_edu",
          name: "Educational",
          style: "basic",
          billingCycles: [
            {
              id: "month",
              initialPricePerMonth: null,
              pricePerMonth: 100,
              pricePerYear: null,
              billingMethods: [
                {
                  id: "paypal",
                  billingPlanId: "P-000000000000000000000000"
                }
              ]
            },
            {
              id: "year",
              initialPricePerMonth: 100,
              pricePerMonth: 95,
              pricePerYear: 1140,
              billingMethods: [
                {
                  id: "paypal",
                  billingPlanId: "P-000000000000000000000000"
                }
              ]
            }
          ]
        },
        {
          id: "kontur_atlas_pro",
          name: "Professional",
          style: "premium",
          billingCycles: [
            {
              id: "month",
              initialPricePerMonth: null,
              pricePerMonth: 1e3,
              pricePerYear: null,
              billingMethods: [
                {
                  id: "paypal",
                  billingPlanId: "P-000000000000000000000000"
                }
              ]
            },
            {
              id: "year",
              initialPricePerMonth: 1e3,
              pricePerMonth: 950,
              pricePerYear: 11400,
              billingMethods: [
                {
                  id: "paypal",
                  billingPlanId: "P-000000000000000000000000"
                }
              ]
            }
          ]
        },
        {
          id: "kontur_atlas_custom",
          name: "Custom",
          style: "custom",
          actions: [
            {
              name: "contact_sales",
              params: {
                link: "https://calendly.com/"
              }
            },
            {
              name: "book_a_demo"
            }
          ]
        }
      ]
    },
    app_login: true,
    toasts: true,
    use_3rdparty_analytics: true,
    about_page: {
      tabId: "about",
      assetUrl: "about.md",
      subTabs: [
        {
          tabId: "terms",
          assetUrl: "terms.md"
        },
        {
          tabId: "privacy",
          assetUrl: "privacy.md"
        },
        {
          tabId: "user-guide",
          assetUrl: "user_guide.md"
        }
      ]
    }
  },
  public: true,
  initialUser: {
    username: "",
    email: "",
    fullName: "",
    language: "en",
    useMetricUnits: true,
    subscribedToKonturUpdates: false,
    bio: "",
    osmEditor: "josm",
    defaultFeed: "kontur-public",
    theme: "kontur"
  },
  defaultLayers: [
    {
      id: "kontur_lines",
      source: {
        type: "maplibre-style-url",
        urls: [
          "https://prod-basemap-tileserver.k8s-01.konturlabs.com/layers/tiles/basemap/style_ninja_en.json"
        ]
      },
      ownedByUser: false
    },
    {
      id: "population_density",
      // @ts-ignore
      source: {
        urls: [
          "https://disaster.ninja/active/api/tiles/bivariate/v1/{z}/{x}/{y}.mvt?indicatorsClass=general"
        ]
      },
      // @ts-ignore
      legend: {
        type: "simple",
        steps: [
          {
            stepName: "0 - 1.27",
            stepShape: "square",
            style: {
              color: "#F0F0D6",
              "fill-color": "#F0F0D6",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "1.27 - 2.45",
            stepShape: "square",
            style: {
              color: "#ECECC4",
              "fill-color": "#ECECC4",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "2.45 - 5.75",
            stepShape: "square",
            style: {
              color: "#EAEAB0",
              "fill-color": "#EAEAB0",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "5.75 - 12.43",
            stepShape: "square",
            style: {
              color: "#E8E89D",
              "fill-color": "#E8E89D",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "12.43 - 28.47",
            stepShape: "square",
            style: {
              color: "#E1D689",
              "fill-color": "#E1D689",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "28.47 - 66.03",
            stepShape: "square",
            style: {
              color: "#DAC075",
              "fill-color": "#DAC075",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "66.03 - 172.46",
            stepShape: "square",
            style: {
              color: "#D1A562",
              "fill-color": "#D1A562",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "172.46 - 535.67",
            stepShape: "square",
            style: {
              color: "#C98A50",
              "fill-color": "#C98A50",
              "fill-opacity": 0.8
            }
          },
          {
            stepName: "535.67 - 46200",
            stepShape: "square",
            style: {
              color: "#BF6C3F",
              "fill-color": "#BF6C3F",
              "fill-opacity": 0.8
            }
          }
        ]
      },
      ownedByUser: false
    }
  ],
  activeLayers: ["kontur_lines", "population_density"]
};
configRepo.get = () => _configDataMock;
const _md = `![Kontur Atlas](about-atlas-1.png)

# Kontur Atlas

Atlas is your GPS for big decisions. It's a tool that helps you use maps and data to figure out a wide range of things, from where to open a new store to exploring environmental sustainability.

![Geospatial Data with Ease](about-atlas-2.png)

## Geospatial Data with Ease

### Browse & Choose Data

We've got tons of info like who lives where and how people get around. Find the data that'll answer your questions.

### Make Maps

With a few clicks, Atlas turns that data into maps and visuals so it's easy to understand.

### Analyze & Decide

Use these insights to make smart decisions, like picking the perfect spot for your next big project or making concussions based on spatial patterns.

### Jump in and start exploring

Your next big opportunity is waiting to be mapped out!

## _[Subscribe to Atlas](/pricing)_ wrapped in "\\_"

### **[Subscribe to Atlas](/pricing)** "\\_\\_"

### **_[Subscribe to Atlas](/pricing)_** "\\_\\_\\*"

## How to Use

---

![youtube](https://www.youtube.com/embed/g7WMD10DMPs?si=Gl6RdNM0L3ufi0uF::800,470,true)

### Area Selection

To choose an area for analysis, you can use the toolbar to select an administrative unit, draw a shape manually, or import a GeoJSON file.

![youtube](https://www.youtube.com/embed/aCXaAYEW0oM::800,470,true)

### Analytics Panel

This panel displays essential data about your selected area.

#### AI Insights

Compares your area's data with global averages, alerting you to any significant discrepancies.

#### Personalized AI Insights

Reference Area: This allows you to set a known area as a reference point for comparisons and highlights differences.
Bio: Here, you can record details like who you're working for, your analysis purpose, and key topics, helping to personalize AI conclusions.

![youtube](https://www.youtube.com/embed/Md5Mex-POBo::800,470,true)

### Creating Custom Analysis

To create your own analysis, select the "MCDA" button in the toolbar.

#### Choosing Relevant Layers

Start by picking data layers appropriate for your requirements — this could include anything from population density to environmental risk factors.

#### Browse the map

By default, the map displays red hexagons in high-value areas and green hexagons where values are minimal. Click on any hexagon to access detailed info for that particular sector.

#### Layer Customization

Enhance your analysis by fine-tuning the range and what is bad and good of each layer. This means you can focus specifically on aspects crucial to your study.

---

### _[Learn more on kontur.io](https://www.kontur.io/atlas)_
`;
const _css = "article {\n  & * {\n    outline: lime solid thin;\n  }\n}\n";
function t() {
  return t = Object.assign ? Object.assign.bind() : function(e) {
    for (var t2 = 1; t2 < arguments.length; t2++) {
      var n2 = arguments[t2];
      for (var r2 in n2) Object.prototype.hasOwnProperty.call(n2, r2) && (e[r2] = n2[r2]);
    }
    return e;
  }, t.apply(this, arguments);
}
const n$1 = ["children", "options"], r$2 = { blockQuote: "0", breakLine: "1", breakThematic: "2", codeBlock: "3", codeFenced: "4", codeInline: "5", footnote: "6", footnoteReference: "7", gfmTask: "8", heading: "9", headingSetext: "10", htmlBlock: "11", htmlComment: "12", htmlSelfClosing: "13", image: "14", link: "15", linkAngleBraceStyleDetector: "16", linkBareUrlDetector: "17", linkMailtoDetector: "18", newlineCoalescer: "19", orderedList: "20", paragraph: "21", ref: "22", refImage: "23", refLink: "24", table: "25", tableSeparator: "26", text: "27", textBolded: "28", textEmphasized: "29", textEscaped: "30", textMarked: "31", textStrikethroughed: "32", unorderedList: "33" };
var i$1;
!function(e) {
  e[e.MAX = 0] = "MAX", e[e.HIGH = 1] = "HIGH", e[e.MED = 2] = "MED", e[e.LOW = 3] = "LOW", e[e.MIN = 4] = "MIN";
}(i$1 || (i$1 = {}));
const l = ["allowFullScreen", "allowTransparency", "autoComplete", "autoFocus", "autoPlay", "cellPadding", "cellSpacing", "charSet", "classId", "colSpan", "contentEditable", "contextMenu", "crossOrigin", "encType", "formAction", "formEncType", "formMethod", "formNoValidate", "formTarget", "frameBorder", "hrefLang", "inputMode", "keyParams", "keyType", "marginHeight", "marginWidth", "maxLength", "mediaGroup", "minLength", "noValidate", "radioGroup", "readOnly", "rowSpan", "spellCheck", "srcDoc", "srcLang", "srcSet", "tabIndex", "useMap"].reduce((e, t2) => (e[t2.toLowerCase()] = t2, e), { class: "className", for: "htmlFor" }), a$1 = { amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", quot: "“" }, o$2 = ["style", "script"], c$2 = /([-A-Z0-9_:]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|(?:\{((?:\\.|{[^}]*?}|[^}])*)\})))?/gi, s$e = /mailto:/i, d = /\n{2,}$/, p = /^(\s*>[\s\S]*?)(?=\n\n|$)/, u = /^ *> ?/gm, f$1 = /^(?:\[!([^\]]*)\]\n)?([\s\S]*)/, h = /^ {2,}\n/, m$9 = /^(?:( *[-*_])){3,} *(?:\n *)+\n/, g = /^(?: {1,3})?(`{3,}|~{3,}) *(\S+)? *([^\n]*?)?\n([\s\S]*?)(?:\1\n?|$)/, y = /^(?: {4}[^\n]+\n*)+(?:\n *)+\n?/, k = /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/, x = /^(?:\n *)*\n/, b = /\r\n?/g, v = /^\[\^([^\]]+)](:(.*)((\n+ {4,}.*)|(\n(?!\[\^).+))*)/, S = /^\[\^([^\]]+)]/, C = /\f/g, $ = /^---[ \t]*\n(.|\n)*\n---[ \t]*\n/, E = /^\s*?\[(x|\s)\]/, w = /^ *(#{1,6}) *([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/, z = /^ *(#{1,6}) +([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/, L = /^([^\n]+)\n *(=|-){3,} *(?:\n *)+\n/, A = /^ *(?!<[a-z][^ >/]* ?\/>)<([a-z][^ >/]*) ?((?:[^>]*[^/])?)>\n?(\s*(?:<\1[^>]*?>[\s\S]*?<\/\1>|(?!<\1\b)[\s\S])*?)<\/\1>(?!<\/\1>)\n*/i, T = /&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gi, O = /^<!--[\s\S]*?(?:-->)/, B = /^(data|aria|x)-[a-z_][a-z\d_.-]*$/, M = /^ *<([a-z][a-z0-9:]*)(?:\s+((?:<.*?>|[^>])*))?\/?>(?!<\/\1>)(\s*\n)?/i, R = /^\{.*\}$/, I = /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/, U = /^<([^ >]+@[^ >]+)>/, D = /^<([^ >]+:\/[^ >]+)>/, N = /-([a-z])?/gi, j = /^(\|.*)\n(?: *(\|? *[-:]+ *\|[-| :]*)\n((?:.*\|.*\n)*))?\n?/, H = /^\[([^\]]*)\]:\s+<?([^\s>]+)>?\s*("([^"]*)")?/, P = /^!\[([^\]]*)\] ?\[([^\]]*)\]/, F = /^\[([^\]]*)\] ?\[([^\]]*)\]/, _ = /(\n|^[-*]\s|^#|^ {2,}|^-{2,}|^>\s)/, G = /\t/g, W = /(^ *\||\| *$)/g, Z = /^ *:-+: *$/, q = /^ *:-+ *$/, Q = /^ *-+: *$/, V = "((?:\\[.*?\\][([].*?[)\\]]|<.*?>(?:.*?<.*?>)?|`.*?`|~~.*?~~|==.*?==|.|\\n)*?)", X = new RegExp(`^([*_])\\1${V}\\1\\1(?!\\1)`), J = new RegExp(`^([*_])${V}\\1(?!\\1|\\w)`), K = new RegExp(`^==${V}==`), Y = new RegExp(`^~~${V}~~`), ee = /^\\([^0-9A-Za-z\s])/, te = /^[\s\S]+?(?=[^0-9A-Z\s\u00c0-\uffff&#;.()'"]|\d+\.|\n\n| {2,}\n|\w+:\S|$)/i, ne = /^\n+/, re = /^([ \t]*)/, ie = /\\([^\\])/g, le = / *\n+$/, ae = /(?:^|\n)( *)$/, oe = "(?:\\d+\\.)", ce = "(?:[*+-])";
function se(e) {
  return "( *)(" + (1 === e ? oe : ce) + ") +";
}
const de = se(1), pe = se(2);
function ue(e) {
  return new RegExp("^" + (1 === e ? de : pe));
}
const fe = ue(1), he = ue(2);
function me(e) {
  return new RegExp("^" + (1 === e ? de : pe) + "[^\\n]*(?:\\n(?!\\1" + (1 === e ? oe : ce) + " )[^\\n]*)*(\\n|$)", "gm");
}
const ge = me(1), ye = me(2);
function ke(e) {
  const t2 = 1 === e ? oe : ce;
  return new RegExp("^( *)(" + t2 + ") [\\s\\S]+?(?:\\n{2,}(?! )(?!\\1" + t2 + " (?!" + t2 + " ))\\n*|\\s*\\n*$)");
}
const xe = ke(1), be = ke(2);
function ve(e, t2) {
  const n2 = 1 === t2, i2 = n2 ? xe : be, l2 = n2 ? ge : ye, a2 = n2 ? fe : he;
  return { match(e2, t3) {
    const n3 = ae.exec(t3.prevCapture);
    return n3 && (t3.list || !t3.inline && !t3.simple) ? i2.exec(e2 = n3[1] + e2) : null;
  }, order: 1, parse(e2, t3, r2) {
    const i3 = n2 ? +e2[2] : void 0, o2 = e2[0].replace(d, "\n").match(l2);
    let c2 = false;
    return { items: o2.map(function(e3, n3) {
      const i4 = a2.exec(e3)[0].length, l3 = new RegExp("^ {1," + i4 + "}", "gm"), s2 = e3.replace(l3, "").replace(a2, ""), d2 = n3 === o2.length - 1, p2 = -1 !== s2.indexOf("\n\n") || d2 && c2;
      c2 = p2;
      const u2 = r2.inline, f2 = r2.list;
      let h2;
      r2.list = true, p2 ? (r2.inline = false, h2 = s2.replace(le, "\n\n")) : (r2.inline = true, h2 = s2.replace(le, ""));
      const m2 = t3(h2, r2);
      return r2.inline = u2, r2.list = f2, m2;
    }), ordered: n2, start: i3 };
  }, render: (t3, n3, i3) => e(t3.ordered ? "ol" : "ul", { key: i3.key, start: t3.type === r$2.orderedList ? t3.start : void 0 }, t3.items.map(function(t4, r2) {
    return e("li", { key: r2 }, n3(t4, i3));
  })) };
}
const Se = new RegExp(`^\\[((?:\\[[^\\]]*\\]|[^\\[\\]]|\\](?=[^\\[]*\\]))*)\\]\\(\\s*<?((?:\\([^)]*\\)|[^\\s\\\\]|\\\\.)*?)>?(?:\\s+['"]([\\s\\S]*?)['"])?\\s*\\)`), Ce = /^!\[(.*?)\]\( *((?:\([^)]*\)|[^() ])*) *"?([^)"]*)?"?\)/, $e = [p, g, y, w, L, z, O, j, ge, xe, ye, be], Ee = [...$e, /^[^\n]+(?:  \n|\n{2,})/, A, M];
function we(e) {
  return e.replace(/[ÀÁÂÃÄÅàáâãäåæÆ]/g, "a").replace(/[çÇ]/g, "c").replace(/[ðÐ]/g, "d").replace(/[ÈÉÊËéèêë]/g, "e").replace(/[ÏïÎîÍíÌì]/g, "i").replace(/[Ññ]/g, "n").replace(/[øØœŒÕõÔôÓóÒò]/g, "o").replace(/[ÜüÛûÚúÙù]/g, "u").replace(/[ŸÿÝý]/g, "y").replace(/[^a-z0-9- ]/gi, "").replace(/ /gi, "-").toLowerCase();
}
function ze(e) {
  return Q.test(e) ? "right" : Z.test(e) ? "center" : q.test(e) ? "left" : null;
}
function Le(e, t2, n2, i2) {
  const l2 = n2.inTable;
  n2.inTable = true;
  let a2 = e.trim().split(/( *(?:`[^`]*`|\\\||\|) *)/).reduce((e2, l3) => ("|" === l3.trim() ? e2.push(i2 ? { type: r$2.tableSeparator } : { type: r$2.text, text: l3 }) : "" !== l3 && e2.push.apply(e2, t2(l3, n2)), e2), []);
  n2.inTable = l2;
  let o2 = [[]];
  return a2.forEach(function(e2, t3) {
    e2.type === r$2.tableSeparator ? 0 !== t3 && t3 !== a2.length - 1 && o2.push([]) : (e2.type !== r$2.text || null != a2[t3 + 1] && a2[t3 + 1].type !== r$2.tableSeparator || (e2.text = e2.text.trimEnd()), o2[o2.length - 1].push(e2));
  }), o2;
}
function Ae(e, t2, n2) {
  n2.inline = true;
  const i2 = e[2] ? e[2].replace(W, "").split("|").map(ze) : [], l2 = e[3] ? function(e2, t3, n3) {
    return e2.trim().split("\n").map(function(e3) {
      return Le(e3, t3, n3, true);
    });
  }(e[3], t2, n2) : [], a2 = Le(e[1], t2, n2, !!l2.length);
  return n2.inline = false, l2.length ? { align: i2, cells: l2, header: a2, type: r$2.table } : { children: a2, type: r$2.paragraph };
}
function Te(e, t2) {
  return null == e.align[t2] ? {} : { textAlign: e.align[t2] };
}
function Oe(e) {
  return function(t2, n2) {
    return n2.inline ? e.exec(t2) : null;
  };
}
function Be(e) {
  return function(t2, n2) {
    return n2.inline || n2.simple ? e.exec(t2) : null;
  };
}
function Me(e) {
  return function(t2, n2) {
    return n2.inline || n2.simple ? null : e.exec(t2);
  };
}
function Re(e) {
  return function(t2) {
    return e.exec(t2);
  };
}
function Ie(e, t2) {
  if (t2.inline || t2.simple) return null;
  let n2 = "";
  e.split("\n").every((e2) => !$e.some((t3) => t3.test(e2)) && (n2 += e2 + "\n", e2.trim()));
  const r2 = n2.trimEnd();
  return "" == r2 ? null : [n2, r2];
}
function Ue(e) {
  try {
    if (decodeURIComponent(e).replace(/[^A-Za-z0-9/:]/g, "").match(/^\s*(javascript|vbscript|data(?!:image)):/i)) return null;
  } catch (e2) {
    return null;
  }
  return e;
}
function De(e) {
  return e.replace(ie, "$1");
}
function Ne(e, t2, n2) {
  const r2 = n2.inline || false, i2 = n2.simple || false;
  n2.inline = true, n2.simple = true;
  const l2 = e(t2, n2);
  return n2.inline = r2, n2.simple = i2, l2;
}
function je(e, t2, n2) {
  const r2 = n2.inline || false, i2 = n2.simple || false;
  n2.inline = false, n2.simple = true;
  const l2 = e(t2, n2);
  return n2.inline = r2, n2.simple = i2, l2;
}
function He(e, t2, n2) {
  const r2 = n2.inline || false;
  n2.inline = false;
  const i2 = e(t2, n2);
  return n2.inline = r2, i2;
}
const Pe = (e, t2, n2) => ({ children: Ne(t2, e[1], n2) });
function Fe() {
  return {};
}
function _e() {
  return null;
}
function Ge(...e) {
  return e.filter(Boolean).join(" ");
}
function We(e, t2, n2) {
  let r2 = e;
  const i2 = t2.split(".");
  for (; i2.length && (r2 = r2[i2[0]], void 0 !== r2); ) i2.shift();
  return r2 || n2;
}
function Ze(n2 = "", i2 = {}) {
  function d2(e, n3, ...r2) {
    const l2 = We(i2.overrides, `${e}.props`, {});
    return i2.createElement(function(e2, t2) {
      const n4 = We(t2, e2);
      return n4 ? "function" == typeof n4 || "object" == typeof n4 && "render" in n4 ? n4 : We(t2, `${e2}.component`, e2) : e2;
    }(e, i2.overrides), t({}, n3, l2, { className: Ge(null == n3 ? void 0 : n3.className, l2.className) || void 0 }), ...r2);
  }
  function W2(e) {
    e = e.replace($, "");
    let t2 = false;
    i2.forceInline ? t2 = true : i2.forceBlock || (t2 = false === _.test(e));
    const n3 = le2(ie2(t2 ? e : `${e.trimEnd().replace(ne, "")}

`, { inline: t2 }));
    for (; "string" == typeof n3[n3.length - 1] && !n3[n3.length - 1].trim(); ) n3.pop();
    if (null === i2.wrapper) return n3;
    const r2 = i2.wrapper || (t2 ? "span" : "div");
    let l2;
    if (n3.length > 1 || i2.forceWrapper) l2 = n3;
    else {
      if (1 === n3.length) return l2 = n3[0], "string" == typeof l2 ? d2("span", { key: "outer" }, l2) : l2;
      l2 = null;
    }
    return i2.createElement(r2, { key: "outer" }, l2);
  }
  function Z2(e, t2) {
    const n3 = t2.match(c$2);
    return n3 ? n3.reduce(function(t3, n4) {
      const r2 = n4.indexOf("=");
      if (-1 !== r2) {
        const a2 = function(e2) {
          return -1 !== e2.indexOf("-") && null === e2.match(B) && (e2 = e2.replace(N, function(e3, t4) {
            return t4.toUpperCase();
          })), e2;
        }(n4.slice(0, r2)).trim(), o2 = function(e2) {
          const t4 = e2[0];
          return ('"' === t4 || "'" === t4) && e2.length >= 2 && e2[e2.length - 1] === t4 ? e2.slice(1, -1) : e2;
        }(n4.slice(r2 + 1).trim()), c2 = l[a2] || a2;
        if ("ref" === c2) return t3;
        const s2 = t3[c2] = function(e2, t4, n5, r3) {
          return "style" === t4 ? n5.split(/;\s?/).reduce(function(e3, t5) {
            const n6 = t5.slice(0, t5.indexOf(":"));
            return e3[n6.trim().replace(/(-[a-z])/g, (e4) => e4[1].toUpperCase())] = t5.slice(n6.length + 1).trim(), e3;
          }, {}) : "href" === t4 || "src" === t4 ? r3(n5, e2, t4) : (n5.match(R) && (n5 = n5.slice(1, n5.length - 1)), "true" === n5 || "false" !== n5 && n5);
        }(e, a2, o2, i2.sanitizer);
        "string" == typeof s2 && (A.test(s2) || M.test(s2)) && (t3[c2] = W2(s2.trim()));
      } else "style" !== n4 && (t3[l[n4] || n4] = true);
      return t3;
    }, {}) : null;
  }
  i2.overrides = i2.overrides || {}, i2.sanitizer = i2.sanitizer || Ue, i2.slugify = i2.slugify || we, i2.namedCodesToUnicode = i2.namedCodesToUnicode ? t({}, a$1, i2.namedCodesToUnicode) : a$1, i2.createElement = i2.createElement || reactExports.createElement;
  const q2 = [], Q2 = {}, V2 = { [r$2.blockQuote]: { match: Me(p), order: 1, parse(e, t2, n3) {
    const [, r2, i3] = e[0].replace(u, "").match(f$1);
    return { alert: r2, children: t2(i3, n3) };
  }, render(e, t2, n3) {
    const l2 = { key: n3.key };
    return e.alert && (l2.className = "markdown-alert-" + i2.slugify(e.alert.toLowerCase(), we), e.children.unshift({ attrs: {}, children: [{ type: r$2.text, text: e.alert }], noInnerParse: true, type: r$2.htmlBlock, tag: "header" })), d2("blockquote", l2, t2(e.children, n3));
  } }, [r$2.breakLine]: { match: Re(h), order: 1, parse: Fe, render: (e, t2, n3) => d2("br", { key: n3.key }) }, [r$2.breakThematic]: { match: Me(m$9), order: 1, parse: Fe, render: (e, t2, n3) => d2("hr", { key: n3.key }) }, [r$2.codeBlock]: { match: Me(y), order: 0, parse: (e) => ({ lang: void 0, text: e[0].replace(/^ {4}/gm, "").replace(/\n+$/, "") }), render: (e, n3, r2) => d2("pre", { key: r2.key }, d2("code", t({}, e.attrs, { className: e.lang ? `lang-${e.lang}` : "" }), e.text)) }, [r$2.codeFenced]: { match: Me(g), order: 0, parse: (e) => ({ attrs: Z2("code", e[3] || ""), lang: e[2] || void 0, text: e[4], type: r$2.codeBlock }) }, [r$2.codeInline]: { match: Be(k), order: 3, parse: (e) => ({ text: e[2] }), render: (e, t2, n3) => d2("code", { key: n3.key }, e.text) }, [r$2.footnote]: { match: Me(v), order: 0, parse: (e) => (q2.push({ footnote: e[2], identifier: e[1] }), {}), render: _e }, [r$2.footnoteReference]: { match: Oe(S), order: 1, parse: (e) => ({ target: `#${i2.slugify(e[1], we)}`, text: e[1] }), render: (e, t2, n3) => d2("a", { key: n3.key, href: i2.sanitizer(e.target, "a", "href") }, d2("sup", { key: n3.key }, e.text)) }, [r$2.gfmTask]: { match: Oe(E), order: 1, parse: (e) => ({ completed: "x" === e[1].toLowerCase() }), render: (e, t2, n3) => d2("input", { checked: e.completed, key: n3.key, readOnly: true, type: "checkbox" }) }, [r$2.heading]: { match: Me(i2.enforceAtxHeadings ? z : w), order: 1, parse: (e, t2, n3) => ({ children: Ne(t2, e[2], n3), id: i2.slugify(e[2], we), level: e[1].length }), render: (e, t2, n3) => d2(`h${e.level}`, { id: e.id, key: n3.key }, t2(e.children, n3)) }, [r$2.headingSetext]: { match: Me(L), order: 0, parse: (e, t2, n3) => ({ children: Ne(t2, e[1], n3), level: "=" === e[2] ? 1 : 2, type: r$2.heading }) }, [r$2.htmlBlock]: { match: Re(A), order: 1, parse(e, t2, n3) {
    const [, r2] = e[3].match(re), i3 = new RegExp(`^${r2}`, "gm"), l2 = e[3].replace(i3, ""), a2 = (c2 = l2, Ee.some((e2) => e2.test(c2)) ? He : Ne);
    var c2;
    const s2 = e[1].toLowerCase(), d3 = -1 !== o$2.indexOf(s2), p2 = (d3 ? s2 : e[1]).trim(), u2 = { attrs: Z2(p2, e[2]), noInnerParse: d3, tag: p2 };
    return n3.inAnchor = n3.inAnchor || "a" === s2, d3 ? u2.text = e[3] : u2.children = a2(t2, l2, n3), n3.inAnchor = false, u2;
  }, render: (e, n3, r2) => d2(e.tag, t({ key: r2.key }, e.attrs), e.text || (e.children ? n3(e.children, r2) : "")) }, [r$2.htmlSelfClosing]: { match: Re(M), order: 1, parse(e) {
    const t2 = e[1].trim();
    return { attrs: Z2(t2, e[2] || ""), tag: t2 };
  }, render: (e, n3, r2) => d2(e.tag, t({}, e.attrs, { key: r2.key })) }, [r$2.htmlComment]: { match: Re(O), order: 1, parse: () => ({}), render: _e }, [r$2.image]: { match: Be(Ce), order: 1, parse: (e) => ({ alt: e[1], target: De(e[2]), title: e[3] }), render: (e, t2, n3) => d2("img", { key: n3.key, alt: e.alt || void 0, title: e.title || void 0, src: i2.sanitizer(e.target, "img", "src") }) }, [r$2.link]: { match: Oe(Se), order: 3, parse: (e, t2, n3) => ({ children: je(t2, e[1], n3), target: De(e[2]), title: e[3] }), render: (e, t2, n3) => d2("a", { key: n3.key, href: i2.sanitizer(e.target, "a", "href"), title: e.title }, t2(e.children, n3)) }, [r$2.linkAngleBraceStyleDetector]: { match: Oe(D), order: 0, parse: (e) => ({ children: [{ text: e[1], type: r$2.text }], target: e[1], type: r$2.link }) }, [r$2.linkBareUrlDetector]: { match: (e, t2) => t2.inAnchor || i2.disableAutoLink ? null : Oe(I)(e, t2), order: 0, parse: (e) => ({ children: [{ text: e[1], type: r$2.text }], target: e[1], title: void 0, type: r$2.link }) }, [r$2.linkMailtoDetector]: { match: Oe(U), order: 0, parse(e) {
    let t2 = e[1], n3 = e[1];
    return s$e.test(n3) || (n3 = "mailto:" + n3), { children: [{ text: t2.replace("mailto:", ""), type: r$2.text }], target: n3, type: r$2.link };
  } }, [r$2.orderedList]: ve(d2, 1), [r$2.unorderedList]: ve(d2, 2), [r$2.newlineCoalescer]: { match: Me(x), order: 3, parse: Fe, render: () => "\n" }, [r$2.paragraph]: { match: Ie, order: 3, parse: Pe, render: (e, t2, n3) => d2("p", { key: n3.key }, t2(e.children, n3)) }, [r$2.ref]: { match: Oe(H), order: 0, parse: (e) => (Q2[e[1]] = { target: e[2], title: e[4] }, {}), render: _e }, [r$2.refImage]: { match: Be(P), order: 0, parse: (e) => ({ alt: e[1] || void 0, ref: e[2] }), render: (e, t2, n3) => Q2[e.ref] ? d2("img", { key: n3.key, alt: e.alt, src: i2.sanitizer(Q2[e.ref].target, "img", "src"), title: Q2[e.ref].title }) : null }, [r$2.refLink]: { match: Oe(F), order: 0, parse: (e, t2, n3) => ({ children: t2(e[1], n3), fallbackChildren: e[0], ref: e[2] }), render: (e, t2, n3) => Q2[e.ref] ? d2("a", { key: n3.key, href: i2.sanitizer(Q2[e.ref].target, "a", "href"), title: Q2[e.ref].title }, t2(e.children, n3)) : d2("span", { key: n3.key }, e.fallbackChildren) }, [r$2.table]: { match: Me(j), order: 1, parse: Ae, render(e, t2, n3) {
    const r2 = e;
    return d2("table", { key: n3.key }, d2("thead", null, d2("tr", null, r2.header.map(function(e2, i3) {
      return d2("th", { key: i3, style: Te(r2, i3) }, t2(e2, n3));
    }))), d2("tbody", null, r2.cells.map(function(e2, i3) {
      return d2("tr", { key: i3 }, e2.map(function(e3, i4) {
        return d2("td", { key: i4, style: Te(r2, i4) }, t2(e3, n3));
      }));
    })));
  } }, [r$2.text]: { match: Re(te), order: 4, parse: (e) => ({ text: e[0].replace(T, (e2, t2) => i2.namedCodesToUnicode[t2] ? i2.namedCodesToUnicode[t2] : e2) }), render: (e) => e.text }, [r$2.textBolded]: { match: Be(X), order: 2, parse: (e, t2, n3) => ({ children: t2(e[2], n3) }), render: (e, t2, n3) => d2("strong", { key: n3.key }, t2(e.children, n3)) }, [r$2.textEmphasized]: { match: Be(J), order: 3, parse: (e, t2, n3) => ({ children: t2(e[2], n3) }), render: (e, t2, n3) => d2("em", { key: n3.key }, t2(e.children, n3)) }, [r$2.textEscaped]: { match: Be(ee), order: 1, parse: (e) => ({ text: e[1], type: r$2.text }) }, [r$2.textMarked]: { match: Be(K), order: 3, parse: Pe, render: (e, t2, n3) => d2("mark", { key: n3.key }, t2(e.children, n3)) }, [r$2.textStrikethroughed]: { match: Be(Y), order: 3, parse: Pe, render: (e, t2, n3) => d2("del", { key: n3.key }, t2(e.children, n3)) } };
  true === i2.disableParsingRawHTML && (delete V2[r$2.htmlBlock], delete V2[r$2.htmlSelfClosing]);
  const ie2 = function(e) {
    let t2 = Object.keys(e);
    function n3(r2, i3) {
      let l2 = [];
      for (i3.prevCapture = i3.prevCapture || ""; r2; ) {
        let a2 = 0;
        for (; a2 < t2.length; ) {
          const o2 = t2[a2], c2 = e[o2], s2 = c2.match(r2, i3);
          if (s2) {
            const e2 = s2[0];
            i3.prevCapture += e2, r2 = r2.substring(e2.length);
            const t3 = c2.parse(s2, n3, i3);
            null == t3.type && (t3.type = o2), l2.push(t3);
            break;
          }
          a2++;
        }
      }
      return i3.prevCapture = "", l2;
    }
    return t2.sort(function(t3, n4) {
      let r2 = e[t3].order, i3 = e[n4].order;
      return r2 !== i3 ? r2 - i3 : t3 < n4 ? -1 : 1;
    }), function(e2, t3) {
      return n3(function(e3) {
        return e3.replace(b, "\n").replace(C, "").replace(G, "    ");
      }(e2), t3);
    };
  }(V2), le2 = (ae2 = /* @__PURE__ */ function(e, t2) {
    return function(n3, r2, i3) {
      const l2 = e[n3.type].render;
      return t2 ? t2(() => l2(n3, r2, i3), n3, r2, i3) : l2(n3, r2, i3);
    };
  }(V2, i2.renderRule), function e(t2, n3 = {}) {
    if (Array.isArray(t2)) {
      const r2 = n3.key, i3 = [];
      let l2 = false;
      for (let r3 = 0; r3 < t2.length; r3++) {
        n3.key = r3;
        const a2 = e(t2[r3], n3), o2 = "string" == typeof a2;
        o2 && l2 ? i3[i3.length - 1] += a2 : null !== a2 && i3.push(a2), l2 = o2;
      }
      return n3.key = r2, i3;
    }
    return ae2(t2, e, n3);
  });
  var ae2;
  const oe2 = W2(n2);
  return q2.length ? d2("div", null, oe2, d2("footer", { key: "footer" }, q2.map(function(e) {
    return d2("div", { id: i2.slugify(e.identifier, we), key: e.identifier }, e.identifier, le2(ie2(e.footnote, { inline: true })));
  }))) : oe2;
}
const Markdown = (t2) => {
  let { children: r2 = "", options: i2 } = t2, l2 = function(e, t3) {
    if (null == e) return {};
    var n2, r3, i3 = {}, l3 = Object.keys(e);
    for (r3 = 0; r3 < l3.length; r3++) t3.indexOf(n2 = l3[r3]) >= 0 || (i3[n2] = e[n2]);
    return i3;
  }(t2, n$1);
  return reactExports.cloneElement(Ze(r2, i2), l2);
};
const NAVIGATE_EVENT = "KNT_NAVIGATE_TO";
const goTo = (slug) => {
  const evt = new CustomEvent(NAVIGATE_EVENT, { detail: { payload: slug } });
  globalThis.dispatchEvent(evt);
};
const impossibleValue = Symbol(), callSafely = function(fn) {
  try {
    return fn(...[].slice.call(arguments, 1));
  } catch (err) {
    return setTimeout(() => {
      throw err;
    }), err instanceof Error ? err : err = new Error(err);
  }
};
function throwReatomError(condition, message) {
  if (condition) throw new Error(`Reatom error: ${message}`);
}
const isAtom$1 = (thing) => void 0 !== (thing == null ? void 0 : thing.__reatom), isConnected$1 = (cache) => cache.subs.size + cache.listeners.size > 0;
function assertFunction(thing) {
  throwReatomError("function" != typeof thing, `invalid "${typeof thing}", function expected`);
}
const getRootCause$2 = (cause) => null === cause.cause ? cause : getRootCause$2(cause.cause), isBrowser = () => {
  var _a;
  return !!((_a = globalThis.navigator) == null ? void 0 : _a.userAgent);
};
let CTX, initiations = 0;
const createCtx = ({ callLateEffect = callSafely, callNearEffect = callSafely, restrictMultipleContexts = isBrowser() } = {}) => {
  restrictMultipleContexts && 1 == initiations++ && console.warn("Reatom: multiple contexts detected, which is irrelevant in browser, you should use only one context");
  let caches = /* @__PURE__ */ new WeakMap(), read = (proto) => caches.get(proto), logsListeners = /* @__PURE__ */ new Set(), nearEffects = [], lateEffects = [], inTr = false, trError = null, trUpdates = [], trRollbacks = [], trLogs = [], trNearEffectsStart = 0, trLateEffectsStart = 0, effectsProcessing = false, walkNearEffects = () => {
    for (let effect of nearEffects) callNearEffect(effect, ctx);
    nearEffects = [];
  }, walkLateEffects = () => {
    if (!effectsProcessing) {
      effectsProcessing = true, walkNearEffects();
      for (let effect of lateEffects) callLateEffect(effect, ctx), nearEffects.length > 0 && walkNearEffects();
      lateEffects = [], effectsProcessing = false;
    }
  }, addPatch = ({ state, proto, pubs, subs, listeners }, cause) => (proto.actual = false, trLogs.push(proto.patch = { state, proto, cause, pubs, subs, listeners }), proto.patch), enqueueComputers = (cache) => {
    for (let subProto of cache.subs) {
      let subCache = subProto.patch ?? read(subProto);
      subProto.patch && !subProto.actual || 0 === addPatch(subCache, cache).listeners.size && enqueueComputers(subCache);
    }
  }, disconnect = (proto, pubPatch) => {
    if (pubPatch.subs.delete(proto) && (trRollbacks.push(() => pubPatch.subs.add(proto)), !isConnected$1(pubPatch))) {
      null !== pubPatch.proto.disconnectHooks && nearEffects.push(...pubPatch.proto.disconnectHooks);
      for (let parentParent of pubPatch.pubs) disconnect(pubPatch.proto, parentParent);
    }
  }, connect = (proto, pubPatch) => {
    if (!pubPatch.subs.has(proto)) {
      let wasConnected = isConnected$1(pubPatch);
      if (pubPatch.subs.add(proto), trRollbacks.push(() => pubPatch.subs.delete(proto)), !wasConnected) {
        null !== pubPatch.proto.connectHooks && nearEffects.push(...pubPatch.proto.connectHooks);
        for (let parentParentPatch of pubPatch.pubs) connect(pubPatch.proto, parentParentPatch);
      }
    }
  }, actualize = (ctx2, proto, updater) => {
    let { patch, actual } = proto, updating = void 0 !== updater;
    if (!updating && actual && (0 === patch.pubs.length || isConnected$1(patch))) return patch;
    let cache = patch ?? read(proto), isInt = !cache, cause = updating ? ctx2.cause : read(__root);
    if (isInt) cache = { state: proto.initState(ctx2), proto, cause, pubs: [], subs: /* @__PURE__ */ new Set(), listeners: /* @__PURE__ */ new Set() };
    else if (null === proto.computer && !updating) return cache;
    patch && !actual || (patch = addPatch(cache, cause));
    let { state } = patch, patchCtx = { get: ctx2.get, spy: void 0, schedule: ctx2.schedule, subscribe: ctx2.subscribe, cause: patch };
    try {
      proto.computer && ((patchCtx2, patch2) => {
        let { proto: proto2, pubs } = patch2, isDepsChanged = false;
        if (0 === pubs.length || pubs.some(({ proto: proto3, state: state2 }) => !Object.is(state2, (patch2.cause = actualize(patchCtx2, proto3)).state))) {
          let newPubs = [];
          if (patchCtx2.spy = ({ __reatom: depProto }, cb) => {
            let depPatch = actualize(patchCtx2, depProto), prevDepPatch = newPubs.push(depPatch) <= pubs.length ? pubs[newPubs.length - 1] : void 0, isDepChanged = (prevDepPatch == null ? void 0 : prevDepPatch.proto) !== depPatch.proto;
            isDepsChanged || (isDepsChanged = isDepChanged);
            let state2 = depProto.isAction && !isDepChanged ? depPatch.state.slice(prevDepPatch.state.length) : depPatch.state;
            if (!cb || !isDepChanged && Object.is(state2, prevDepPatch.state)) return state2;
            if (depProto.isAction) for (const call of state2) cb(call);
            else cb(state2, isDepChanged ? void 0 : prevDepPatch == null ? void 0 : prevDepPatch.state);
          }, patch2.state = patch2.proto.computer(patchCtx2, patch2.state), patch2.pubs = newPubs, (isDepsChanged || pubs.length > newPubs.length) && isConnected$1(patch2)) {
            for (let { proto: depProto } of pubs) newPubs.every((dep) => dep.proto !== depProto) && disconnect(proto2, depProto.patch ?? read(depProto));
            for (let { proto: depProto } of newPubs) pubs.every((dep) => dep.proto !== depProto) && connect(proto2, depProto.patch ?? read(depProto));
          }
          patchCtx2.spy = () => throwReatomError(true, "async spy"), patch2 = proto2 = pubs = newPubs = null;
        }
      })(patchCtx, patch), updating && (patch.cause = ctx2.cause, updater(patchCtx, patch)), proto.actual = true;
    } catch (error2) {
      throw patch.error = error2;
    }
    if (!Object.is(state, patch.state) && (patch.subs.size > 0 && (updating || patch.listeners.size > 0) && enqueueComputers(patch), proto.updateHooks)) {
      let ctx3 = { get: patchCtx.get, spy: void 0, schedule: patchCtx.schedule, subscribe: patchCtx.subscribe, cause: patchCtx.cause };
      proto.updateHooks.forEach((hook) => trUpdates.push(() => hook(ctx3, patch)));
    }
    return patch;
  }, ctx = { get(atomOrCb) {
    if (throwReatomError(CTX && getRootCause$2(CTX.cause) !== read(__root), "cause collision"), isAtom$1(atomOrCb)) {
      let proto = atomOrCb.__reatom;
      if (inTr) return actualize(this, proto).state;
      let cache = read(proto);
      return void 0 === cache || null !== proto.computer && !isConnected$1(cache) ? this.get(() => actualize(this, proto).state) : cache.state;
    }
    if (throwReatomError(null !== trError, "tr failed"), inTr) return atomOrCb(read, actualize);
    inTr = true, trNearEffectsStart = nearEffects.length, trLateEffectsStart = lateEffects.length;
    let start = void 0 === CTX;
    start && (CTX = this);
    try {
      var result = atomOrCb(read, actualize);
      for (let i2 = 0; i2 < trLogs.length; i2++) {
        let { listeners, proto } = trLogs[i2];
        if (listeners.size > 0 && actualize(this, proto), trUpdates.length > 0) for (let commit of trUpdates.splice(0)) commit(this);
      }
      if (trLogs.length) for (let log of logsListeners) log(trLogs);
      for (let patch of trLogs) {
        let { proto, state } = patch;
        if (proto.isAction && (patch.state = []), patch === proto.patch) if (proto.patch = null, proto.actual = false, caches.set(proto, patch), proto.isAction) {
          if (0 === state.length) continue;
          for (let cb of patch.listeners) nearEffects.push(() => cb(state));
        } else for (let cb of patch.listeners) lateEffects.push(() => cb(read(proto).state));
      }
    } catch (e) {
      trError = e = e instanceof Error ? e : new Error(String(e));
      for (let log of logsListeners) log(trLogs, e);
      for (let cb of trRollbacks) callSafely(cb, e);
      for (let { proto } of trLogs) proto.patch = null, proto.actual = false;
      throw nearEffects.length = trNearEffectsStart, lateEffects.length = trLateEffectsStart, e;
    } finally {
      inTr = false, trError = null, trUpdates = [], trRollbacks = [], trLogs = [], trNearEffectsStart = 0, trLateEffectsStart = 0, start && (CTX = void 0);
    }
    return walkLateEffects(), result;
  }, spy: void 0, schedule(cb, step = 1) {
    return assertFunction(cb), throwReatomError(!this, "missed context"), new Promise((res, rej) => {
      -1 === step ? inTr && trRollbacks.push(cb) : 0 === step ? inTr && trUpdates.push(() => cb(this)) : ((1 === step ? nearEffects : lateEffects).push(() => {
        try {
          let result = cb(this);
          return result instanceof Promise ? result.then(res, rej) : res(result), result;
        } catch (error2) {
          throw rej(error2), error2;
        }
      }), inTr || walkLateEffects());
    });
  }, subscribe(atom2, cb = atom2) {
    if (assertFunction(cb), atom2 === cb) return logsListeners.add(cb), () => logsListeners.delete(cb);
    let { __reatom: proto } = atom2, lastState = impossibleValue, listener = (state) => Object.is(lastState, state) || cb(lastState = state), cache = read(proto);
    return void 0 !== cache && isConnected$1(cache) ? cache.listeners.add(listener) : this.get(() => {
      cache = actualize(this, proto, (patchCtx, patch) => {
      }), cache.listeners.add(listener), trRollbacks.push(() => proto.patch.listeners.delete(listener)), null !== proto.connectHooks && nearEffects.push(...proto.connectHooks);
      for (let pubPatch of cache.pubs) connect(proto, pubPatch);
    }), lastState === impossibleValue && listener((proto.patch ?? read(proto)).state), () => {
      if (cache.listeners.delete(listener) && !isConnected$1(cache)) {
        proto.disconnectHooks && nearEffects.push(...proto.disconnectHooks);
        for (let pubCache of cache.pubs) disconnect(proto, pubCache);
        inTr || (trRollbacks.length = 0, walkLateEffects());
      }
    };
  }, cause: void 0 };
  return (ctx.cause = ctx.get(() => actualize(ctx, __root))).cause = null, ctx;
};
let i = 0, __count = (name) => `${name}#${++i}`;
function pipe() {
  return [].slice.call(arguments).reduce((acc, fn) => fn(acc), this);
}
function onChange(cb) {
  var _a;
  const hook = (ctx, patch) => cb(ctx, patch.state);
  return ((_a = this.__reatom).updateHooks ?? (_a.updateHooks = /* @__PURE__ */ new Set())).add(hook), () => this.__reatom.updateHooks.delete(hook);
}
function onCall(cb) {
  return this.onChange((ctx, state) => {
    const { params, payload } = state[state.length - 1];
    cb(ctx, payload, params);
  });
}
function atom(initState, name = __count("_atom")) {
  let theAtom = (ctx, update) => ctx.get((read, actualize) => actualize(ctx, theAtom.__reatom, (patchCtx, patch) => {
    patch.state = "function" == typeof update ? update(patch.state, patchCtx) : update;
  }).state), computer = null;
  return "function" == typeof initState && (theAtom = {}, computer = initState, initState = void 0), theAtom.__reatom = { name, isAction: false, patch: null, initState: () => initState, computer, connectHooks: null, disconnectHooks: null, updateHooks: null, actual: false }, theAtom.pipe = pipe, theAtom.onChange = onChange, 0 === experimental_PLUGINS.length ? theAtom : theAtom.pipe(...experimental_PLUGINS);
}
const action = (fn, name) => {
  void 0 !== fn && "string" != typeof fn || (name = fn, fn = (ctx, v2) => v2), assertFunction(fn);
  let actionAtom = atom([], name ?? __count("_action"));
  return actionAtom.__reatom.isAction = true, actionAtom.__reatom.unstable_fn = fn, Object.assign(function() {
    var params = [].slice.call(arguments);
    let state = actionAtom(params[0], (state2, patchCtx) => (params[0] = patchCtx, [...state2, { params: params.slice(1), payload: patchCtx.cause.proto.unstable_fn(...params) }]));
    return state[state.length - 1].payload;
  }, actionAtom, { onCall });
}, experimental_PLUGINS = [], __root = atom(void 0, "root").__reatom;
function pushUnique(list, el) {
  list.includes(el) || list.push(el);
}
function isString$1(thing) {
  return "string" == typeof thing;
}
function isObject$1(thing) {
  return "object" == typeof thing && null !== thing;
}
function isFunction(thing) {
  return "function" == typeof thing;
}
function isAtom(thing) {
  return isFunction(thing) && "types" in thing;
}
function isActionCreator(thing) {
  return isFunction(thing) && "type" in thing;
}
function isAction(thing) {
  return isObject$1(thing) && isString$1(thing.type) && "payload" in thing;
}
function getState(atom2, store2 = defaultStore) {
  return store2.getState(atom2);
}
const getRootCause$1 = (cause) => null === cause.cause ? cause : getRootCause$1(cause.cause), spyChange = (ctx, anAtom, handler) => {
  let isChanged = false;
  return ctx.spy(anAtom, (newState, prevState) => {
    isChanged = true, handler == null ? void 0 : handler(newState, prevState);
  }), isChanged;
};
atom(null, "initializations").__reatom.initState = () => /* @__PURE__ */ new WeakMap();
let atomsCount = 0;
function createAtom$1(dependencies, reducer, options = {}) {
  let { v3atom, id = (v3atom == null ? void 0 : v3atom.__reatom.name) ?? "atom" + ++atomsCount, store: store2 = defaultStore } = isString$1(options) ? { id: options } : options;
  const trackedTypes = [], types = [], actionCreators = {}, externalActions = {};
  throwReatomError(!isFunction(reducer) || !isString$1(id), "atom arguments"), Object.entries(dependencies).forEach(([name, dep]) => {
    if (throwReatomError(!isFunction(dep), `Invalid atom dependencies (type ${typeof dep}) at ${name}`), isAtom(dep)) dep.types.forEach((type) => pushUnique(types, type));
    else {
      let type;
      if (isActionCreator(dep)) type = (externalActions[name] = dep).type;
      else {
        type = `${name}_${id}`;
        const actionCreator = function() {
          return { payload: dep(...[].slice.call(arguments)), type, targets: [atom$1], v3action: actionCreator.v3action };
        };
        actionCreator.type = type, actionCreator.dispatch = function() {
          return store2.dispatch(actionCreator(...[].slice.call(arguments)));
        }, actionCreator.v3action = action(type), actionCreators[name] = actionCreator, "_" != name[0] && (atom$1[name] = actionCreator);
      }
      pushUnique(trackedTypes, type), pushUnique(types, type);
    }
  });
  const cacheReducer = /* @__PURE__ */ function(reducer2, dependencies2, trackedTypes2, actionCreators2, externalActions2) {
    const create2 = function(name) {
      return actionCreators2[name](...[].slice.call(arguments, 1));
    };
    return (v3ctx, state) => {
      const rootCause = getRootCause$1(v3ctx.cause);
      ctxs.has(rootCause) || ctxs.set(rootCause, /* @__PURE__ */ new WeakMap()), ctxs.get(rootCause).has(reducer2) || ctxs.get(rootCause).set(reducer2, {});
      const ctx = ctxs.get(rootCause).get(reducer2);
      return reducer2({ create: create2, get: (name) => v3ctx.spy(dependencies2[name].v3atom), getUnlistedState: (targetAtom) => v3ctx.get(targetAtom.v3atom), onAction: (name, reaction) => {
        const ac = externalActions2[name] ?? actionCreators2[name];
        throwReatomError(void 0 === ac, "Unknown action"), spyChange(v3ctx, ac.v3action, ({ payload }) => {
          reaction(payload);
        });
      }, onChange: (name, reaction) => {
        spyChange(v3ctx, dependencies2[name].v3atom, (prev, next) => reaction(prev, next));
      }, onInit: (cb) => {
        v3ctx.get((read) => read(v3ctx.cause.proto)) || cb();
      }, schedule: (effect) => v3ctx.schedule(() => effect(getRootCause$1(v3ctx.cause).v2store.dispatch, ctx, []), 2), v3ctx }, state);
    };
  }(reducer, dependencies, 0, actionCreators, externalActions);
  function atom$1(transaction) {
    return transaction.v3ctx.get(atom$1.v3atom);
  }
  return atom$1.id = id, atom$1.getState = () => store2.getState(atom$1), atom$1.subscribe = (cb) => store2.subscribe(atom$1, cb), atom$1.types = types, (atom$1.v3atom = v3atom ?? atom(cacheReducer, id)).__reatom.v2atom = atom$1, atom$1;
}
const ctxs = /* @__PURE__ */ new WeakMap();
function createStore({ callSafety = callSafely, v3ctx = createCtx({ callNearEffect: callSafety, callLateEffect: callSafety }) } = {}) {
  const store2 = { dispatch: (action2) => {
    const actions = Array.isArray(action2) ? action2 : [action2];
    throwReatomError(0 == actions.length || !actions.every(isAction), "dispatch arguments"), v3ctx.get(() => {
      actions.forEach((action3) => action3.v3action(v3ctx, action3.payload)), actions.forEach(({ targets }) => targets == null ? void 0 : targets.forEach((target) => v3ctx.get(target.v3atom)));
    });
  }, getCache: (atom2) => v3ctx.get((read) => read(atom2.v3atom.__reatom)), getState: (atom2) => v3ctx.get(atom2.v3atom), subscribe: (atom2, cb) => v3ctx.subscribe(atom2.v3atom, (state) => cb(state, [])), v3ctx };
  return getRootCause$1(v3ctx.cause).v2store = store2, store2;
}
const defaultStore = createStore();
let n = 0;
function r$1(r2, c2, o2 = "primitive" + ++n) {
  c2 ?? (c2 = { set: (e, t2) => t2, change: (e, t2) => t2(e) });
  let { decorators: u2, ...a2 } = isString$1(o2) ? { id: o2 } : o2;
  const l2 = createAtom$1(Object.keys(c2).reduce((e, t2) => (e[t2] = function() {
    return [].slice.call(arguments);
  }, e), {}), (e, t2 = r2) => {
    for (const n2 in c2) e.onAction(n2, (e2) => {
      t2 = c2[n2](t2, ...e2);
    });
    return t2;
  }, a2);
  return l2;
}
let c$1 = 0;
function o$1(e = false, t2 = "boolean" + ++c$1) {
  return r$1(e, { toggle: (e2) => !e2, setTrue: () => true, setFalse: () => false, change: (e2, t3) => t3(e2), set: (e2, t3) => t3 }, t2);
}
const noop$2 = () => {
}, isObject = (thing) => "object" == typeof thing && null !== thing, isShallowEqual = (a2, b2, is = Object.is) => {
  if (Object.is(a2, b2)) return true;
  if (!isObject(a2) || !isObject(b2) || a2.__proto__ !== b2.__proto__ || a2 instanceof Error) return false;
  if (Symbol.iterator in a2) {
    let equal2 = a2 instanceof Map ? (a3, b3) => is(a3[0], b3[0]) && is(a3[1], b3[1]) : is, aIter = a2[Symbol.iterator](), bIter = b2[Symbol.iterator]();
    for (; ; ) {
      let aNext = aIter.next(), bNext = bIter.next();
      if (aNext.done || bNext.done || !equal2(aNext.value, bNext.value)) return aNext.done && bNext.done;
    }
  }
  if (a2 instanceof Date) return a2.getTime() === b2.getTime();
  if (a2 instanceof RegExp) return String(a2) === String(b2);
  for (let k2 in a2) if (k2 in b2 == 0 || !is(a2[k2], b2[k2])) return false;
  return Object.keys(a2).length === Object.keys(b2).length;
}, isDeepEqual = (a2, b2) => {
  const visited = /* @__PURE__ */ new WeakMap(), is = (a3, b3) => {
    if (isObject(a3)) {
      if (visited.has(a3)) return visited.get(a3) === b3;
      visited.set(a3, b3);
    }
    return isShallowEqual(a3, b3, is);
  };
  return isShallowEqual(a2, b2, is);
}, assign = Object.assign, merge = function() {
  return Object.assign({}, ...[].slice.call(arguments));
};
const { toString } = Object.prototype, toAbortError = (reason) => {
  if (reason instanceof Error == 0 || "AbortError" !== reason.name) {
    if (reason instanceof Error) {
      var options = { cause: reason };
      reason = reason.message;
    } else reason = isObject(reason) ? toString.call(reason) : String(reason);
    "undefined" == typeof DOMException ? (reason = new Error(reason, options)).name = "AbortError" : reason = assign(new DOMException(reason, "AbortError"), options);
  }
  return reason;
}, throwIfAborted = (controller) => {
  if (controller == null ? void 0 : controller.signal.aborted) throw toAbortError(controller.signal.reason);
}, isAbort = (thing) => thing instanceof Error && "AbortError" === thing.name, setTimeout$1 = Object.assign(function() {
  const intervalId = globalThis.setTimeout(...[].slice.call(arguments));
  return "number" == typeof intervalId ? intervalId : Object.assign(intervalId, { toJSON: () => -1 });
}, globalThis.setTimeout), MAX_SAFE_TIMEOUT = 2 ** 31 - 1;
function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }
  return result && result.then ? result.then(void 0, recover) : result;
}
class CauseContext extends WeakMap {
  has(cause) {
    return super.has(cause) || null !== cause.cause && this.has(cause.cause);
  }
  get(cause) {
    for (; !super.has(cause) && cause.cause; ) cause = cause.cause;
    return super.get(cause);
  }
}
const abortCauseContext = new CauseContext(), getTopController = (patch) => abortCauseContext.get(patch) ?? null, onCtxAbort = (ctx, cb) => {
  const controller = getTopController(ctx.cause);
  if (controller) {
    const handler = () => cb(toAbortError(controller.signal.reason)), cleanup = () => controller.signal.removeEventListener("abort", handler);
    if (!controller.signal.aborted) return controller.signal.addEventListener("abort", handler), cleanup;
    handler();
  }
}, CHAINS = /* @__PURE__ */ new WeakMap(), __thenReatomed = (ctx, origin, onFulfill, onReject) => {
  let chain = CHAINS.get(origin);
  if (!chain) {
    const promise = origin.then((value) => (ctx.get((read, actualize) => chain.then.forEach((cb) => cb(value, read, actualize))), value), (error2) => {
      throw ctx.get((read, actualize) => chain.catch.forEach((cb) => cb(error2, read, actualize))), isAbort(error2) && promise.catch(noop$2), error2;
    });
    CHAINS.set(origin, chain = { promise, then: [], catch: [] }), CHAINS.set(promise, chain);
  }
  return onFulfill && chain.then.push(onFulfill), onReject && chain.catch.push(onReject), chain.promise;
}, withAbortableSchedule = (ctx) => {
  const { schedule } = ctx;
  return merge(ctx, { schedule(cb, step = 1) {
    const _this = this;
    if (step < 1) return schedule.call(this, cb, step);
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res, reject = rej;
    }), unabort = onCtxAbort(this, (error2) => {
      promise.catch(noop$2), reject(error2);
    });
    return schedule.call(this, function(_ctx) {
      try {
        let _temp3 = function() {
          unabort == null ? void 0 : unabort();
        };
        const _temp2 = _catch(function() {
          const controller = getTopController(_this.cause);
          return throwIfAborted(controller), Promise.resolve(cb(_ctx)).then(function(value) {
            throwIfAborted(controller), resolve(value);
          });
        }, function(error2) {
          reject(error2);
        });
        return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(_temp3) : _temp3());
      } catch (e) {
        return Promise.reject(e);
      }
    }, step).catch((error2) => {
      reject(error2), unabort == null ? void 0 : unabort();
    }), promise;
  } });
}, _spawn = action(function(ctx, fn, controller) {
  return abortCauseContext.set(ctx.cause, controller), fn(ctx, ...[].slice.call(arguments, 3));
}, "_spawn"), spawn = (ctx, fn, args = [], controller = new AbortController()) => _spawn(ctx, fn, controller, ...args);
const getRootCause = (cause) => null === cause.cause ? cause : getRootCause(cause.cause), isSameCtx = (ctx1, ctx2) => getRootCause(ctx1.cause) === getRootCause(ctx2.cause), addOnConnect = (anAtom, cb) => {
  var _a;
  return ((_a = anAtom.__reatom).connectHooks ?? (_a.connectHooks = /* @__PURE__ */ new Set())).add(cb);
}, addOnDisconnect = (anAtom, cb) => {
  var _a;
  return ((_a = anAtom.__reatom).disconnectHooks ?? (_a.disconnectHooks = /* @__PURE__ */ new Set())).add(cb);
}, _onConnect = action((ctx, anAtom, fn, controller) => {
  ctx.cause.cause = getRootCause(ctx.cause), abortCauseContext.set(ctx.cause, controller);
  const result = fn(withAbortableSchedule({ ...ctx, controller, isConnected: () => isConnected(ctx, anAtom) }));
  return result instanceof Promise && controller.signal.addEventListener("abort", () => result.catch(noop$2)), result;
}, "_onConnect"), onConnect = (anAtom, cb) => {
  const connectHook = (ctx) => {
    const controller = new AbortController(), cleanup = _onConnect(ctx, anAtom, cb, controller);
    cleanup instanceof Promise && cleanup.catch(noop$2);
    const cleanupHook = (_ctx) => {
      isSameCtx(ctx, _ctx) && disconnectHooks.delete(cleanupHook) && connectHooks.has(connectHook) && (controller.abort(toAbortError(`${anAtom.__reatom.name} disconnect`)), "function" == typeof cleanup && cleanup());
    }, disconnectHooks = addOnDisconnect(anAtom, cleanupHook);
  }, connectHooks = addOnConnect(anAtom, connectHook);
  return () => connectHooks.delete(connectHook);
}, isConnected = (ctx, { __reatom: proto }) => ctx.get((read) => {
  const cache = proto.patch ?? read(proto);
  return !!cache && cache.subs.size + cache.listeners.size > 0;
}), initializations = atom(null, "initializations");
initializations.__reatom.initState = () => /* @__PURE__ */ new WeakMap();
const withAssign = (getProps) => (target) => assign(target, getProps(target, target.__reatom.name)), reatomMap = (initState = /* @__PURE__ */ new Map(), name) => atom(initState, name).pipe(withAssign((target, name2) => {
  const getOrCreate = action((ctx, key, value) => (actions.set(ctx, key, value), value), `${name2}.getOrCreate`), actions = { get: (ctx, key) => ctx.get(target).get(key), getOrCreate: (ctx, key, creator) => actions.has(ctx, key) ? actions.get(ctx, key) : getOrCreate(ctx, key, creator()), has: (ctx, key) => ctx.get(target).has(key), set: action((ctx, key, value) => target(ctx, (prev) => {
    const valuePrev = prev.get(key);
    return Object.is(valuePrev, value) && (void 0 !== value || prev.has(key)) ? prev : new Map(prev).set(key, value);
  }), `${name2}.set`), delete: action((ctx, key) => target(ctx, (prev) => {
    if (!prev.has(key)) return prev;
    const next = new Map(prev);
    return next.delete(key), next;
  }), `${name2}.delete`), clear: action((ctx) => target(ctx, /* @__PURE__ */ new Map()), `${name2}.clear`), reset: action((ctx) => target(ctx, initState), `${name2}.reset`) };
  return actions;
}));
const handleEffect = (anAsync, params, { shouldPending = true, shouldFulfill = true, shouldReject = true, effect = anAsync.__reatom.unstable_fn } = {}) => {
  const pendingAtom = anAsync.pendingAtom, [ctx] = params;
  shouldPending && pendingAtom(ctx, (s2) => ++s2);
  const origin = ctx.schedule(() => new Promise((res, rej) => {
    throwIfAborted(ctx.controller), effect(...params).then(res, rej), ctx.controller.signal.addEventListener("abort", () => rej(toAbortError(ctx.controller.signal.reason)));
  }));
  return assign(__thenReatomed(ctx, origin, (v2) => {
    shouldFulfill && anAsync.onFulfill(ctx, v2), shouldPending && pendingAtom(ctx, (s2) => --s2);
  }, (e) => {
    shouldReject && !isAbort(e) && anAsync.onReject(ctx, e), shouldPending && pendingAtom(ctx, (s2) => --s2);
  }), { controller: ctx.controller });
}, NOOP_TIMEOUT_ID = -1, withCache = ({ ignoreAbort = true, length = 5, paramsLength, staleTime = 3e5, swr: swrOptions = true, withPersist, paramsToKey, isEqual = (ctx, a2, b2) => isDeepEqual(a2, b2) } = {}) => (anAsync) => {
  if (!anAsync.cacheAtom) {
    const swr = !!swrOptions, { shouldPending = false, shouldFulfill = swr, shouldReject = false } = swrOptions;
    Infinity !== staleTime && (staleTime = Math.min(MAX_SAFE_TIMEOUT, staleTime));
    const find = paramsToKey ? (ctx, params, state = ctx.get(cacheAtom)) => {
      const key = paramsToKey(ctx, params);
      return { cached: state.get(key), key };
    } : (ctx, params, state = ctx.get(cacheAtom)) => {
      for (const [key, cached] of state) if (isEqual(ctx, key, params)) return { cached, key };
      return { cached: void 0, key: params };
    }, findLatestWithValue = (ctx, state = ctx.get(cacheAtom)) => {
      for (const cached of state.values()) if (cached.version > 0 && (!latestCached || cached.lastUpdate > latestCached.lastUpdate)) var latestCached = cached;
      return latestCached;
    }, deleteOldest = (cache) => {
      for (const [key, cached] of cache) if (!oldestCached || oldestCached.lastUpdate > cached.lastUpdate) var oldestKey = key, oldestCached = cached;
      oldestCached && cache.delete(oldestKey);
    }, planCleanup = (ctx, key, time = staleTime) => {
      var _a;
      const clearTimeoutId = Infinity === staleTime ? NOOP_TIMEOUT_ID : setTimeout$1(() => {
        var _a2;
        ((_a2 = cacheAtom.get(ctx, key)) == null ? void 0 : _a2.clearTimeoutId) === clearTimeoutId && cacheAtom.delete(ctx, key);
      }, time);
      return (_a = clearTimeoutId.unref) == null ? void 0 : _a.call(clearTimeoutId), ctx.schedule(() => clearTimeout(clearTimeoutId), -1), clearTimeoutId;
    }, cacheAtom = anAsync.cacheAtom = reatomMap(/* @__PURE__ */ new Map(), `${anAsync.__reatom.name}._cacheAtom`).pipe(withAssign((target, name) => ({ setWithParams: action((ctx, params, value) => {
      const { cached, key } = find(ctx, params);
      cacheAtom.set(ctx, key, { clearTimeoutId: planCleanup(ctx, key), promise: void 0, value, version: cached ? cached.version + 1 : 1, controller: new AbortController(), lastUpdate: Date.now(), params });
    }), deleteWithParams: action((ctx, params) => {
      const { cached, key } = find(ctx, params);
      cached && cacheAtom.delete(ctx, key);
    }) })));
    cacheAtom.invalidate = action((ctx) => {
      const latest = findLatestWithValue(ctx);
      return cacheAtom.clear(ctx), "promiseAtom" in anAsync ? anAsync(ctx) : latest ? anAsync(ctx, ...latest.params) : null;
    }, `${cacheAtom.__reatom.name}.invalidate`), cacheAtom.options = { ignoreAbort, length, paramsLength, staleTime, swr, withPersist }, withPersist && cacheAtom.pipe(withPersist({ key: cacheAtom.__reatom.name, fromSnapshot: (ctx, snapshot, state = /* @__PURE__ */ new Map()) => {
      if (snapshot.length <= (state == null ? void 0 : state.size) && snapshot.every(([, { params, value }]) => {
        const { cached } = find(ctx, params, state);
        return !!cached && isDeepEqual(cached.value, value);
      })) return state;
      const newState = new Map(snapshot);
      for (const [key, rec] of newState) staleTime - (Date.now() - rec.lastUpdate) <= 0 ? newState.delete(key) : rec.clearTimeoutId = planCleanup(ctx, key, staleTime - (Date.now() - rec.lastUpdate));
      for (const [key, rec] of state) if (rec.promise) {
        const { cached } = find(ctx, rec.params, newState);
        cached ? cached.promise = rec.promise : newState.set(key, rec);
      }
      return newState;
    }, time: Math.min(staleTime, MAX_SAFE_TIMEOUT), toSnapshot: (ctx, cache) => [...cache].filter(([, rec]) => !rec.promise) }));
    const swrPendingAtom = anAsync.swrPendingAtom = atom(0, `${anAsync.__reatom.name}.swrPendingAtom`), handlePromise = (ctx, key, cached, swr2) => {
      cached.clearTimeoutId = planCleanup(ctx, key);
      const isSame = () => {
        var _a;
        return ((_a = cacheAtom.get(ctx, key)) == null ? void 0 : _a.clearTimeoutId) === cached.clearTimeoutId;
      }, { unstable_fn } = anAsync.__reatom;
      let res, rej;
      return cached.promise = new Promise(function() {
        return [res, rej] = [].slice.call(arguments);
      }), function() {
        try {
          let _temp2 = function() {
            return cached.promise;
          };
          var a2;
          a2 = [].slice.call(arguments);
          const _temp = function(body, recover) {
            try {
              var result = Promise.resolve(ignoreAbort ? spawn(a2[0], function(ctx2) {
                return unstable_fn({ ...ctx2, controller: getTopController(ctx2.cause) }, ...[].slice.call(arguments, 1));
              }, a2.slice(1)) : unstable_fn(...a2)).then(function(value) {
                res(value), ctx.get(() => {
                  isSame() && cacheAtom.set(ctx, key, { ...cached, promise: void 0, value, version: cached.version + 1 }), swr2 && swrPendingAtom(ctx, (s2) => s2 - 1);
                });
              });
            } catch (e) {
              return recover(e);
            }
            return result && result.then ? result.then(void 0, recover) : result;
          }(0, function(error2) {
            rej(error2), ctx.get(() => {
              isSame() && (cached.version > 0 ? cacheAtom.set(ctx, key, { ...cached, promise: void 0 }) : cacheAtom.delete(ctx, key)), swr2 && swrPendingAtom(ctx, (s2) => s2 - 1);
            });
          });
          return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2());
        } catch (e) {
          return Promise.reject(e);
        }
      };
    };
    if (anAsync._handleCache = action(function() {
      var params = [].slice.call(arguments);
      const [ctx] = params, controller = getTopController(ctx.cause.cause);
      abortCauseContext.set(ctx.cause, ctx.controller = controller);
      const paramsKey = params.slice(1, 1 + (paramsLength ?? params.length));
      let { cached = { clearTimeoutId: NOOP_TIMEOUT_ID, promise: void 0, value: void 0, version: 0, controller, lastUpdate: -1, params: [] }, key } = find(ctx, paramsKey);
      const prevController = cached.controller;
      cached = { ...cached, lastUpdate: Date.now(), params: paramsKey, controller };
      const cache = cacheAtom.set(ctx, key, cached);
      return cache.size > length && deleteOldest(cache), 0 === cached.version && !cached.promise || cached.promise && prevController.signal.aborted ? handleEffect(anAsync, params, { effect: handlePromise(ctx, key, cached, false) }) : (cached.version > 0 && anAsync.onFulfill(ctx, cached.value), cached.promise || !swr ? handleEffect(anAsync, params, { effect: function() {
        try {
          return Promise.resolve(cached.promise ?? cached.value);
        } catch (e) {
          return Promise.reject(e);
        }
      }, shouldPending: false, shouldFulfill, shouldReject }) : (swr && swrPendingAtom(ctx, (s2) => s2 + 1), handleEffect(anAsync, params, { effect: handlePromise(ctx, key, cached, swr), shouldPending, shouldFulfill, shouldReject })));
    }, `${anAsync.__reatom.name}._handleCache`), "dataAtom" in anAsync) {
      const { initState } = anAsync.dataAtom.__reatom;
      anAsync.dataAtom.__reatom.initState = (ctx) => {
        const cached = findLatestWithValue(ctx), iniState = initState(ctx);
        return cached ? anAsync.dataAtom.mapFulfill ? anAsync.dataAtom.mapFulfill(ctx, cached.value, iniState) : cached.value : iniState;
      };
    }
    withPersist && "dataAtom" in anAsync && onConnect(anAsync.dataAtom, (ctx) => ctx.subscribe(cacheAtom, () => {
    }));
  }
  return anAsync;
}, resolved = /* @__PURE__ */ new WeakSet(), reatomResource = (asyncComputed, name = __count("asyncAtom")) => {
  const promises = new CauseContext(), theAsync = reatomAsync((ctx) => {
    const promise = promises.get(ctx.cause);
    return throwReatomError(!promise, "reaction manual call"), promise;
  }, name), promiseAtom = atom((_ctx, state) => {
    if (state && !_ctx.cause.pubs.length) return state;
    const params = [], ctx = merge(_ctx, { spy(anAtom, cb) {
      throwReatomError(cb, "spy reactions are unsupported in ResourceAtom");
      const value = _ctx.spy(anAtom);
      return params.push(value), value;
    } }), controller = new AbortController(), unabort = onCtxAbort(ctx, (error2) => {
      isConnected(ctx, theReaction) || controller.abort(error2);
    });
    unabort && controller.signal.addEventListener("abort", unabort), abortCauseContext.set(ctx.cause, ctx.controller = controller);
    const computedPromise = asyncComputed(withAbortableSchedule(ctx));
    computedPromise.catch(noop$2), promises.set(ctx.cause, computedPromise);
    const pendingBefore = ctx.get(theAsync.pendingAtom), fulfillCallsBefore = ctx.get(theAsync.onFulfill);
    let promise = theAsync(ctx, ...params);
    promise.controller.signal.addEventListener("abort", () => {
      var _a;
      ((_a = theReaction.cacheAtom) == null ? void 0 : _a.options.ignoreAbort) || controller.abort(promise.controller.signal.reason);
    });
    const cached = pendingBefore === ctx.get(theAsync.pendingAtom), fulfillCalls = ctx.get(theAsync.onFulfill);
    return cached && controller.abort(toAbortError("cached")), cached && fulfillCallsBefore !== fulfillCalls && (promise = Object.assign(Promise.resolve(fulfillCalls[fulfillCalls.length - 1].payload), { controller })), __thenReatomed(ctx, promise, () => resolved.add(promise), () => resolved.add(promise)).catch(noop$2), state == null ? void 0 : state.controller.abort(toAbortError("concurrent")), promise;
  }, `${name}._promiseAtom`);
  onConnect(theAsync, (ctx) => ctx.subscribe(promiseAtom, noop$2)), onConnect(promiseAtom, (ctx) => () => {
    ctx.get((read) => {
      var _a;
      const state = (_a = read(promiseAtom.__reatom)) == null ? void 0 : _a.state;
      state == null ? void 0 : state.controller.abort(ctx.controller.signal.reason), resolved.has(state) || reset(ctx, promiseAtom.__reatom, ctx.controller.signal.reason);
    });
  });
  const theReaction = Object.assign((ctx) => ctx.get((read, actualize) => {
    var _a;
    reset(ctx, promiseAtom.__reatom, toAbortError("force")), actualize(ctx, promiseAtom.__reatom, noop$2);
    const state = ctx.get(theAsync), payload = (_a = state[state.length - 1]) == null ? void 0 : _a.payload;
    return throwReatomError(!payload, "unexpectedly failed invalidation. Please, report the issue"), payload;
  }), theAsync, { promiseAtom, init: (ctx) => ctx.subscribe(promiseAtom, noop$2), reset: action((ctx) => {
    reset(ctx, promiseAtom.__reatom, toAbortError("reset"));
  }, `${name}.reset`) });
  return Object.defineProperty(theAsync, "_handleCache", { get: () => theReaction._handleCache }), theReaction;
}, reset = (ctx, proto, reason) => ctx.get((read, actualize) => {
  if (read(proto)) {
    const { computer } = proto;
    proto.computer = null;
    try {
      actualize(ctx, proto, (patchCtx, patch) => {
        var _a;
        (_a = patch.state) == null ? void 0 : _a.controller.abort(reason), patch.pubs = [], patch.state = void 0;
      });
    } finally {
      proto.computer = computer;
    }
  }
}), reatomAsync = (effect, options = {}) => {
  const { name = __count("async"), onEffect: onEffectHook, onFulfill: onFulfillHook, onReject: onRejectHook, onSettle: onSettleHook } = "string" == typeof options ? { name: options } : options, pendingAtom = atom(0, `${name}.pendingAtom`), theAsync = Object.assign(function() {
    var params = [].slice.call(arguments);
    return params[0].get((read, actualize) => {
      const { state } = actualize(params[0], theAsync.__reatom, (ctx, patch) => {
        abortCauseContext.set(ctx.cause, ctx.controller = new AbortController());
        const unabort = onCtxAbort(params[0], (error2) => {
          payload == null ? void 0 : payload.catch(noop$2), ctx.controller.abort(error2);
        });
        unabort && ctx.controller.signal.addEventListener("abort", unabort), params[0] = withAbortableSchedule(ctx);
        var payload = theAsync._handleCache ? theAsync._handleCache(...params) : handleEffect(theAsync, params);
        __thenReatomed(ctx, payload, void 0, () => {
          onReject.__reatom.updateHooks.size > 1 && payload.catch(noop$2);
        }), patch.state = [...patch.state, { params: params.slice(1), payload }];
      });
      return state[state.length - 1].payload;
    });
  }, action(effect, name)), onFulfill = action(`${name}.onFulfill`), onReject = action(`${name}.onReject`), onSettle = action(`${name}._onSettle`);
  return onFulfill.onCall((ctx) => onSettle(ctx)), onReject.onCall((ctx) => onSettle(ctx)), onEffectHook && theAsync.onCall((ctx, promise, params) => onEffectHook(ctx, params, promise)), onFulfillHook && onFulfill.onCall(onFulfillHook), onRejectHook && onReject.onCall(onRejectHook), onSettleHook && onSettle.onCall(onSettleHook), onConnect(pendingAtom, (ctx) => ctx.subscribe(theAsync, noop$2)), assign(theAsync, { onFulfill, onReject, onSettle, pendingAtom });
};
reatomAsync.from = (effect, options = {}) => (effect.name.length > 2 && ("object" == typeof options ? options.name ?? (options.name = effect.name) : options ?? (options = effect.name)), reatomAsync(function(ctx) {
  return effect(...[].slice.call(arguments, 1));
}, options));
const withDataAtom = (initState, mapFulfill) => (anAsync) => {
  if (!anAsync.dataAtom) {
    const dataAtom = anAsync.dataAtom = Object.assign(atom(initState, `${anAsync.__reatom.name}.dataAtom`), { reset: action((ctx) => {
      dataAtom(ctx, initState);
    }, `${anAsync.__reatom.name}.dataAtom.reset`), mapFulfill });
    dataAtom.__reatom.computer = (ctx, state) => (ctx.spy(anAsync.onFulfill, ({ payload }) => {
      state = payload;
    }), state), anAsync.onFulfill.onCall((ctx) => {
      ctx.get(dataAtom);
    }), onConnect(dataAtom, (ctx) => ctx.subscribe(anAsync, noop$2));
  }
  return anAsync;
};
const getCause = (patch, log = "") => log.length > 1e4 ? `${log} ...` : null !== patch.cause && patch.cause.proto !== __root ? getCause(patch.cause, log + " <-- " + (patch.cause.proto.name ?? "unnamed")) : log || "root", getTimeStampDefault = () => {
  let ms = (/* @__PURE__ */ new Date()).getMilliseconds();
  return ms = ms.toString().padStart(3, "0"), `${(/* @__PURE__ */ new Date()).toLocaleTimeString()} ${ms}ms`;
};
let timesPrecision = 10 ** 15;
const createLogBatched = ({ debounce = 500, getTimeStamp = getTimeStampDefault, limit = 5e3, log = console.log, domain = "", shouldGroup = false, shouldLogGraph = false } = {}) => {
  domain && (domain = `(${domain}) `);
  let queue = [], isBatching = false, batchingStart = Date.now();
  return (msg) => {
    0 !== Object.keys(msg.changes).length && (isBatching || (isBatching = true, batchingStart = Date.now()), setTimeout((length) => {
      if (isBatching = queue.length !== length && Date.now() - batchingStart < limit, isBatching) return;
      const isFewTransactions = queue.length > 0;
      console.groupCollapsed(`Reatom ${domain}${length} transaction${length > 1 ? "s" : ""}`), shouldLogGraph && ((logsSet) => {
        const visited = /* @__PURE__ */ new Set(), checkCause = (patch) => {
          !patch.cause || patch.cause.proto === __root || patch.cause.proto.name.startsWith("_") && patch.cause.proto.name.includes("._") || logsSet.has(patch.cause) || visited.has(patch.cause) || (checkCause(patch.cause), visited.add(patch.cause));
        };
        for (const patch of logsSet) checkCause(patch);
        const logs = [...logsSet], maxDistance = logs.reduce((acc, patch, i2) => Math.max(acc, i2 - ((patch.cause && logs.indexOf(patch.cause)) ?? i2)), 0), shiftRatio = 20 * maxDistance, x2 = Math.floor(maxDistance / logs.length * shiftRatio) + 20;
        let y2 = 30, body = "", width = x2;
        for (const patch of logs) {
          const { isAction: isAction2, name } = patch.proto, color = isAction2 ? name.endsWith(".onFulfill") ? "#E6DC73" : "#ffff80" : "#151134";
          body += `<circle cx="${x2}" cy="${y2}" r="10" fill="${color}" />`, body += `<text x="${x2 + 15}" y="${y2 + 5}" font-size="10" fill="gray">${name}</text>`, y2 += 30, width = Math.max(width, x2 + 10 * name.length);
        }
        logs.forEach(({ cause }, idx) => {
          if (!cause || cause.proto === __root || 0 === idx) return;
          const causeIdx = logs.indexOf(cause);
          if (causeIdx < 0) return;
          const causeY = 30 * causeIdx + 30, shiftX = Math.floor(x2 - (idx - causeIdx) / logs.length * shiftRatio - 10), shiftY = Math.floor(30 * (causeIdx + (idx - causeIdx) / 2)) + 30, idxY = 30 * idx + 30, lineX = Math.floor(x2 - 10);
          body += `<polyline points="${lineX},${causeY} ${shiftX},${shiftY} ${lineX},${idxY}" stroke="gray" fill="none" />`;
        });
        const dataUrl = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${y2}" style="font-family: monospace;">${body}</svg>`)}`;
        console.log("%c                         ", `font-size:${y2}px; background: url(${dataUrl}) no-repeat; font-family: monospace;`);
      })(new Set(queue.flatMap(({ changes }) => Object.values(changes)).sort((a2, b2) => a2.time - b2.time).map(({ patch }) => patch)));
      for (const { changes, time, error: error2 } of queue) {
        console.log(`%c ${time}`, `padding-left: calc(50% - ${time.length / 2}em); font-size: 0.7rem;`), error2 && console.error(error2);
        let inGroup = false;
        Object.entries(changes).forEach(([k2, change], i2, arr) => {
          var _a;
          const isAction2 = "payload" in change, style = (isAction2 ? "background: #ffff80; color: #151134;" : "background: #151134; color: white;") + "font-weight: 400; padding: 0.15em;  padding-right: 1ch;", name = k2.replace(/(\d)*\./, ""), head2 = name.replace(/\..*/, ""), nextK = (_a = arr[i2 + 1]) == null ? void 0 : _a[0], nextName = nextK == null ? void 0 : nextK.replace(/(\d)*\./, ""), isGroup = nextName == null ? void 0 : nextName.startsWith(head2);
          shouldGroup && !inGroup && isGroup && isFewTransactions && (inGroup = true, console.groupCollapsed(`%c ${head2}`, style));
          const data = isAction2 ? change.payload : change.newState;
          console.groupCollapsed(`%c ${name}`, style), console.log(change), console.groupEnd(), isAction2 && !isShallowEqual(change.params, [data]) && log(...change.params), log(data), shouldGroup && !isGroup && inGroup && (inGroup = false, console.groupEnd());
        });
      }
      console.log("\n\n", "transactions:", queue), console.groupEnd(), queue = [];
    }, debounce, queue.push(Object.assign(msg, { time: getTimeStamp() }))));
  };
}, connectLogger = (ctx, { devtools = false, historyLength = 10, domain = "", log = createLogBatched({ domain }), showCause = true, skip = () => false, skipUnnamed = true } = {}) => {
  const history = /* @__PURE__ */ new WeakMap();
  let read;
  ctx.get((r2) => read = r2);
  const ctxUnsubscribe = ctx.subscribe((logs, error2) => {
    let i2 = -1;
    try {
      const states = /* @__PURE__ */ new WeakMap(), changes = {};
      for (; ++i2 < logs.length; ) {
        const patch = logs[i2], { cause, proto, state } = patch, { isAction: isAction2 } = proto;
        let { name } = proto;
        if (skip(patch)) continue;
        if (!name || name.startsWith("_") || /\._/.test(name)) {
          if (skipUnnamed) continue;
          name ?? (name = "unnamed");
        }
        const oldCache = read(proto), oldState = states.has(proto) ? states.get(proto) : oldCache == null ? void 0 : oldCache.state;
        if (states.set(proto, state), Object.is(state, oldState) || isAction2 && 0 === state.length) continue;
        let atomHistory = history.get(proto) ?? [];
        if (historyLength && (atomHistory = atomHistory.slice(0, historyLength - 1), atomHistory.unshift(isAction2 ? { ...patch, state: [...state] } : patch), history.set(proto, atomHistory)), !(oldCache || "root" !== cause.proto.name || isAction2 && 0 !== state.length)) continue;
        const changeMsg = changes[`${i2 + 1}.${name}`] = { patch, history: atomHistory, time: (globalThis.performance ?? Date).now() + 1 / timesPrecision-- };
        if (isAction2) {
          const call = state.at(-1);
          changeMsg.params = call.params, changeMsg.payload = call.payload;
        } else changeMsg.newState = state, changeMsg.oldState = oldState;
        changeMsg.patch = patch, showCause && (changeMsg.cause = getCause(patch));
      }
      log({ error: error2, changes, logs, ctx });
    } catch (error3) {
      console.error("Reatom/logger error with", logs[i2]), console.log(error3);
    }
  });
  return () => {
    ctxUnsubscribe();
  };
};
const METRICS_EVENT = "METRICS";
function dispatchMetricsEvent(name, payload) {
  if (!globalThis.CustomEvent) return;
  const evt = new CustomEvent(METRICS_EVENT, {
    detail: {
      name,
      payload
    }
  });
  globalThis.dispatchEvent(evt);
}
class FallbackStorage {
  constructor() {
    __publicField(this, "storage", /* @__PURE__ */ new Map());
  }
  setItem(key, value) {
    this.storage.set(key, value);
  }
  getItem(key) {
    return this.storage.get(key);
  }
  removeItem(key) {
    this.storage.delete(key);
  }
  clear() {
    this.storage.clear();
  }
  get length() {
    return this.storage.size;
  }
  key(index2) {
    return this.storage.keys()[index2] ?? null;
  }
}
class StableStorage {
  constructor(type) {
    __publicField(this, "storage");
    if (this.storageAvailable(type)) {
      this.storage = globalThis[type];
    } else {
      this.storage = new FallbackStorage();
    }
  }
  storageAvailable(type) {
    try {
      const storage = globalThis[type];
      const x2 = "__storage_test__";
      storage.setItem(x2, x2);
      storage.removeItem(x2);
      return true;
    } catch (e) {
    }
  }
  setItem(key, value) {
    return this.storage.setItem(key, value);
  }
  getItem(key) {
    return this.storage.getItem(key);
  }
  get length() {
    return this.storage.length;
  }
  clear() {
    return this.storage.clear();
  }
  key(index2) {
    return this.storage.key(index2);
  }
  removeItem(key) {
    return this.storage.removeItem(key);
  }
}
new StableStorage("sessionStorage");
const localStorage$1 = new StableStorage("localStorage");
const KONTUR_DEBUG = !!localStorage$1.getItem("KONTUR_DEBUG");
!!localStorage$1.getItem("KONTUR_METRICS_DEBUG");
const KONTUR_WARN = !!localStorage$1.getItem("KONTUR_WARN");
const KONTUR_TRACE_TYPE = localStorage$1.getItem("KONTUR_TRACE_TYPE");
const KONTUR_TRACE_PATCH = !!localStorage$1.getItem("KONTUR_TRACE_PATCH");
const store = createStore({});
if (KONTUR_TRACE_PATCH) {
  connectLogger(store.v3ctx, {
    historyLength: 10,
    showCause: KONTUR_TRACE_PATCH,
    skipUnnamed: true,
    domain: "Kontur"
  });
}
store.v3ctx.subscribe((patches) => {
  patches == null ? void 0 : patches.forEach((patch) => {
    var _a;
    const atomName = (_a = patch.proto) == null ? void 0 : _a.name;
    if (atomName) {
      dispatchMetricsEvent(atomName, patch == null ? void 0 : patch.state);
      KONTUR_WARN && console.warn(atomName, patch);
      if (KONTUR_TRACE_TYPE) {
        if (atomName.includes(KONTUR_TRACE_TYPE)) {
          console.trace("TRACE:", atomName, patch);
        }
      }
    }
  });
});
const addStoreInOptions = (options) => ({
  store,
  ...typeof options === "string" ? { id: options } : options
});
const createAtom = (deps, reducer, options) => createAtom$1(deps, reducer, addStoreInOptions(options));
const createBooleanAtom = (initState, options) => o$1(initState, addStoreInOptions(options));
const JSON_MIME = "application/json";
const CONTENT_TYPE_HEADER = "Content-Type";
const FETCH_ERROR = Symbol();
const CATCHER_FALLBACK = Symbol();
function extractContentType(headers = {}) {
  var _a;
  const normalizedHeaders = headers instanceof Array ? Object.fromEntries(headers) : headers;
  return (_a = Object.entries(normalizedHeaders).find(([k2]) => k2.toLowerCase() === CONTENT_TYPE_HEADER.toLowerCase())) === null || _a === void 0 ? void 0 : _a[1];
}
function isLikelyJsonMime(value) {
  return /^application\/.*json.*/.test(value);
}
const mix = function(one, two, mergeArrays = false) {
  return Object.entries(two).reduce((acc, [key, newValue]) => {
    const value = one[key];
    if (Array.isArray(value) && Array.isArray(newValue)) {
      acc[key] = mergeArrays ? [...value, ...newValue] : newValue;
    } else if (typeof value === "object" && typeof newValue === "object") {
      acc[key] = mix(value, newValue, mergeArrays);
    } else {
      acc[key] = newValue;
    }
    return acc;
  }, { ...one });
};
const config$2 = {
  // Default options
  options: {},
  // Error type
  errorType: "text",
  // Polyfills
  polyfills: {
    // fetch: null,
    // FormData: null,
    // URL: null,
    // URLSearchParams: null,
    // performance: null,
    // PerformanceObserver: null,
    // AbortController: null,
  },
  polyfill(p2, doThrow = true, instance2 = false, ...args) {
    const res = this.polyfills[p2] || (typeof self !== "undefined" ? self[p2] : null) || (typeof global !== "undefined" ? global[p2] : null);
    if (doThrow && !res)
      throw new Error(p2 + " is not defined");
    return instance2 && res ? new res(...args) : res;
  }
};
function setOptions(options, replace = false) {
  config$2.options = replace ? options : mix(config$2.options, options);
}
function setPolyfills(polyfills, replace = false) {
  config$2.polyfills = replace ? polyfills : mix(config$2.polyfills, polyfills);
}
function setErrorType(errorType) {
  config$2.errorType = errorType;
}
const middlewareHelper = (middlewares) => (fetchFunction) => {
  return middlewares.reduceRight((acc, curr) => curr(acc), fetchFunction) || fetchFunction;
};
class WretchError extends Error {
}
const resolver = (wretch) => {
  const sharedState = /* @__PURE__ */ Object.create(null);
  wretch = wretch._addons.reduce((w2, addon) => addon.beforeRequest && addon.beforeRequest(w2, wretch._options, sharedState) || w2, wretch);
  const { _url: url, _options: opts, _config: config2, _catchers, _resolvers: resolvers, _middlewares: middlewares, _addons: addons } = wretch;
  const catchers = new Map(_catchers);
  const finalOptions = mix(config2.options, opts);
  let finalUrl = url;
  const _fetchReq = middlewareHelper(middlewares)((url2, options) => {
    finalUrl = url2;
    return config2.polyfill("fetch")(url2, options);
  })(url, finalOptions);
  const referenceError = new Error();
  const throwingPromise = _fetchReq.catch((error2) => {
    throw { [FETCH_ERROR]: error2 };
  }).then((response) => {
    var _a;
    if (!response.ok) {
      const err = new WretchError();
      err["cause"] = referenceError;
      err.stack = err.stack + "\nCAUSE: " + referenceError.stack;
      err.response = response;
      err.status = response.status;
      err.url = finalUrl;
      if (response.type === "opaque") {
        throw err;
      }
      const jsonErrorType = config2.errorType === "json" || ((_a = response.headers.get("Content-Type")) === null || _a === void 0 ? void 0 : _a.split(";")[0]) === "application/json";
      const bodyPromise = !config2.errorType ? Promise.resolve(response.body) : jsonErrorType ? response.text() : response[config2.errorType]();
      return bodyPromise.then((body) => {
        err.message = typeof body === "string" ? body : response.statusText;
        if (body) {
          if (jsonErrorType && typeof body === "string") {
            err.text = body;
            err.json = JSON.parse(body);
          } else {
            err[config2.errorType] = body;
          }
        }
        throw err;
      });
    }
    return response;
  });
  const catchersWrapper = (promise) => {
    return promise.catch((err) => {
      const fetchErrorFlag = Object.prototype.hasOwnProperty.call(err, FETCH_ERROR);
      const error2 = fetchErrorFlag ? err[FETCH_ERROR] : err;
      const catcher = (error2 === null || error2 === void 0 ? void 0 : error2.status) && catchers.get(error2.status) || catchers.get(error2 === null || error2 === void 0 ? void 0 : error2.name) || fetchErrorFlag && catchers.has(FETCH_ERROR) && catchers.get(FETCH_ERROR);
      if (catcher)
        return catcher(error2, wretch);
      const catcherFallback = catchers.get(CATCHER_FALLBACK);
      if (catcherFallback)
        return catcherFallback(error2, wretch);
      throw error2;
    });
  };
  const bodyParser = (funName) => (cb) => funName ? (
    // If a callback is provided, then callback with the body result otherwise return the parsed body itself.
    catchersWrapper(throwingPromise.then((_2) => _2 && _2[funName]()).then((_2) => cb ? cb(_2) : _2))
  ) : (
    // No body parsing method - return the response
    catchersWrapper(throwingPromise.then((_2) => cb ? cb(_2) : _2))
  );
  const responseChain = {
    _wretchReq: wretch,
    _fetchReq,
    _sharedState: sharedState,
    res: bodyParser(null),
    json: bodyParser("json"),
    blob: bodyParser("blob"),
    formData: bodyParser("formData"),
    arrayBuffer: bodyParser("arrayBuffer"),
    text: bodyParser("text"),
    error(errorId, cb) {
      catchers.set(errorId, cb);
      return this;
    },
    badRequest(cb) {
      return this.error(400, cb);
    },
    unauthorized(cb) {
      return this.error(401, cb);
    },
    forbidden(cb) {
      return this.error(403, cb);
    },
    notFound(cb) {
      return this.error(404, cb);
    },
    timeout(cb) {
      return this.error(408, cb);
    },
    internalError(cb) {
      return this.error(500, cb);
    },
    fetchError(cb) {
      return this.error(FETCH_ERROR, cb);
    }
  };
  const enhancedResponseChain = addons.reduce((chain, addon) => ({
    ...chain,
    ...typeof addon.resolver === "function" ? addon.resolver(chain) : addon.resolver
  }), responseChain);
  return resolvers.reduce((chain, r2) => r2(chain, wretch), enhancedResponseChain);
};
const core = {
  _url: "",
  _options: {},
  _config: config$2,
  _catchers: /* @__PURE__ */ new Map(),
  _resolvers: [],
  _deferred: [],
  _middlewares: [],
  _addons: [],
  addon(addon) {
    return { ...this, _addons: [...this._addons, addon], ...addon.wretch };
  },
  errorType(errorType) {
    return {
      ...this,
      _config: {
        ...this._config,
        errorType
      }
    };
  },
  polyfills(polyfills, replace = false) {
    return {
      ...this,
      _config: {
        ...this._config,
        polyfills: replace ? polyfills : mix(this._config.polyfills, polyfills)
      }
    };
  },
  url(_url, replace = false) {
    if (replace)
      return { ...this, _url };
    const split = this._url.split("?");
    return {
      ...this,
      _url: split.length > 1 ? split[0] + _url + "?" + split[1] : this._url + _url
    };
  },
  options(options, replace = false) {
    return { ...this, _options: replace ? options : mix(this._options, options) };
  },
  headers(headerValues) {
    const headers = !headerValues ? {} : Array.isArray(headerValues) ? Object.fromEntries(headerValues) : "entries" in headerValues ? Object.fromEntries(headerValues.entries()) : headerValues;
    return { ...this, _options: mix(this._options, { headers }) };
  },
  accept(headerValue) {
    return this.headers({ Accept: headerValue });
  },
  content(headerValue) {
    return this.headers({ [CONTENT_TYPE_HEADER]: headerValue });
  },
  auth(headerValue) {
    return this.headers({ Authorization: headerValue });
  },
  catcher(errorId, catcher) {
    const newMap = new Map(this._catchers);
    newMap.set(errorId, catcher);
    return { ...this, _catchers: newMap };
  },
  catcherFallback(catcher) {
    return this.catcher(CATCHER_FALLBACK, catcher);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resolve(resolver2, clear = false) {
    return { ...this, _resolvers: clear ? [resolver2] : [...this._resolvers, resolver2] };
  },
  defer(callback, clear = false) {
    return {
      ...this,
      _deferred: clear ? [callback] : [...this._deferred, callback]
    };
  },
  middlewares(middlewares, clear = false) {
    return {
      ...this,
      _middlewares: clear ? middlewares : [...this._middlewares, ...middlewares]
    };
  },
  fetch(method = this._options.method, url = "", body = null) {
    let base = this.url(url).options({ method });
    const contentType = extractContentType(base._options.headers);
    const formDataClass = this._config.polyfill("FormData", false);
    const jsonify = typeof body === "object" && !(formDataClass && body instanceof formDataClass) && (!base._options.headers || !contentType || isLikelyJsonMime(contentType));
    base = !body ? base : jsonify ? base.json(body, contentType) : base.body(body);
    return resolver(base._deferred.reduce((acc, curr) => curr(acc, acc._url, acc._options), base));
  },
  get(url = "") {
    return this.fetch("GET", url);
  },
  delete(url = "") {
    return this.fetch("DELETE", url);
  },
  put(body, url = "") {
    return this.fetch("PUT", url, body);
  },
  post(body, url = "") {
    return this.fetch("POST", url, body);
  },
  patch(body, url = "") {
    return this.fetch("PATCH", url, body);
  },
  head(url = "") {
    return this.fetch("HEAD", url);
  },
  opts(url = "") {
    return this.fetch("OPTIONS", url);
  },
  body(contents) {
    return { ...this, _options: { ...this._options, body: contents } };
  },
  json(jsObject, contentType) {
    const currentContentType = extractContentType(this._options.headers);
    return this.content(contentType || isLikelyJsonMime(currentContentType) && currentContentType || JSON_MIME).body(JSON.stringify(jsObject));
  }
};
function factory(_url = "", _options = {}) {
  return { ...core, _url, _options };
}
factory["default"] = factory;
factory.options = setOptions;
factory.errorType = setErrorType;
factory.polyfills = setPolyfills;
factory.WretchError = WretchError;
function stringify(value) {
  return typeof value !== "undefined" ? value : "";
}
const appendQueryParams = (url, qp, replace, omitUndefinedOrNullValues, config2) => {
  let queryString2;
  if (typeof qp === "string") {
    queryString2 = qp;
  } else {
    const usp = config2.polyfill("URLSearchParams", true, true);
    for (const key in qp) {
      const value = qp[key];
      if (omitUndefinedOrNullValues && (value === null || value === void 0))
        continue;
      if (qp[key] instanceof Array) {
        for (const val of value)
          usp.append(key, stringify(val));
      } else {
        usp.append(key, stringify(value));
      }
    }
    queryString2 = usp.toString();
  }
  const split = url.split("?");
  if (!queryString2)
    return replace ? split[0] : url;
  if (replace || split.length < 2)
    return split[0] + "?" + queryString2;
  return url + "&" + queryString2;
};
const queryString = {
  wretch: {
    query(qp, replace = false, omitUndefinedOrNullValues = false) {
      return { ...this, _url: appendQueryParams(this._url, qp, replace, omitUndefinedOrNullValues, this._config) };
    }
  }
};
const AUTH_REQUIREMENT = {
  MUST: "must",
  OPTIONAL: "optional",
  NEVER: "never"
};
const wait = (sec = 1, opt = {}) => new Promise(
  (res, rej) => setTimeout(
    (opt == null ? void 0 : opt.failWithMessage) ? () => rej({ message: opt.failWithMessage }) : res,
    sec * 1e3
  )
);
class ApiClientError extends Error {
  constructor(message, problem, status = 0) {
    super(message);
    __publicField(this, "problem");
    __publicField(this, "status", 0);
    this.problem = problem;
    this.status = status;
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }
}
function isApiError(error2) {
  return error2 instanceof ApiClientError;
}
function getApiErrorKind(error2) {
  return isApiError(error2) ? error2.problem.kind : null;
}
function parseApiError(errorObj) {
  var _a;
  if (errorObj == null ? void 0 : errorObj.json) {
    const errorData = errorObj == null ? void 0 : errorObj.json;
    if (errorData == null ? void 0 : errorData.message) return errorData.message;
    if (errorData == null ? void 0 : errorData.error_description) return errorData.error_description;
    if (errorData !== null) {
      if (Array.isArray(errorData)) {
        return errorData.map(
          (errorMsg) => errorMsg.name && errorMsg.message ? `${errorMsg.name}: ${errorMsg.message}` : errorMsg
        ).join("<br/>");
      }
      if (errorData == null ? void 0 : errorData.error) return errorData["error"];
      if ((errorData == null ? void 0 : errorData.errors) && Array.isArray(errorData["errors"])) {
        return errorData["errors"].reduce((acc, errorObj2) => {
          if (errorObj2 == null ? void 0 : errorObj2.message) {
            acc.push(errorObj2["message"]);
          }
          return acc;
        }, []).join("<br/>");
      }
    }
    return String(errorData);
  }
  let res = ((_a = errorObj == null ? void 0 : errorObj.response) == null ? void 0 : _a.statusText) ?? (errorObj == null ? void 0 : errorObj.message) ?? (errorObj == null ? void 0 : errorObj.text);
  if (res == null ? void 0 : res.startsWith("<html>")) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(res, "text/html");
    const title = doc.querySelector("title");
    res = title == null ? void 0 : title.innerText;
  }
  return res ?? "Unknown Error";
}
function createApiError(err) {
  var _a, _b;
  let errorMessage = "";
  let problem = { kind: "unknown", temporary: true };
  let status = 0;
  if (err instanceof ApiClientError) {
    return err;
  }
  if (KONTUR_DEBUG) {
    console.error("Raw error:", err);
  }
  if (err instanceof DOMException && err.name === "AbortError" || err instanceof factory.WretchError && err.name === "AbortError" || err instanceof factory.WretchError && err.cause instanceof DOMException && err.cause.name === "AbortError" || err instanceof factory.WretchError && err.message === "The operation was aborted" || err instanceof Error && err.name === "AbortError") {
    problem = { kind: "canceled" };
  } else if (err instanceof factory.WretchError) {
    status = err.status;
    if (status === 400) {
      problem = { kind: "bad-request" };
    } else if (status === 401) {
      problem = { kind: "unauthorized", data: (_a = err.json) == null ? void 0 : _a.error };
      if ((_b = err.json) == null ? void 0 : _b.message) {
        errorMessage = err.json.message;
      }
    } else if (status === 403) {
      problem = { kind: "forbidden" };
    } else if (status === 404) {
      problem = { kind: "not-found" };
    } else if (status === 408 || status === 504) {
      errorMessage = "Server not available, please try later";
      problem = { kind: "timeout", temporary: true };
    } else if (status >= 500) {
      problem = { kind: "server", data: (err == null ? void 0 : err.json) ?? (err == null ? void 0 : err.text) };
    }
  } else {
    problem = { kind: "client-unknown" };
  }
  if (!errorMessage) {
    errorMessage = parseApiError(err);
  }
  return new ApiClientError(errorMessage || "Unknown error", problem, status);
}
const ApiMethodTypes = {
  GET: "get",
  POST: "post",
  PUT: "put",
  PATCH: "patch",
  DELETE: "delete"
};
async function autoParseBody(res) {
  if (res.status === 204) {
    res.data = null;
    return res;
  }
  if (res.ok) {
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      res.data = await res.json();
    } else {
      res.data = await res.text();
    }
  }
  return res;
}
class ApiClient {
  constructor({ on } = {}) {
    __publicField(this, "AUTH_REQUIREMENT", AUTH_REQUIREMENT);
    __publicField(this, "listeners", {
      error: /* @__PURE__ */ new Set(),
      poolUpdate: /* @__PURE__ */ new Set(),
      idle: /* @__PURE__ */ new Set()
    });
    __publicField(this, "baseURL");
    __publicField(this, "requestPool", /* @__PURE__ */ new Map());
    __publicField(this, "authService");
    if (on) {
      Object.entries(on).forEach(
        ([event2, cb]) => {
          if (cb) this.on(event2, cb);
        }
      );
    }
  }
  on(event2, cb) {
    this.listeners[event2].add(cb);
    return () => {
      this.listeners[event2].delete(cb);
    };
  }
  _emit(type, payload) {
    this.listeners[type].forEach((l2) => l2(payload));
  }
  init(cfg) {
    let baseURL = cfg.baseUrl ?? "";
    this.baseURL = baseURL;
  }
  updateRequestPool(requestId, status) {
    if (status === null) {
      this.requestPool.delete(requestId);
    } else {
      this.requestPool.set(requestId, status);
    }
    this._emit("poolUpdate", new Map(this.requestPool));
    this._emit("idle", this.requestPool.size === 0);
  }
  /**
   * Makes an HTTP request with configurable authentication behavior
   * @template T - The expected response type
   * @param {ApiMethod} method - HTTP method to use
   * @param {string} path - Request URL or path
   * @param {unknown} [requestParams] - Query parameters or body data
   * @param {CustomRequestConfig} [requestConfig] - Additional request configuration
   * @param {AuthRequirement} [requestConfig.authRequirement] - Authentication requirement level:
   *   - MUST: Request will fail if user is not authenticated
   *   - OPTIONAL (default): Will attempt to use auth if available, but proceed without if not possible
   *   - NEVER: Explicitly prevents authentication
   * @returns {Promise<T | null>} The response data
   * @throws {ApiClientError} On request failure or auth requirement not met
   */
  async call(method, path2, requestParams, requestConfig = {}) {
    var _a;
    const RequestsWithBody = ["post", "put", "patch"];
    const requestId = Math.random().toString(36).substring(7);
    this.updateRequestPool(requestId, "pending");
    const { origin, pathname, search: search2 } = path2.startsWith("http") ? new URL(path2) : {
      origin: this.baseURL,
      pathname: path2,
      search: ""
    };
    let req = factory(origin, { mode: "cors" }).addon(queryString).url(pathname + search2);
    if (requestConfig.signal) {
      req = req.options({ signal: requestConfig.signal });
    }
    if (requestConfig.headers) {
      req = req.headers(requestConfig.headers);
    }
    let isAuthenticatedRequest = false;
    const authRequirement = requestConfig.authRequirement ?? AUTH_REQUIREMENT.OPTIONAL;
    if (authRequirement !== AUTH_REQUIREMENT.NEVER) {
      try {
        const requireAuth = authRequirement === AUTH_REQUIREMENT.MUST;
        const token = await this.authService.getAccessToken(requireAuth);
        if (token) {
          isAuthenticatedRequest = true;
          req = req.auth(`Bearer ${token}`);
        }
      } catch (error2) {
        if (authRequirement === AUTH_REQUIREMENT.OPTIONAL) {
          console.warn("Authentication failed but proceeding with request:", error2);
        } else {
          throw error2;
        }
      }
    }
    if (requestParams) {
      req = RequestsWithBody.includes(method) ? req.json(requestParams) : req.query(requestParams);
    }
    try {
      const response = await req[method]().res(autoParseBody);
      this.updateRequestPool(requestId, null);
      return response.data;
    } catch (err) {
      this.updateRequestPool(requestId, null);
      const apiError = createApiError(err);
      if (getApiErrorKind(apiError) === "canceled") {
        throw apiError;
      }
      if (isAuthenticatedRequest && getApiErrorKind(apiError) === "unauthorized") {
        try {
          const token = await this.authService.getAccessToken();
          if (!token) {
            throw apiError;
          }
        } catch (error2) {
          throw apiError;
        }
        throw apiError;
      }
      const defaultRetryConfig = {
        attempts: 0,
        delayMs: 1e3,
        onErrorKinds: ["timeout"]
      };
      const retryConfig = {
        ...defaultRetryConfig,
        ...requestConfig.retry,
        onErrorKinds: ((_a = requestConfig.retry) == null ? void 0 : _a.onErrorKinds) ?? defaultRetryConfig.onErrorKinds
      };
      if (retryConfig.attempts > 0) {
        const shouldRetry = retryConfig.onErrorKinds.includes(
          getApiErrorKind(apiError)
        );
        if (shouldRetry) {
          if (retryConfig.delayMs) {
            await wait(retryConfig.delayMs / 1e3);
          }
          return this.call(method, path2, requestParams, {
            ...requestConfig,
            retry: {
              ...retryConfig,
              attempts: retryConfig.attempts - 1
            }
          });
        }
      }
      const errorsConfig = requestConfig.errorsConfig;
      if (errorsConfig && errorsConfig.messages) {
        if (typeof errorsConfig.messages !== "string") {
          if (apiError.status in errorsConfig.messages) {
            apiError.message = errorsConfig.messages[apiError.status];
          }
        } else {
          apiError.message = errorsConfig.messages;
        }
      }
      if ((errorsConfig == null ? void 0 : errorsConfig.hideErrors) !== true) {
        this._emit("error", apiError);
      }
      throw apiError;
    }
  }
  // method shortcuts
  async get(path2, requestParams, requestConfig) {
    return this.call(ApiMethodTypes.GET, path2, requestParams, requestConfig);
  }
  async post(path2, requestParams, requestConfig) {
    return this.call(ApiMethodTypes.POST, path2, requestParams, requestConfig);
  }
  async put(path2, requestParams, requestConfig) {
    return this.call(ApiMethodTypes.PUT, path2, requestParams, requestConfig);
  }
  async patch(path2, requestParams, requestConfig) {
    return this.call(ApiMethodTypes.PATCH, path2, requestParams, requestConfig);
  }
  async delete(path2, requestConfig) {
    return this.call(ApiMethodTypes.DELETE, path2, void 0, requestConfig);
  }
}
const urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let nanoid = (size = 21) => {
  let id = "";
  let bytes = crypto.getRandomValues(new Uint8Array(size |= 0));
  while (size--) {
    id += urlAlphabet[bytes[size] & 63];
  }
  return id;
};
const currentNotificationAtom = createAtom(
  {
    showNotification: (type, message, lifetimeSec) => ({ type, message, lifetimeSec }),
    removeNotification: (id) => id
  },
  ({ onAction, schedule, create: create2 }, state = []) => {
    onAction("showNotification", ({ type, message, lifetimeSec }) => {
      const id = nanoid(4);
      const onClose = () => currentNotificationAtom.removeNotification.dispatch(id);
      state = [...state, { id, type, message, lifetimeSec, onClose }];
      schedule((dispatch) => {
        setTimeout(onClose, lifetimeSec * 1e3);
      });
    });
    onAction(
      "removeNotification",
      (idToDelete) => state = state.filter(({ id }) => id !== idToDelete)
    );
    return [...state];
  },
  "[Shared state] currentNotificationAtom"
);
const _NotificationService = class _NotificationService {
  constructor() {
    __publicField(this, "defaultLifetimeSec", 10);
  }
  static getInstance() {
    if (!_NotificationService.instance) {
      throw new Error("You have to initialize api client first!");
    } else {
      return _NotificationService.instance;
    }
  }
  static init() {
    _NotificationService.instance = new _NotificationService();
  }
  error(message, lifetimeSec) {
    currentNotificationAtom.showNotification.dispatch(
      "error",
      message,
      lifetimeSec || this.defaultLifetimeSec
    );
  }
  warning(message, lifetimeSec) {
    currentNotificationAtom.showNotification.dispatch(
      "warning",
      message,
      lifetimeSec || this.defaultLifetimeSec
    );
  }
  info(message, lifetimeSec) {
    currentNotificationAtom.showNotification.dispatch(
      "info",
      message,
      lifetimeSec || this.defaultLifetimeSec
    );
  }
  success(message, lifetimeSec) {
    currentNotificationAtom.showNotification.dispatch(
      "success",
      message,
      lifetimeSec || this.defaultLifetimeSec
    );
  }
};
__publicField(_NotificationService, "instance");
let NotificationService = _NotificationService;
NotificationService.init();
const notificationServiceInstance = NotificationService.getInstance();
const apiClient = new ApiClient({
  on: {
    error: (error2) => {
      switch (error2.problem.kind) {
        default:
          notificationServiceInstance.error({
            title: "Error",
            description: error2.message
          });
      }
    },
    idle: () => dispatchMetricsEvent("apiClient_isIdle")
  }
});
new ApiClient({
  on: {
    error: (error2) => {
      switch (error2.problem.kind) {
        default:
          notificationServiceInstance.error({
            title: "Error",
            description: error2.message
          });
      }
    },
    idle: () => dispatchMetricsEvent("reportsClient_isIdle")
  }
});
async function getCurrentUserSubscription() {
  return await apiClient.get(
    "/users/current_user/billing_subscription",
    { appId: configRepo.get().id },
    { authRequirement: apiClient.AUTH_REQUIREMENT.MUST }
  );
}
reatomResource(async () => {
  return await getCurrentUserSubscription();
}, "currentUserSubscriptionResource").pipe(withDataAtom(), withCache());
createBooleanAtom(false, "intercomVisibleAtom");
function openIntercomChat() {
  if (globalThis.Intercom && globalThis.intercomSettings) {
    globalThis.Intercom("showMessages");
  } else {
    console.warn("Intercom is not available");
  }
}
function isExternalLink(href) {
  const externalProtocols = ["http://", "https://", "mailto:", "ftp://", "tel:"];
  return externalProtocols.some((protocol) => href.startsWith(protocol));
}
function isInnerAnchorLink(href) {
  return href.startsWith("#");
}
const MEDIA_PARAMS_SEPARATOR = "::";
const MEDIA_PARAMS_DELIMITER = ",";
function parseMediaParams(url) {
  const parts = url.split(MEDIA_PARAMS_SEPARATOR);
  if (parts.length !== 2) return { originalUrl: url, params: null };
  const [width, height, fullscreen] = parts[1].split(MEDIA_PARAMS_DELIMITER);
  return {
    originalUrl: parts[0],
    params: {
      ...width && { width: parseInt(width) },
      ...height && { height: parseInt(height) },
      ...fullscreen !== void 0 && { allowFullscreen: fullscreen === "1" }
    }
  };
}
const YOUTUBE_DOMAINS = ["youtube.com", "youtu.be"];
const isYoutubeUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return YOUTUBE_DOMAINS.some((domain) => parsedUrl.hostname.endsWith(domain));
  } catch {
    return false;
  }
};
function getYoutubeEmbedUrl(url) {
  try {
    const parsedUrl = new URL(url);
    let videoId = null;
    if (parsedUrl.hostname.includes("youtu.be")) {
      videoId = parsedUrl.pathname.slice(1);
    } else {
      if (parsedUrl.pathname.includes("shorts")) {
        videoId = parsedUrl.pathname.split("/shorts/")[1];
      } else if (parsedUrl.pathname.includes("embed")) {
        videoId = parsedUrl.pathname.split("/embed/")[1];
      } else {
        videoId = parsedUrl.searchParams.get("v");
      }
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch {
    return url;
  }
}
const appProtocolHandlers = {
  intercom: () => openIntercomChat()
  // Add more handlers here:
  // someCommand: (url) => { /* handle someCommand */ },
};
function handleAppProtocol(url) {
  const handler = appProtocolHandlers[url.hostname];
  if (handler) {
    handler(url);
    return true;
  }
  console.warn(`Unknown app protocol handler: ${url.hostname}`);
  return false;
}
function MarkdownLink({
  children,
  href,
  title
}) {
  const handleClick = reactExports.useCallback(
    (e) => {
      if (isInnerAnchorLink(href)) {
        return;
      }
      try {
        const url = new URL(href);
        if (url.protocol === "app:") {
          handleAppProtocol(url);
          e.preventDefault();
          return;
        }
      } catch {
      }
      goTo(href);
      e.preventDefault();
    },
    [href]
  );
  if (isExternalLink(href)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { title, href, target: "_blank", rel: "noreferrer", className: "external", children });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { title, href, onClick: handleClick, className: "internal", children });
}
function buildAssetUrl(asset) {
  return `${configRepo.get().apiGateway}/apps/${configRepo.get().id}/assets/${asset}`;
}
function MarkdownMedia({
  title,
  alt,
  src
}) {
  const { originalUrl, params } = parseMediaParams(src);
  if (isYoutubeUrl(originalUrl)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "iframe",
      {
        src: getYoutubeEmbedUrl(originalUrl),
        width: (params == null ? void 0 : params.width) || 560,
        height: (params == null ? void 0 : params.height) || 315,
        title: title || alt || "YouTube video player",
        frameBorder: "0",
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        allowFullScreen: (params == null ? void 0 : params.allowFullscreen) ?? true,
        referrerPolicy: "strict-origin-when-cross-origin"
      }
    );
  }
  let realSrc = originalUrl;
  if (!isExternalLink(originalUrl)) {
    realSrc = buildAssetUrl(originalUrl);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: realSrc,
      alt,
      title,
      ...(params == null ? void 0 : params.width) && { width: params.width },
      ...(params == null ? void 0 : params.height) && { height: params.height }
    }
  );
}
function wrapContentInSection(content, idPrefix, classPrefix) {
  const result = [];
  const stack = [];
  let keyCounter = 0;
  const parentCounters = /* @__PURE__ */ new Map();
  const wrapAndPushContent = (level) => {
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      const { level: stackLevel, content: content2, id } = stack.pop();
      if (content2.length > 0) {
        const wrappedContent = React.createElement(
          "div",
          {
            className: `${classPrefix}-${id}`,
            key: `div-h${stackLevel}-${++keyCounter}`
          },
          content2
        );
        if (stack.length > 0) {
          stack[stack.length - 1].content.push(wrappedContent);
        } else {
          result.push(wrappedContent);
        }
      }
    }
  };
  const processElement = (element) => {
    const headingMatch = element.type.toString().match(/^h([1-6])$/);
    if (headingMatch) {
      const level = Number.parseInt(headingMatch[1]);
      wrapAndPushContent(level);
      const parentId = stack.length > 0 ? stack[stack.length - 1].id : "";
      const currentCount = (parentCounters.get(parentId) || 0) + 1;
      parentCounters.set(parentId, currentCount);
      const fullId = parentId ? `${parentId}-${currentCount}` : `${idPrefix}-${currentCount}`;
      const clonedElement = React.cloneElement(element, {
        key: `heading-${++keyCounter}`,
        id: fullId
      });
      if (stack.length > 0 && level > stack[stack.length - 1].level) {
        stack[stack.length - 1].content.push(clonedElement);
      } else {
        result.push(clonedElement);
      }
      stack.push({ level, content: [], id: fullId });
    } else {
      const clonedElement = React.cloneElement(element, {
        key: `content-${++keyCounter}`
      });
      if (stack.length > 0) {
        stack[stack.length - 1].content.push(clonedElement);
      } else {
        result.push(clonedElement);
      }
    }
  };
  React.Children.forEach(content, (element) => {
    if (React.isValidElement(element)) {
      processElement(element);
    }
  });
  wrapAndPushContent(0);
  return result;
}
function splitIntoSections(compiled) {
  const sections = [];
  let currentSection = [];
  React.Children.forEach(compiled, (element) => {
    if (React.isValidElement(element) && element.type === "hr") {
      if (currentSection.length > 0) {
        sections.push(currentSection);
        currentSection = [];
      }
    } else {
      currentSection.push(element);
    }
  });
  if (currentSection.length > 0) {
    sections.push(currentSection);
  }
  return sections;
}
function structureMarkdownContent(compiled, idPrefix = "hdr", classPrefix = "wrap") {
  const sections = splitIntoSections(compiled);
  return sections.map(
    (section, index2) => React.createElement(
      "section",
      { key: `section-${index2}` },
      wrapContentInSection(section, idPrefix, classPrefix)
    )
  );
}
const markdownOptions = {
  overrides: {
    a: MarkdownLink,
    img: MarkdownMedia,
    h1: { props: { id: void 0 } },
    h2: { props: { id: void 0 } },
    h3: { props: { id: void 0 } },
    h4: { props: { id: void 0 } },
    h5: { props: { id: void 0 } },
    h6: { props: { id: void 0 } }
  },
  wrapper: null
};
function MarkdownContent({ content }) {
  const compiled = Ze(content, markdownOptions);
  return structureMarkdownContent(compiled);
}
var isArray = Array.isArray;
var keyList = Object.keys;
var hasProp = Object.prototype.hasOwnProperty;
var fastDeepEqual = function equal(a2, b2) {
  if (a2 === b2) return true;
  if (a2 && b2 && typeof a2 == "object" && typeof b2 == "object") {
    var arrA = isArray(a2), arrB = isArray(b2), i2, length, key;
    if (arrA && arrB) {
      length = a2.length;
      if (length != b2.length) return false;
      for (i2 = length; i2-- !== 0; )
        if (!equal(a2[i2], b2[i2])) return false;
      return true;
    }
    if (arrA != arrB) return false;
    var dateA = a2 instanceof Date, dateB = b2 instanceof Date;
    if (dateA != dateB) return false;
    if (dateA && dateB) return a2.getTime() == b2.getTime();
    var regexpA = a2 instanceof RegExp, regexpB = b2 instanceof RegExp;
    if (regexpA != regexpB) return false;
    if (regexpA && regexpB) return a2.toString() == b2.toString();
    var keys = keyList(a2);
    length = keys.length;
    if (length !== keyList(b2).length)
      return false;
    for (i2 = length; i2-- !== 0; )
      if (!hasProp.call(b2, keys[i2])) return false;
    for (i2 = length; i2-- !== 0; ) {
      key = keys[i2];
      if (!equal(a2[key], b2[key])) return false;
    }
    return true;
  }
  return a2 !== a2 && b2 !== b2;
};
var __values = commonjsGlobal && commonjsGlobal.__values || function(o2) {
  var s2 = typeof Symbol === "function" && Symbol.iterator, m2 = s2 && o2[s2], i2 = 0;
  if (m2) return m2.call(o2);
  if (o2 && typeof o2.length === "number") return {
    next: function() {
      if (o2 && i2 >= o2.length) o2 = void 0;
      return { value: o2 && o2[i2++], done: !o2 };
    }
  };
  throw new TypeError(s2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = commonjsGlobal && commonjsGlobal.__read || function(o2, n2) {
  var m2 = typeof Symbol === "function" && o2[Symbol.iterator];
  if (!m2) return o2;
  var i2 = m2.call(o2), r2, ar = [], e;
  try {
    while ((n2 === void 0 || n2-- > 0) && !(r2 = i2.next()).done) ar.push(r2.value);
  } catch (error2) {
    e = { error: error2 };
  } finally {
    try {
      if (r2 && !r2.done && (m2 = i2["return"])) m2.call(i2);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
};
var __spreadArray = commonjsGlobal && commonjsGlobal.__spreadArray || function(to2, from, pack) {
  if (pack || arguments.length === 2) for (var i2 = 0, l2 = from.length, ar; i2 < l2; i2++) {
    if (ar || !(i2 in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i2);
      ar[i2] = from[i2];
    }
  }
  return to2.concat(ar || Array.prototype.slice.call(from));
};
var deepEqual$1 = fastDeepEqual;
var promiseCaches = [];
var usePromise = function(promise, inputs, lifespan) {
  var e_1, _a;
  if (lifespan === void 0) {
    lifespan = 0;
  }
  try {
    for (var promiseCaches_1 = __values(promiseCaches), promiseCaches_1_1 = promiseCaches_1.next(); !promiseCaches_1_1.done; promiseCaches_1_1 = promiseCaches_1.next()) {
      var promiseCache_1 = promiseCaches_1_1.value;
      if (deepEqual$1(inputs, promiseCache_1.inputs)) {
        if (Object.prototype.hasOwnProperty.call(promiseCache_1, "error")) {
          throw promiseCache_1.error;
        } else if (Object.prototype.hasOwnProperty.call(promiseCache_1, "response")) {
          return promiseCache_1.response;
        }
        throw promiseCache_1.promise;
      }
    }
  } catch (e_1_1) {
    e_1 = { error: e_1_1 };
  } finally {
    try {
      if (promiseCaches_1_1 && !promiseCaches_1_1.done && (_a = promiseCaches_1.return)) _a.call(promiseCaches_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
  var promiseCache = {
    promise: promise.apply(void 0, __spreadArray([], __read(inputs), false)).then(function(response) {
      promiseCache.response = response;
    }).catch(function(e) {
      promiseCache.error = e;
    }).then(function() {
      if (lifespan > 0) {
        setTimeout(function() {
          var index2 = promiseCaches.indexOf(promiseCache);
          if (index2 !== -1) {
            promiseCaches.splice(index2, 1);
          }
        }, lifespan);
      }
    }),
    inputs
  };
  promiseCaches.push(promiseCache);
  throw promiseCache.promise;
};
var build = usePromise;
const usePromise$1 = /* @__PURE__ */ getDefaultExportFromCjs(build);
const article = "_article_b9f5o_1";
const s$d = {
  article
};
function Article({
  children,
  className = "",
  id = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("article", { className: `${s$d.article} ${className}`, id, children });
}
const isString = (obj) => typeof obj === "string";
const defer = () => {
  let res;
  let rej;
  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
};
const makeString = (object) => {
  if (object == null) return "";
  return "" + object;
};
const copy = (a2, s2, t2) => {
  a2.forEach((m2) => {
    if (s2[m2]) t2[m2] = s2[m2];
  });
};
const lastOfPathSeparatorRegExp = /###/g;
const cleanKey = (key) => key && key.indexOf("###") > -1 ? key.replace(lastOfPathSeparatorRegExp, ".") : key;
const canNotTraverseDeeper = (object) => !object || isString(object);
const getLastOfPath = (object, path2, Empty) => {
  const stack = !isString(path2) ? path2 : path2.split(".");
  let stackIndex = 0;
  while (stackIndex < stack.length - 1) {
    if (canNotTraverseDeeper(object)) return {};
    const key = cleanKey(stack[stackIndex]);
    if (!object[key] && Empty) object[key] = new Empty();
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object = object[key];
    } else {
      object = {};
    }
    ++stackIndex;
  }
  if (canNotTraverseDeeper(object)) return {};
  return {
    obj: object,
    k: cleanKey(stack[stackIndex])
  };
};
const setPath = (object, path2, newValue) => {
  const {
    obj,
    k: k2
  } = getLastOfPath(object, path2, Object);
  if (obj !== void 0 || path2.length === 1) {
    obj[k2] = newValue;
    return;
  }
  let e = path2[path2.length - 1];
  let p2 = path2.slice(0, path2.length - 1);
  let last = getLastOfPath(object, p2, Object);
  while (last.obj === void 0 && p2.length) {
    e = `${p2[p2.length - 1]}.${e}`;
    p2 = p2.slice(0, p2.length - 1);
    last = getLastOfPath(object, p2, Object);
    if (last && last.obj && typeof last.obj[`${last.k}.${e}`] !== "undefined") {
      last.obj = void 0;
    }
  }
  last.obj[`${last.k}.${e}`] = newValue;
};
const pushPath = (object, path2, newValue, concat) => {
  const {
    obj,
    k: k2
  } = getLastOfPath(object, path2, Object);
  obj[k2] = obj[k2] || [];
  obj[k2].push(newValue);
};
const getPath = (object, path2) => {
  const {
    obj,
    k: k2
  } = getLastOfPath(object, path2);
  if (!obj) return void 0;
  return obj[k2];
};
const getPathWithDefaults = (data, defaultData, key) => {
  const value = getPath(data, key);
  if (value !== void 0) {
    return value;
  }
  return getPath(defaultData, key);
};
const deepExtend = (target, source, overwrite) => {
  for (const prop in source) {
    if (prop !== "__proto__" && prop !== "constructor") {
      if (prop in target) {
        if (isString(target[prop]) || target[prop] instanceof String || isString(source[prop]) || source[prop] instanceof String) {
          if (overwrite) target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }
  }
  return target;
};
const regexEscape = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var _entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
const escape = (data) => {
  if (isString(data)) {
    return data.replace(/[&<>"'\/]/g, (s2) => _entityMap[s2]);
  }
  return data;
};
class RegExpCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.regExpMap = /* @__PURE__ */ new Map();
    this.regExpQueue = [];
  }
  getRegExp(pattern) {
    const regExpFromCache = this.regExpMap.get(pattern);
    if (regExpFromCache !== void 0) {
      return regExpFromCache;
    }
    const regExpNew = new RegExp(pattern);
    if (this.regExpQueue.length === this.capacity) {
      this.regExpMap.delete(this.regExpQueue.shift());
    }
    this.regExpMap.set(pattern, regExpNew);
    this.regExpQueue.push(pattern);
    return regExpNew;
  }
}
const chars = [" ", ",", "?", "!", ";"];
const looksLikeObjectPathRegExpCache = new RegExpCache(20);
const looksLikeObjectPath = (key, nsSeparator, keySeparator) => {
  nsSeparator = nsSeparator || "";
  keySeparator = keySeparator || "";
  const possibleChars = chars.filter((c2) => nsSeparator.indexOf(c2) < 0 && keySeparator.indexOf(c2) < 0);
  if (possibleChars.length === 0) return true;
  const r2 = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map((c2) => c2 === "?" ? "\\?" : c2).join("|")})`);
  let matched = !r2.test(key);
  if (!matched) {
    const ki = key.indexOf(keySeparator);
    if (ki > 0 && !r2.test(key.substring(0, ki))) {
      matched = true;
    }
  }
  return matched;
};
const deepFind = function(obj, path2) {
  let keySeparator = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
  if (!obj) return void 0;
  if (obj[path2]) return obj[path2];
  const tokens = path2.split(keySeparator);
  let current = obj;
  for (let i2 = 0; i2 < tokens.length; ) {
    if (!current || typeof current !== "object") {
      return void 0;
    }
    let next;
    let nextPath = "";
    for (let j2 = i2; j2 < tokens.length; ++j2) {
      if (j2 !== i2) {
        nextPath += keySeparator;
      }
      nextPath += tokens[j2];
      next = current[nextPath];
      if (next !== void 0) {
        if (["string", "number", "boolean"].indexOf(typeof next) > -1 && j2 < tokens.length - 1) {
          continue;
        }
        i2 += j2 - i2 + 1;
        break;
      }
    }
    current = next;
  }
  return current;
};
const getCleanedCode = (code) => code && code.replace("_", "-");
const consoleLogger = {
  type: "logger",
  log(args) {
    this.output("log", args);
  },
  warn(args) {
    this.output("warn", args);
  },
  error(args) {
    this.output("error", args);
  },
  output(type, args) {
    if (console && console[type]) console[type].apply(console, args);
  }
};
class Logger {
  constructor(concreteLogger) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.init(concreteLogger, options);
  }
  init(concreteLogger) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.prefix = options.prefix || "i18next:";
    this.logger = concreteLogger || consoleLogger;
    this.options = options;
    this.debug = options.debug;
  }
  log() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return this.forward(args, "log", "", true);
  }
  warn() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return this.forward(args, "warn", "", true);
  }
  error() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return this.forward(args, "error", "");
  }
  deprecate() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
  }
  forward(args, lvl, prefix, debugOnly) {
    if (debugOnly && !this.debug) return null;
    if (isString(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
    return this.logger[lvl](args);
  }
  create(moduleName) {
    return new Logger(this.logger, {
      ...{
        prefix: `${this.prefix}:${moduleName}:`
      },
      ...this.options
    });
  }
  clone(options) {
    options = options || this.options;
    options.prefix = options.prefix || this.prefix;
    return new Logger(this.logger, options);
  }
}
var baseLogger = new Logger();
class EventEmitter {
  constructor() {
    this.observers = {};
  }
  on(events, listener) {
    events.split(" ").forEach((event2) => {
      if (!this.observers[event2]) this.observers[event2] = /* @__PURE__ */ new Map();
      const numListeners = this.observers[event2].get(listener) || 0;
      this.observers[event2].set(listener, numListeners + 1);
    });
    return this;
  }
  off(event2, listener) {
    if (!this.observers[event2]) return;
    if (!listener) {
      delete this.observers[event2];
      return;
    }
    this.observers[event2].delete(listener);
  }
  emit(event2) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    if (this.observers[event2]) {
      const cloned = Array.from(this.observers[event2].entries());
      cloned.forEach((_ref) => {
        let [observer, numTimesAdded] = _ref;
        for (let i2 = 0; i2 < numTimesAdded; i2++) {
          observer(...args);
        }
      });
    }
    if (this.observers["*"]) {
      const cloned = Array.from(this.observers["*"].entries());
      cloned.forEach((_ref2) => {
        let [observer, numTimesAdded] = _ref2;
        for (let i2 = 0; i2 < numTimesAdded; i2++) {
          observer.apply(observer, [event2, ...args]);
        }
      });
    }
  }
}
class ResourceStore extends EventEmitter {
  constructor(data) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      ns: ["translation"],
      defaultNS: "translation"
    };
    super();
    this.data = data || {};
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    if (this.options.ignoreJSONStructure === void 0) {
      this.options.ignoreJSONStructure = true;
    }
  }
  addNamespaces(ns) {
    if (this.options.ns.indexOf(ns) < 0) {
      this.options.ns.push(ns);
    }
  }
  removeNamespaces(ns) {
    const index2 = this.options.ns.indexOf(ns);
    if (index2 > -1) {
      this.options.ns.splice(index2, 1);
    }
  }
  getResource(lng, ns, key) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    const ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let path2;
    if (lng.indexOf(".") > -1) {
      path2 = lng.split(".");
    } else {
      path2 = [lng, ns];
      if (key) {
        if (Array.isArray(key)) {
          path2.push(...key);
        } else if (isString(key) && keySeparator) {
          path2.push(...key.split(keySeparator));
        } else {
          path2.push(key);
        }
      }
    }
    const result = getPath(this.data, path2);
    if (!result && !ns && !key && lng.indexOf(".") > -1) {
      lng = path2[0];
      ns = path2[1];
      key = path2.slice(2).join(".");
    }
    if (result || !ignoreJSONStructure || !isString(key)) return result;
    return deepFind(this.data && this.data[lng] && this.data[lng][ns], key, keySeparator);
  }
  addResource(lng, ns, key, value) {
    let options = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      silent: false
    };
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    let path2 = [lng, ns];
    if (key) path2 = path2.concat(keySeparator ? key.split(keySeparator) : key);
    if (lng.indexOf(".") > -1) {
      path2 = lng.split(".");
      value = ns;
      ns = path2[1];
    }
    this.addNamespaces(ns);
    setPath(this.data, path2, value);
    if (!options.silent) this.emit("added", lng, ns, key, value);
  }
  addResources(lng, ns, resources) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {
      silent: false
    };
    for (const m2 in resources) {
      if (isString(resources[m2]) || Array.isArray(resources[m2])) this.addResource(lng, ns, m2, resources[m2], {
        silent: true
      });
    }
    if (!options.silent) this.emit("added", lng, ns, resources);
  }
  addResourceBundle(lng, ns, resources, deep, overwrite) {
    let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {
      silent: false,
      skipCopy: false
    };
    let path2 = [lng, ns];
    if (lng.indexOf(".") > -1) {
      path2 = lng.split(".");
      deep = resources;
      resources = ns;
      ns = path2[1];
    }
    this.addNamespaces(ns);
    let pack = getPath(this.data, path2) || {};
    if (!options.skipCopy) resources = JSON.parse(JSON.stringify(resources));
    if (deep) {
      deepExtend(pack, resources, overwrite);
    } else {
      pack = {
        ...pack,
        ...resources
      };
    }
    setPath(this.data, path2, pack);
    if (!options.silent) this.emit("added", lng, ns, resources);
  }
  removeResourceBundle(lng, ns) {
    if (this.hasResourceBundle(lng, ns)) {
      delete this.data[lng][ns];
    }
    this.removeNamespaces(ns);
    this.emit("removed", lng, ns);
  }
  hasResourceBundle(lng, ns) {
    return this.getResource(lng, ns) !== void 0;
  }
  getResourceBundle(lng, ns) {
    if (!ns) ns = this.options.defaultNS;
    if (this.options.compatibilityAPI === "v1") return {
      ...{},
      ...this.getResource(lng, ns)
    };
    return this.getResource(lng, ns);
  }
  getDataByLanguage(lng) {
    return this.data[lng];
  }
  hasLanguageSomeTranslations(lng) {
    const data = this.getDataByLanguage(lng);
    const n2 = data && Object.keys(data) || [];
    return !!n2.find((v2) => data[v2] && Object.keys(data[v2]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}
var postProcessor = {
  processors: {},
  addPostProcessor(module) {
    this.processors[module.name] = module;
  },
  handle(processors, value, key, options, translator) {
    processors.forEach((processor) => {
      if (this.processors[processor]) value = this.processors[processor].process(value, key, options, translator);
    });
    return value;
  }
};
const checkedLoadedFor = {};
class Translator extends EventEmitter {
  constructor(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super();
    copy(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], services, this);
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    this.logger = baseLogger.create("translator");
  }
  changeLanguage(lng) {
    if (lng) this.language = lng;
  }
  exists(key) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    if (key === void 0 || key === null) {
      return false;
    }
    const resolved2 = this.resolve(key, options);
    return resolved2 && resolved2.res !== void 0;
  }
  extractFromKey(key, options) {
    let nsSeparator = options.nsSeparator !== void 0 ? options.nsSeparator : this.options.nsSeparator;
    if (nsSeparator === void 0) nsSeparator = ":";
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    let namespaces = options.ns || this.options.defaultNS || [];
    const wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
    const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !options.keySeparator && !this.options.userDefinedNsSeparator && !options.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
    if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
      const m2 = key.match(this.interpolator.nestingRegexp);
      if (m2 && m2.length > 0) {
        return {
          key,
          namespaces: isString(namespaces) ? [namespaces] : namespaces
        };
      }
      const parts = key.split(nsSeparator);
      if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
      key = parts.join(keySeparator);
    }
    return {
      key,
      namespaces: isString(namespaces) ? [namespaces] : namespaces
    };
  }
  translate(keys, options, lastKey) {
    if (typeof options !== "object" && this.options.overloadTranslationOptionHandler) {
      options = this.options.overloadTranslationOptionHandler(arguments);
    }
    if (typeof options === "object") options = {
      ...options
    };
    if (!options) options = {};
    if (keys === void 0 || keys === null) return "";
    if (!Array.isArray(keys)) keys = [String(keys)];
    const returnDetails = options.returnDetails !== void 0 ? options.returnDetails : this.options.returnDetails;
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    const {
      key,
      namespaces
    } = this.extractFromKey(keys[keys.length - 1], options);
    const namespace = namespaces[namespaces.length - 1];
    const lng = options.lng || this.language;
    const appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (lng && lng.toLowerCase() === "cimode") {
      if (appendNamespaceToCIMode) {
        const nsSeparator = options.nsSeparator || this.options.nsSeparator;
        if (returnDetails) {
          return {
            res: `${namespace}${nsSeparator}${key}`,
            usedKey: key,
            exactUsedKey: key,
            usedLng: lng,
            usedNS: namespace,
            usedParams: this.getUsedParamsDetails(options)
          };
        }
        return `${namespace}${nsSeparator}${key}`;
      }
      if (returnDetails) {
        return {
          res: key,
          usedKey: key,
          exactUsedKey: key,
          usedLng: lng,
          usedNS: namespace,
          usedParams: this.getUsedParamsDetails(options)
        };
      }
      return key;
    }
    const resolved2 = this.resolve(keys, options);
    let res = resolved2 && resolved2.res;
    const resUsedKey = resolved2 && resolved2.usedKey || key;
    const resExactUsedKey = resolved2 && resolved2.exactUsedKey || key;
    const resType = Object.prototype.toString.apply(res);
    const noObject = ["[object Number]", "[object Function]", "[object RegExp]"];
    const joinArrays = options.joinArrays !== void 0 ? options.joinArrays : this.options.joinArrays;
    const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const handleAsObject = !isString(res) && typeof res !== "boolean" && typeof res !== "number";
    if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(isString(joinArrays) && Array.isArray(res))) {
      if (!options.returnObjects && !this.options.returnObjects) {
        if (!this.options.returnedObjectHandler) {
          this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        }
        const r2 = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, {
          ...options,
          ns: namespaces
        }) : `key '${key} (${this.language})' returned an object instead of string.`;
        if (returnDetails) {
          resolved2.res = r2;
          resolved2.usedParams = this.getUsedParamsDetails(options);
          return resolved2;
        }
        return r2;
      }
      if (keySeparator) {
        const resTypeIsArray = Array.isArray(res);
        const copy2 = resTypeIsArray ? [] : {};
        const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
        for (const m2 in res) {
          if (Object.prototype.hasOwnProperty.call(res, m2)) {
            const deepKey = `${newKeyToUse}${keySeparator}${m2}`;
            copy2[m2] = this.translate(deepKey, {
              ...options,
              ...{
                joinArrays: false,
                ns: namespaces
              }
            });
            if (copy2[m2] === deepKey) copy2[m2] = res[m2];
          }
        }
        res = copy2;
      }
    } else if (handleAsObjectInI18nFormat && isString(joinArrays) && Array.isArray(res)) {
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, keys, options, lastKey);
    } else {
      let usedDefault = false;
      let usedKey = false;
      const needsPluralHandling = options.count !== void 0 && !isString(options.count);
      const hasDefaultValue = Translator.hasDefaultValue(options);
      const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, options) : "";
      const defaultValueSuffixOrdinalFallback = options.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, {
        ordinal: false
      }) : "";
      const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && this.pluralResolver.shouldUseIntlApi();
      const defaultValue = needsZeroSuffixLookup && options[`defaultValue${this.options.pluralSeparator}zero`] || options[`defaultValue${defaultValueSuffix}`] || options[`defaultValue${defaultValueSuffixOrdinalFallback}`] || options.defaultValue;
      if (!this.isValidLookup(res) && hasDefaultValue) {
        usedDefault = true;
        res = defaultValue;
      }
      if (!this.isValidLookup(res)) {
        usedKey = true;
        res = key;
      }
      const missingKeyNoValueFallbackToKey = options.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
      const resForMissing = missingKeyNoValueFallbackToKey && usedKey ? void 0 : res;
      const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
      if (usedKey || usedDefault || updateMissing) {
        this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, key, updateMissing ? defaultValue : res);
        if (keySeparator) {
          const fk = this.resolve(key, {
            ...options,
            keySeparator: false
          });
          if (fk && fk.res) this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let lngs = [];
        const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) {
          for (let i2 = 0; i2 < fallbackLngs.length; i2++) {
            lngs.push(fallbackLngs[i2]);
          }
        } else if (this.options.saveMissingTo === "all") {
          lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
        } else {
          lngs.push(options.lng || this.language);
        }
        const send = (l2, k2, specificDefaultValue) => {
          const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
          if (this.options.missingKeyHandler) {
            this.options.missingKeyHandler(l2, namespace, k2, defaultForMissing, updateMissing, options);
          } else if (this.backendConnector && this.backendConnector.saveMissing) {
            this.backendConnector.saveMissing(l2, namespace, k2, defaultForMissing, updateMissing, options);
          }
          this.emit("missingKey", l2, namespace, k2, res);
        };
        if (this.options.saveMissing) {
          if (this.options.saveMissingPlurals && needsPluralHandling) {
            lngs.forEach((language2) => {
              const suffixes = this.pluralResolver.getSuffixes(language2, options);
              if (needsZeroSuffixLookup && options[`defaultValue${this.options.pluralSeparator}zero`] && suffixes.indexOf(`${this.options.pluralSeparator}zero`) < 0) {
                suffixes.push(`${this.options.pluralSeparator}zero`);
              }
              suffixes.forEach((suffix) => {
                send([language2], key + suffix, options[`defaultValue${suffix}`] || defaultValue);
              });
            });
          } else {
            send(lngs, key, defaultValue);
          }
        }
      }
      res = this.extendTranslation(res, keys, options, resolved2, lastKey);
      if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = `${namespace}:${key}`;
      if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
        if (this.options.compatibilityAPI !== "v1") {
          res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}:${key}` : key, usedDefault ? res : void 0);
        } else {
          res = this.options.parseMissingKeyHandler(res);
        }
      }
    }
    if (returnDetails) {
      resolved2.res = res;
      resolved2.usedParams = this.getUsedParamsDetails(options);
      return resolved2;
    }
    return res;
  }
  extendTranslation(res, key, options, resolved2, lastKey) {
    var _this = this;
    if (this.i18nFormat && this.i18nFormat.parse) {
      res = this.i18nFormat.parse(res, {
        ...this.options.interpolation.defaultVariables,
        ...options
      }, options.lng || this.language || resolved2.usedLng, resolved2.usedNS, resolved2.usedKey, {
        resolved: resolved2
      });
    } else if (!options.skipInterpolation) {
      if (options.interpolation) this.interpolator.init({
        ...options,
        ...{
          interpolation: {
            ...this.options.interpolation,
            ...options.interpolation
          }
        }
      });
      const skipOnVariables = isString(res) && (options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let nestBef;
      if (skipOnVariables) {
        const nb = res.match(this.interpolator.nestingRegexp);
        nestBef = nb && nb.length;
      }
      let data = options.replace && !isString(options.replace) ? options.replace : options;
      if (this.options.interpolation.defaultVariables) data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
      res = this.interpolator.interpolate(res, data, options.lng || this.language || resolved2.usedLng, options);
      if (skipOnVariables) {
        const na = res.match(this.interpolator.nestingRegexp);
        const nestAft = na && na.length;
        if (nestBef < nestAft) options.nest = false;
      }
      if (!options.lng && this.options.compatibilityAPI !== "v1" && resolved2 && resolved2.res) options.lng = this.language || resolved2.usedLng;
      if (options.nest !== false) res = this.interpolator.nest(res, function() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        if (lastKey && lastKey[0] === args[0] && !options.context) {
          _this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
          return null;
        }
        return _this.translate(...args, key);
      }, options);
      if (options.interpolation) this.interpolator.reset();
    }
    const postProcess = options.postProcess || this.options.postProcess;
    const postProcessorNames = isString(postProcess) ? [postProcess] : postProcess;
    if (res !== void 0 && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
      res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
        i18nResolved: {
          ...resolved2,
          usedParams: this.getUsedParamsDetails(options)
        },
        ...options
      } : options, this);
    }
    return res;
  }
  resolve(keys) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let found;
    let usedKey;
    let exactUsedKey;
    let usedLng;
    let usedNS;
    if (isString(keys)) keys = [keys];
    keys.forEach((k2) => {
      if (this.isValidLookup(found)) return;
      const extracted = this.extractFromKey(k2, options);
      const key = extracted.key;
      usedKey = key;
      let namespaces = extracted.namespaces;
      if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
      const needsPluralHandling = options.count !== void 0 && !isString(options.count);
      const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && this.pluralResolver.shouldUseIntlApi();
      const needsContextHandling = options.context !== void 0 && (isString(options.context) || typeof options.context === "number") && options.context !== "";
      const codes = options.lngs ? options.lngs : this.languageUtils.toResolveHierarchy(options.lng || this.language, options.fallbackLng);
      namespaces.forEach((ns) => {
        if (this.isValidLookup(found)) return;
        usedNS = ns;
        if (!checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils && this.utils.hasLoadedNamespace && !this.utils.hasLoadedNamespace(usedNS)) {
          checkedLoadedFor[`${codes[0]}-${ns}`] = true;
          this.logger.warn(`key "${usedKey}" for languages "${codes.join(", ")}" won't get resolved as namespace "${usedNS}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
        }
        codes.forEach((code) => {
          if (this.isValidLookup(found)) return;
          usedLng = code;
          const finalKeys = [key];
          if (this.i18nFormat && this.i18nFormat.addLookupKeys) {
            this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
          } else {
            let pluralSuffix;
            if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, options.count, options);
            const zeroSuffix = `${this.options.pluralSeparator}zero`;
            const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (needsPluralHandling) {
              finalKeys.push(key + pluralSuffix);
              if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
              }
              if (needsZeroSuffixLookup) {
                finalKeys.push(key + zeroSuffix);
              }
            }
            if (needsContextHandling) {
              const contextKey = `${key}${this.options.contextSeparator}${options.context}`;
              finalKeys.push(contextKey);
              if (needsPluralHandling) {
                finalKeys.push(contextKey + pluralSuffix);
                if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                  finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
                }
                if (needsZeroSuffixLookup) {
                  finalKeys.push(contextKey + zeroSuffix);
                }
              }
            }
          }
          let possibleKey;
          while (possibleKey = finalKeys.pop()) {
            if (!this.isValidLookup(found)) {
              exactUsedKey = possibleKey;
              found = this.getResource(code, ns, possibleKey, options);
            }
          }
        });
      });
    });
    return {
      res: found,
      usedKey,
      exactUsedKey,
      usedLng,
      usedNS
    };
  }
  isValidLookup(res) {
    return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
  }
  getResource(code, ns, key) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code, ns, key, options);
    return this.resourceStore.getResource(code, ns, key, options);
  }
  getUsedParamsDetails() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const optionsKeys = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"];
    const useOptionsReplaceForData = options.replace && !isString(options.replace);
    let data = useOptionsReplaceForData ? options.replace : options;
    if (useOptionsReplaceForData && typeof options.count !== "undefined") {
      data.count = options.count;
    }
    if (this.options.interpolation.defaultVariables) {
      data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
    }
    if (!useOptionsReplaceForData) {
      data = {
        ...data
      };
      for (const key of optionsKeys) {
        delete data[key];
      }
    }
    return data;
  }
  static hasDefaultValue(options) {
    const prefix = "defaultValue";
    for (const option in options) {
      if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, prefix.length) && void 0 !== options[option]) {
        return true;
      }
    }
    return false;
  }
}
const capitalize$1 = (string) => string.charAt(0).toUpperCase() + string.slice(1);
class LanguageUtil {
  constructor(options) {
    this.options = options;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create("languageUtils");
  }
  getScriptPartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf("-") < 0) return null;
    const p2 = code.split("-");
    if (p2.length === 2) return null;
    p2.pop();
    if (p2[p2.length - 1].toLowerCase() === "x") return null;
    return this.formatLanguageCode(p2.join("-"));
  }
  getLanguagePartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf("-") < 0) return code;
    const p2 = code.split("-");
    return this.formatLanguageCode(p2[0]);
  }
  formatLanguageCode(code) {
    if (isString(code) && code.indexOf("-") > -1) {
      if (typeof Intl !== "undefined" && typeof Intl.getCanonicalLocales !== "undefined") {
        try {
          let formattedCode = Intl.getCanonicalLocales(code)[0];
          if (formattedCode && this.options.lowerCaseLng) {
            formattedCode = formattedCode.toLowerCase();
          }
          if (formattedCode) return formattedCode;
        } catch (e) {
        }
      }
      const specialCases = ["hans", "hant", "latn", "cyrl", "cans", "mong", "arab"];
      let p2 = code.split("-");
      if (this.options.lowerCaseLng) {
        p2 = p2.map((part) => part.toLowerCase());
      } else if (p2.length === 2) {
        p2[0] = p2[0].toLowerCase();
        p2[1] = p2[1].toUpperCase();
        if (specialCases.indexOf(p2[1].toLowerCase()) > -1) p2[1] = capitalize$1(p2[1].toLowerCase());
      } else if (p2.length === 3) {
        p2[0] = p2[0].toLowerCase();
        if (p2[1].length === 2) p2[1] = p2[1].toUpperCase();
        if (p2[0] !== "sgn" && p2[2].length === 2) p2[2] = p2[2].toUpperCase();
        if (specialCases.indexOf(p2[1].toLowerCase()) > -1) p2[1] = capitalize$1(p2[1].toLowerCase());
        if (specialCases.indexOf(p2[2].toLowerCase()) > -1) p2[2] = capitalize$1(p2[2].toLowerCase());
      }
      return p2.join("-");
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
  }
  isSupportedCode(code) {
    if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) {
      code = this.getLanguagePartFromCode(code);
    }
    return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
  }
  getBestMatchFromCodes(codes) {
    if (!codes) return null;
    let found;
    codes.forEach((code) => {
      if (found) return;
      const cleanedLng = this.formatLanguageCode(code);
      if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
    });
    if (!found && this.options.supportedLngs) {
      codes.forEach((code) => {
        if (found) return;
        const lngOnly = this.getLanguagePartFromCode(code);
        if (this.isSupportedCode(lngOnly)) return found = lngOnly;
        found = this.options.supportedLngs.find((supportedLng) => {
          if (supportedLng === lngOnly) return supportedLng;
          if (supportedLng.indexOf("-") < 0 && lngOnly.indexOf("-") < 0) return;
          if (supportedLng.indexOf("-") > 0 && lngOnly.indexOf("-") < 0 && supportedLng.substring(0, supportedLng.indexOf("-")) === lngOnly) return supportedLng;
          if (supportedLng.indexOf(lngOnly) === 0 && lngOnly.length > 1) return supportedLng;
        });
      });
    }
    if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
    return found;
  }
  getFallbackCodes(fallbacks, code) {
    if (!fallbacks) return [];
    if (typeof fallbacks === "function") fallbacks = fallbacks(code);
    if (isString(fallbacks)) fallbacks = [fallbacks];
    if (Array.isArray(fallbacks)) return fallbacks;
    if (!code) return fallbacks.default || [];
    let found = fallbacks[code];
    if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
    if (!found) found = fallbacks[this.formatLanguageCode(code)];
    if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
    if (!found) found = fallbacks.default;
    return found || [];
  }
  toResolveHierarchy(code, fallbackCode) {
    const fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
    const codes = [];
    const addCode = (c2) => {
      if (!c2) return;
      if (this.isSupportedCode(c2)) {
        codes.push(c2);
      } else {
        this.logger.warn(`rejecting language code not found in supportedLngs: ${c2}`);
      }
    };
    if (isString(code) && (code.indexOf("-") > -1 || code.indexOf("_") > -1)) {
      if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code));
      if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code));
      if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code));
    } else if (isString(code)) {
      addCode(this.formatLanguageCode(code));
    }
    fallbackCodes.forEach((fc) => {
      if (codes.indexOf(fc) < 0) addCode(this.formatLanguageCode(fc));
    });
    return codes;
  }
}
let sets = [{
  lngs: ["ach", "ak", "am", "arn", "br", "fil", "gun", "ln", "mfe", "mg", "mi", "oc", "pt", "pt-BR", "tg", "tl", "ti", "tr", "uz", "wa"],
  nr: [1, 2],
  fc: 1
}, {
  lngs: ["af", "an", "ast", "az", "bg", "bn", "ca", "da", "de", "dev", "el", "en", "eo", "es", "et", "eu", "fi", "fo", "fur", "fy", "gl", "gu", "ha", "hi", "hu", "hy", "ia", "it", "kk", "kn", "ku", "lb", "mai", "ml", "mn", "mr", "nah", "nap", "nb", "ne", "nl", "nn", "no", "nso", "pa", "pap", "pms", "ps", "pt-PT", "rm", "sco", "se", "si", "so", "son", "sq", "sv", "sw", "ta", "te", "tk", "ur", "yo"],
  nr: [1, 2],
  fc: 2
}, {
  lngs: ["ay", "bo", "cgg", "fa", "ht", "id", "ja", "jbo", "ka", "km", "ko", "ky", "lo", "ms", "sah", "su", "th", "tt", "ug", "vi", "wo", "zh"],
  nr: [1],
  fc: 3
}, {
  lngs: ["be", "bs", "cnr", "dz", "hr", "ru", "sr", "uk"],
  nr: [1, 2, 5],
  fc: 4
}, {
  lngs: ["ar"],
  nr: [0, 1, 2, 3, 11, 100],
  fc: 5
}, {
  lngs: ["cs", "sk"],
  nr: [1, 2, 5],
  fc: 6
}, {
  lngs: ["csb", "pl"],
  nr: [1, 2, 5],
  fc: 7
}, {
  lngs: ["cy"],
  nr: [1, 2, 3, 8],
  fc: 8
}, {
  lngs: ["fr"],
  nr: [1, 2],
  fc: 9
}, {
  lngs: ["ga"],
  nr: [1, 2, 3, 7, 11],
  fc: 10
}, {
  lngs: ["gd"],
  nr: [1, 2, 3, 20],
  fc: 11
}, {
  lngs: ["is"],
  nr: [1, 2],
  fc: 12
}, {
  lngs: ["jv"],
  nr: [0, 1],
  fc: 13
}, {
  lngs: ["kw"],
  nr: [1, 2, 3, 4],
  fc: 14
}, {
  lngs: ["lt"],
  nr: [1, 2, 10],
  fc: 15
}, {
  lngs: ["lv"],
  nr: [1, 2, 0],
  fc: 16
}, {
  lngs: ["mk"],
  nr: [1, 2],
  fc: 17
}, {
  lngs: ["mnk"],
  nr: [0, 1, 2],
  fc: 18
}, {
  lngs: ["mt"],
  nr: [1, 2, 11, 20],
  fc: 19
}, {
  lngs: ["or"],
  nr: [2, 1],
  fc: 2
}, {
  lngs: ["ro"],
  nr: [1, 2, 20],
  fc: 20
}, {
  lngs: ["sl"],
  nr: [5, 1, 2, 3],
  fc: 21
}, {
  lngs: ["he", "iw"],
  nr: [1, 2, 20, 21],
  fc: 22
}];
let _rulesPluralsTypes = {
  1: (n2) => Number(n2 > 1),
  2: (n2) => Number(n2 != 1),
  3: (n2) => 0,
  4: (n2) => Number(n2 % 10 == 1 && n2 % 100 != 11 ? 0 : n2 % 10 >= 2 && n2 % 10 <= 4 && (n2 % 100 < 10 || n2 % 100 >= 20) ? 1 : 2),
  5: (n2) => Number(n2 == 0 ? 0 : n2 == 1 ? 1 : n2 == 2 ? 2 : n2 % 100 >= 3 && n2 % 100 <= 10 ? 3 : n2 % 100 >= 11 ? 4 : 5),
  6: (n2) => Number(n2 == 1 ? 0 : n2 >= 2 && n2 <= 4 ? 1 : 2),
  7: (n2) => Number(n2 == 1 ? 0 : n2 % 10 >= 2 && n2 % 10 <= 4 && (n2 % 100 < 10 || n2 % 100 >= 20) ? 1 : 2),
  8: (n2) => Number(n2 == 1 ? 0 : n2 == 2 ? 1 : n2 != 8 && n2 != 11 ? 2 : 3),
  9: (n2) => Number(n2 >= 2),
  10: (n2) => Number(n2 == 1 ? 0 : n2 == 2 ? 1 : n2 < 7 ? 2 : n2 < 11 ? 3 : 4),
  11: (n2) => Number(n2 == 1 || n2 == 11 ? 0 : n2 == 2 || n2 == 12 ? 1 : n2 > 2 && n2 < 20 ? 2 : 3),
  12: (n2) => Number(n2 % 10 != 1 || n2 % 100 == 11),
  13: (n2) => Number(n2 !== 0),
  14: (n2) => Number(n2 == 1 ? 0 : n2 == 2 ? 1 : n2 == 3 ? 2 : 3),
  15: (n2) => Number(n2 % 10 == 1 && n2 % 100 != 11 ? 0 : n2 % 10 >= 2 && (n2 % 100 < 10 || n2 % 100 >= 20) ? 1 : 2),
  16: (n2) => Number(n2 % 10 == 1 && n2 % 100 != 11 ? 0 : n2 !== 0 ? 1 : 2),
  17: (n2) => Number(n2 == 1 || n2 % 10 == 1 && n2 % 100 != 11 ? 0 : 1),
  18: (n2) => Number(n2 == 0 ? 0 : n2 == 1 ? 1 : 2),
  19: (n2) => Number(n2 == 1 ? 0 : n2 == 0 || n2 % 100 > 1 && n2 % 100 < 11 ? 1 : n2 % 100 > 10 && n2 % 100 < 20 ? 2 : 3),
  20: (n2) => Number(n2 == 1 ? 0 : n2 == 0 || n2 % 100 > 0 && n2 % 100 < 20 ? 1 : 2),
  21: (n2) => Number(n2 % 100 == 1 ? 1 : n2 % 100 == 2 ? 2 : n2 % 100 == 3 || n2 % 100 == 4 ? 3 : 0),
  22: (n2) => Number(n2 == 1 ? 0 : n2 == 2 ? 1 : (n2 < 0 || n2 > 10) && n2 % 10 == 0 ? 2 : 3)
};
const nonIntlVersions = ["v1", "v2", "v3"];
const intlVersions = ["v4"];
const suffixesOrder = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
};
const createRules = () => {
  const rules = {};
  sets.forEach((set) => {
    set.lngs.forEach((l2) => {
      rules[l2] = {
        numbers: set.nr,
        plurals: _rulesPluralsTypes[set.fc]
      };
    });
  });
  return rules;
};
class PluralResolver {
  constructor(languageUtils) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create("pluralResolver");
    if ((!this.options.compatibilityJSON || intlVersions.includes(this.options.compatibilityJSON)) && (typeof Intl === "undefined" || !Intl.PluralRules)) {
      this.options.compatibilityJSON = "v3";
      this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.");
    }
    this.rules = createRules();
    this.pluralRulesCache = {};
  }
  addRule(lng, obj) {
    this.rules[lng] = obj;
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.shouldUseIntlApi()) {
      const cleanedCode = getCleanedCode(code === "dev" ? "en" : code);
      const type = options.ordinal ? "ordinal" : "cardinal";
      const cacheKey = JSON.stringify({
        cleanedCode,
        type
      });
      if (cacheKey in this.pluralRulesCache) {
        return this.pluralRulesCache[cacheKey];
      }
      let rule;
      try {
        rule = new Intl.PluralRules(cleanedCode, {
          type
        });
      } catch (err) {
        if (!code.match(/-|_/)) return;
        const lngPart = this.languageUtils.getLanguagePartFromCode(code);
        rule = this.getRule(lngPart, options);
      }
      this.pluralRulesCache[cacheKey] = rule;
      return rule;
    }
    return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
  }
  needsPlural(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const rule = this.getRule(code, options);
    if (this.shouldUseIntlApi()) {
      return rule && rule.resolvedOptions().pluralCategories.length > 1;
    }
    return rule && rule.numbers.length > 1;
  }
  getPluralFormsOfKey(code, key) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return this.getSuffixes(code, options).map((suffix) => `${key}${suffix}`);
  }
  getSuffixes(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const rule = this.getRule(code, options);
    if (!rule) {
      return [];
    }
    if (this.shouldUseIntlApi()) {
      return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map((pluralCategory) => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${pluralCategory}`);
    }
    return rule.numbers.map((number) => this.getSuffix(code, number, options));
  }
  getSuffix(code, count2) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const rule = this.getRule(code, options);
    if (rule) {
      if (this.shouldUseIntlApi()) {
        return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${rule.select(count2)}`;
      }
      return this.getSuffixRetroCompatible(rule, count2);
    }
    this.logger.warn(`no plural rule found for: ${code}`);
    return "";
  }
  getSuffixRetroCompatible(rule, count2) {
    const idx = rule.noAbs ? rule.plurals(count2) : rule.plurals(Math.abs(count2));
    let suffix = rule.numbers[idx];
    if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
      if (suffix === 2) {
        suffix = "plural";
      } else if (suffix === 1) {
        suffix = "";
      }
    }
    const returnSuffix = () => this.options.prepend && suffix.toString() ? this.options.prepend + suffix.toString() : suffix.toString();
    if (this.options.compatibilityJSON === "v1") {
      if (suffix === 1) return "";
      if (typeof suffix === "number") return `_plural_${suffix.toString()}`;
      return returnSuffix();
    } else if (this.options.compatibilityJSON === "v2") {
      return returnSuffix();
    } else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
      return returnSuffix();
    }
    return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
  }
  shouldUseIntlApi() {
    return !nonIntlVersions.includes(this.options.compatibilityJSON);
  }
}
const deepFindWithDefaults = function(data, defaultData, key) {
  let keySeparator = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ".";
  let ignoreJSONStructure = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
  let path2 = getPathWithDefaults(data, defaultData, key);
  if (!path2 && ignoreJSONStructure && isString(key)) {
    path2 = deepFind(data, key, keySeparator);
    if (path2 === void 0) path2 = deepFind(defaultData, key, keySeparator);
  }
  return path2;
};
const regexSafe = (val) => val.replace(/\$/g, "$$$$");
class Interpolator {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = baseLogger.create("interpolator");
    this.options = options;
    this.format = options.interpolation && options.interpolation.format || ((value) => value);
    this.init(options);
  }
  init() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!options.interpolation) options.interpolation = {
      escapeValue: true
    };
    const {
      escape: escape$1,
      escapeValue,
      useRawValueToEscape,
      prefix,
      prefixEscaped,
      suffix,
      suffixEscaped,
      formatSeparator,
      unescapeSuffix,
      unescapePrefix,
      nestingPrefix,
      nestingPrefixEscaped,
      nestingSuffix,
      nestingSuffixEscaped,
      nestingOptionsSeparator,
      maxReplaces,
      alwaysFormat
    } = options.interpolation;
    this.escape = escape$1 !== void 0 ? escape$1 : escape;
    this.escapeValue = escapeValue !== void 0 ? escapeValue : true;
    this.useRawValueToEscape = useRawValueToEscape !== void 0 ? useRawValueToEscape : false;
    this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || "{{";
    this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || "}}";
    this.formatSeparator = formatSeparator || ",";
    this.unescapePrefix = unescapeSuffix ? "" : unescapePrefix || "-";
    this.unescapeSuffix = this.unescapePrefix ? "" : unescapeSuffix || "";
    this.nestingPrefix = nestingPrefix ? regexEscape(nestingPrefix) : nestingPrefixEscaped || regexEscape("$t(");
    this.nestingSuffix = nestingSuffix ? regexEscape(nestingSuffix) : nestingSuffixEscaped || regexEscape(")");
    this.nestingOptionsSeparator = nestingOptionsSeparator || ",";
    this.maxReplaces = maxReplaces || 1e3;
    this.alwaysFormat = alwaysFormat !== void 0 ? alwaysFormat : false;
    this.resetRegExp();
  }
  reset() {
    if (this.options) this.init(this.options);
  }
  resetRegExp() {
    const getOrResetRegExp = (existingRegExp, pattern) => {
      if (existingRegExp && existingRegExp.source === pattern) {
        existingRegExp.lastIndex = 0;
        return existingRegExp;
      }
      return new RegExp(pattern, "g");
    };
    this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
    this.regexpUnescape = getOrResetRegExp(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`);
    this.nestingRegexp = getOrResetRegExp(this.nestingRegexp, `${this.nestingPrefix}(.+?)${this.nestingSuffix}`);
  }
  interpolate(str, data, lng, options) {
    let match;
    let value;
    let replaces;
    const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
    const handleFormat = (key) => {
      if (key.indexOf(this.formatSeparator) < 0) {
        const path2 = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(path2, void 0, lng, {
          ...options,
          ...data,
          interpolationkey: key
        }) : path2;
      }
      const p2 = key.split(this.formatSeparator);
      const k2 = p2.shift().trim();
      const f2 = p2.join(this.formatSeparator).trim();
      return this.format(deepFindWithDefaults(data, defaultData, k2, this.options.keySeparator, this.options.ignoreJSONStructure), f2, lng, {
        ...options,
        ...data,
        interpolationkey: k2
      });
    };
    this.resetRegExp();
    const missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
    const skipOnVariables = options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    const todos = [{
      regex: this.regexpUnescape,
      safeValue: (val) => regexSafe(val)
    }, {
      regex: this.regexp,
      safeValue: (val) => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
    }];
    todos.forEach((todo) => {
      replaces = 0;
      while (match = todo.regex.exec(str)) {
        const matchedVar = match[1].trim();
        value = handleFormat(matchedVar);
        if (value === void 0) {
          if (typeof missingInterpolationHandler === "function") {
            const temp = missingInterpolationHandler(str, match, options);
            value = isString(temp) ? temp : "";
          } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
            value = "";
          } else if (skipOnVariables) {
            value = match[0];
            continue;
          } else {
            this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
            value = "";
          }
        } else if (!isString(value) && !this.useRawValueToEscape) {
          value = makeString(value);
        }
        const safeValue = todo.safeValue(value);
        str = str.replace(match[0], safeValue);
        if (skipOnVariables) {
          todo.regex.lastIndex += value.length;
          todo.regex.lastIndex -= match[0].length;
        } else {
          todo.regex.lastIndex = 0;
        }
        replaces++;
        if (replaces >= this.maxReplaces) {
          break;
        }
      }
    });
    return str;
  }
  nest(str, fc) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let match;
    let value;
    let clonedOptions;
    const handleHasOptions = (key, inheritedOptions) => {
      const sep = this.nestingOptionsSeparator;
      if (key.indexOf(sep) < 0) return key;
      const c2 = key.split(new RegExp(`${sep}[ ]*{`));
      let optionsString = `{${c2[1]}`;
      key = c2[0];
      optionsString = this.interpolate(optionsString, clonedOptions);
      const matchedSingleQuotes = optionsString.match(/'/g);
      const matchedDoubleQuotes = optionsString.match(/"/g);
      if (matchedSingleQuotes && matchedSingleQuotes.length % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) {
        optionsString = optionsString.replace(/'/g, '"');
      }
      try {
        clonedOptions = JSON.parse(optionsString);
        if (inheritedOptions) clonedOptions = {
          ...inheritedOptions,
          ...clonedOptions
        };
      } catch (e) {
        this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
        return `${key}${sep}${optionsString}`;
      }
      if (clonedOptions.defaultValue && clonedOptions.defaultValue.indexOf(this.prefix) > -1) delete clonedOptions.defaultValue;
      return key;
    };
    while (match = this.nestingRegexp.exec(str)) {
      let formatters = [];
      clonedOptions = {
        ...options
      };
      clonedOptions = clonedOptions.replace && !isString(clonedOptions.replace) ? clonedOptions.replace : clonedOptions;
      clonedOptions.applyPostProcessor = false;
      delete clonedOptions.defaultValue;
      let doReduce = false;
      if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
        const r2 = match[1].split(this.formatSeparator).map((elem) => elem.trim());
        match[1] = r2.shift();
        formatters = r2;
        doReduce = true;
      }
      value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
      if (value && match[0] === str && !isString(value)) return value;
      if (!isString(value)) value = makeString(value);
      if (!value) {
        this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
        value = "";
      }
      if (doReduce) {
        value = formatters.reduce((v2, f2) => this.format(v2, f2, options.lng, {
          ...options,
          interpolationkey: match[1].trim()
        }), value.trim());
      }
      str = str.replace(match[0], value);
      this.regexp.lastIndex = 0;
    }
    return str;
  }
}
const parseFormatStr = (formatStr) => {
  let formatName = formatStr.toLowerCase().trim();
  const formatOptions = {};
  if (formatStr.indexOf("(") > -1) {
    const p2 = formatStr.split("(");
    formatName = p2[0].toLowerCase().trim();
    const optStr = p2[1].substring(0, p2[1].length - 1);
    if (formatName === "currency" && optStr.indexOf(":") < 0) {
      if (!formatOptions.currency) formatOptions.currency = optStr.trim();
    } else if (formatName === "relativetime" && optStr.indexOf(":") < 0) {
      if (!formatOptions.range) formatOptions.range = optStr.trim();
    } else {
      const opts = optStr.split(";");
      opts.forEach((opt) => {
        if (opt) {
          const [key, ...rest] = opt.split(":");
          const val = rest.join(":").trim().replace(/^'+|'+$/g, "");
          const trimmedKey = key.trim();
          if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
          if (val === "false") formatOptions[trimmedKey] = false;
          if (val === "true") formatOptions[trimmedKey] = true;
          if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
        }
      });
    }
  }
  return {
    formatName,
    formatOptions
  };
};
const createCachedFormatter = (fn) => {
  const cache = {};
  return (val, lng, options) => {
    let optForCache = options;
    if (options && options.interpolationkey && options.formatParams && options.formatParams[options.interpolationkey] && options[options.interpolationkey]) {
      optForCache = {
        ...optForCache,
        [options.interpolationkey]: void 0
      };
    }
    const key = lng + JSON.stringify(optForCache);
    let formatter = cache[key];
    if (!formatter) {
      formatter = fn(getCleanedCode(lng), options);
      cache[key] = formatter;
    }
    return formatter(val);
  };
};
class Formatter {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = baseLogger.create("formatter");
    this.options = options;
    this.formats = {
      number: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      currency: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt,
          style: "currency"
        });
        return (val) => formatter.format(val);
      }),
      datetime: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.DateTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      relativetime: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.RelativeTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val, opt.range || "day");
      }),
      list: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.ListFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      })
    };
    this.init(options);
  }
  init(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    this.formatSeparator = options.interpolation.formatSeparator || ",";
  }
  add(name, fc) {
    this.formats[name.toLowerCase().trim()] = fc;
  }
  addCached(name, fc) {
    this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
  }
  format(value, format, lng) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const formats = format.split(this.formatSeparator);
    if (formats.length > 1 && formats[0].indexOf("(") > 1 && formats[0].indexOf(")") < 0 && formats.find((f2) => f2.indexOf(")") > -1)) {
      const lastIndex = formats.findIndex((f2) => f2.indexOf(")") > -1);
      formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
    }
    const result = formats.reduce((mem, f2) => {
      const {
        formatName,
        formatOptions
      } = parseFormatStr(f2);
      if (this.formats[formatName]) {
        let formatted = mem;
        try {
          const valOptions = options && options.formatParams && options.formatParams[options.interpolationkey] || {};
          const l2 = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
          formatted = this.formats[formatName](mem, l2, {
            ...formatOptions,
            ...options,
            ...valOptions
          });
        } catch (error2) {
          this.logger.warn(error2);
        }
        return formatted;
      } else {
        this.logger.warn(`there was no format function for ${formatName}`);
      }
      return mem;
    }, value);
    return result;
  }
}
const removePending = (q2, name) => {
  if (q2.pending[name] !== void 0) {
    delete q2.pending[name];
    q2.pendingCount--;
  }
};
class Connector extends EventEmitter {
  constructor(backend, store2, services) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    super();
    this.backend = backend;
    this.store = store2;
    this.services = services;
    this.languageUtils = services.languageUtils;
    this.options = options;
    this.logger = baseLogger.create("backendConnector");
    this.waitingReads = [];
    this.maxParallelReads = options.maxParallelReads || 10;
    this.readingCalls = 0;
    this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
    this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
    this.state = {};
    this.queue = [];
    if (this.backend && this.backend.init) {
      this.backend.init(services, options.backend, options);
    }
  }
  queueLoad(languages, namespaces, options, callback) {
    const toLoad = {};
    const pending = {};
    const toLoadLanguages = {};
    const toLoadNamespaces = {};
    languages.forEach((lng) => {
      let hasAllNamespaces = true;
      namespaces.forEach((ns) => {
        const name = `${lng}|${ns}`;
        if (!options.reload && this.store.hasResourceBundle(lng, ns)) {
          this.state[name] = 2;
        } else if (this.state[name] < 0) ;
        else if (this.state[name] === 1) {
          if (pending[name] === void 0) pending[name] = true;
        } else {
          this.state[name] = 1;
          hasAllNamespaces = false;
          if (pending[name] === void 0) pending[name] = true;
          if (toLoad[name] === void 0) toLoad[name] = true;
          if (toLoadNamespaces[ns] === void 0) toLoadNamespaces[ns] = true;
        }
      });
      if (!hasAllNamespaces) toLoadLanguages[lng] = true;
    });
    if (Object.keys(toLoad).length || Object.keys(pending).length) {
      this.queue.push({
        pending,
        pendingCount: Object.keys(pending).length,
        loaded: {},
        errors: [],
        callback
      });
    }
    return {
      toLoad: Object.keys(toLoad),
      pending: Object.keys(pending),
      toLoadLanguages: Object.keys(toLoadLanguages),
      toLoadNamespaces: Object.keys(toLoadNamespaces)
    };
  }
  loaded(name, err, data) {
    const s2 = name.split("|");
    const lng = s2[0];
    const ns = s2[1];
    if (err) this.emit("failedLoading", lng, ns, err);
    if (!err && data) {
      this.store.addResourceBundle(lng, ns, data, void 0, void 0, {
        skipCopy: true
      });
    }
    this.state[name] = err ? -1 : 2;
    if (err && data) this.state[name] = 0;
    const loaded = {};
    this.queue.forEach((q2) => {
      pushPath(q2.loaded, [lng], ns);
      removePending(q2, name);
      if (err) q2.errors.push(err);
      if (q2.pendingCount === 0 && !q2.done) {
        Object.keys(q2.loaded).forEach((l2) => {
          if (!loaded[l2]) loaded[l2] = {};
          const loadedKeys = q2.loaded[l2];
          if (loadedKeys.length) {
            loadedKeys.forEach((n2) => {
              if (loaded[l2][n2] === void 0) loaded[l2][n2] = true;
            });
          }
        });
        q2.done = true;
        if (q2.errors.length) {
          q2.callback(q2.errors);
        } else {
          q2.callback();
        }
      }
    });
    this.emit("loaded", loaded);
    this.queue = this.queue.filter((q2) => !q2.done);
  }
  read(lng, ns, fcName) {
    let tried = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
    let wait2 = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : this.retryTimeout;
    let callback = arguments.length > 5 ? arguments[5] : void 0;
    if (!lng.length) return callback(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng,
        ns,
        fcName,
        tried,
        wait: wait2,
        callback
      });
      return;
    }
    this.readingCalls++;
    const resolver2 = (err, data) => {
      this.readingCalls--;
      if (this.waitingReads.length > 0) {
        const next = this.waitingReads.shift();
        this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
      }
      if (err && data && tried < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, lng, ns, fcName, tried + 1, wait2 * 2, callback);
        }, wait2);
        return;
      }
      callback(err, data);
    };
    const fc = this.backend[fcName].bind(this.backend);
    if (fc.length === 2) {
      try {
        const r2 = fc(lng, ns);
        if (r2 && typeof r2.then === "function") {
          r2.then((data) => resolver2(null, data)).catch(resolver2);
        } else {
          resolver2(null, r2);
        }
      } catch (err) {
        resolver2(err);
      }
      return;
    }
    return fc(lng, ns, resolver2);
  }
  prepareLoading(languages, namespaces) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let callback = arguments.length > 3 ? arguments[3] : void 0;
    if (!this.backend) {
      this.logger.warn("No backend was added via i18next.use. Will not load resources.");
      return callback && callback();
    }
    if (isString(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
    if (isString(namespaces)) namespaces = [namespaces];
    const toLoad = this.queueLoad(languages, namespaces, options, callback);
    if (!toLoad.toLoad.length) {
      if (!toLoad.pending.length) callback();
      return null;
    }
    toLoad.toLoad.forEach((name) => {
      this.loadOne(name);
    });
  }
  load(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {}, callback);
  }
  reload(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {
      reload: true
    }, callback);
  }
  loadOne(name) {
    let prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    const s2 = name.split("|");
    const lng = s2[0];
    const ns = s2[1];
    this.read(lng, ns, "read", void 0, void 0, (err, data) => {
      if (err) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err);
      if (!err && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
      this.loaded(name, err, data);
    });
  }
  saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
    let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
    let clb = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : () => {
    };
    if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
      this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (key === void 0 || key === null || key === "") return;
    if (this.backend && this.backend.create) {
      const opts = {
        ...options,
        isUpdate
      };
      const fc = this.backend.create.bind(this.backend);
      if (fc.length < 6) {
        try {
          let r2;
          if (fc.length === 5) {
            r2 = fc(languages, namespace, key, fallbackValue, opts);
          } else {
            r2 = fc(languages, namespace, key, fallbackValue);
          }
          if (r2 && typeof r2.then === "function") {
            r2.then((data) => clb(null, data)).catch(clb);
          } else {
            clb(null, r2);
          }
        } catch (err) {
          clb(err);
        }
      } else {
        fc(languages, namespace, key, fallbackValue, clb, opts);
      }
    }
    if (!languages || !languages[0]) return;
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  }
}
const get = () => ({
  debug: false,
  initImmediate: true,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: false,
  supportedLngs: false,
  nonExplicitSupportedLngs: false,
  load: "all",
  preload: false,
  simplifyPluralSuffix: true,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  partialBundledLanguages: false,
  saveMissing: false,
  updateMissing: false,
  saveMissingTo: "fallback",
  saveMissingPlurals: true,
  missingKeyHandler: false,
  missingInterpolationHandler: false,
  postProcess: false,
  postProcessPassResolved: false,
  returnNull: false,
  returnEmptyString: true,
  returnObjects: false,
  joinArrays: false,
  returnedObjectHandler: false,
  parseMissingKeyHandler: false,
  appendNamespaceToMissingKey: false,
  appendNamespaceToCIMode: false,
  overloadTranslationOptionHandler: (args) => {
    let ret = {};
    if (typeof args[1] === "object") ret = args[1];
    if (isString(args[1])) ret.defaultValue = args[1];
    if (isString(args[2])) ret.tDescription = args[2];
    if (typeof args[2] === "object" || typeof args[3] === "object") {
      const options = args[3] || args[2];
      Object.keys(options).forEach((key) => {
        ret[key] = options[key];
      });
    }
    return ret;
  },
  interpolation: {
    escapeValue: true,
    format: (value) => value,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: true
  }
});
const transformOptions = (options) => {
  if (isString(options.ns)) options.ns = [options.ns];
  if (isString(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
  if (isString(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
  if (options.supportedLngs && options.supportedLngs.indexOf("cimode") < 0) {
    options.supportedLngs = options.supportedLngs.concat(["cimode"]);
  }
  return options;
};
const noop$1 = () => {
};
const bindMemberFunctions = (inst) => {
  const mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
  mems.forEach((mem) => {
    if (typeof inst[mem] === "function") {
      inst[mem] = inst[mem].bind(inst);
    }
  });
};
class I18n extends EventEmitter {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    super();
    this.options = transformOptions(options);
    this.services = {};
    this.logger = baseLogger;
    this.modules = {
      external: []
    };
    bindMemberFunctions(this);
    if (callback && !this.isInitialized && !options.isClone) {
      if (!this.options.initImmediate) {
        this.init(options, callback);
        return this;
      }
      setTimeout(() => {
        this.init(options, callback);
      }, 0);
    }
  }
  init() {
    var _this = this;
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    this.isInitializing = true;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (!options.defaultNS && options.defaultNS !== false && options.ns) {
      if (isString(options.ns)) {
        options.defaultNS = options.ns;
      } else if (options.ns.indexOf("translation") < 0) {
        options.defaultNS = options.ns[0];
      }
    }
    const defOpts = get();
    this.options = {
      ...defOpts,
      ...this.options,
      ...transformOptions(options)
    };
    if (this.options.compatibilityAPI !== "v1") {
      this.options.interpolation = {
        ...defOpts.interpolation,
        ...this.options.interpolation
      };
    }
    if (options.keySeparator !== void 0) {
      this.options.userDefinedKeySeparator = options.keySeparator;
    }
    if (options.nsSeparator !== void 0) {
      this.options.userDefinedNsSeparator = options.nsSeparator;
    }
    const createClassOnDemand = (ClassOrObject) => {
      if (!ClassOrObject) return null;
      if (typeof ClassOrObject === "function") return new ClassOrObject();
      return ClassOrObject;
    };
    if (!this.options.isClone) {
      if (this.modules.logger) {
        baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
      } else {
        baseLogger.init(null, this.options);
      }
      let formatter;
      if (this.modules.formatter) {
        formatter = this.modules.formatter;
      } else if (typeof Intl !== "undefined") {
        formatter = Formatter;
      }
      const lu = new LanguageUtil(this.options);
      this.store = new ResourceStore(this.options.resources, this.options);
      const s2 = this.services;
      s2.logger = baseLogger;
      s2.resourceStore = this.store;
      s2.languageUtils = lu;
      s2.pluralResolver = new PluralResolver(lu, {
        prepend: this.options.pluralSeparator,
        compatibilityJSON: this.options.compatibilityJSON,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      });
      if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
        s2.formatter = createClassOnDemand(formatter);
        s2.formatter.init(s2, this.options);
        this.options.interpolation.format = s2.formatter.format.bind(s2.formatter);
      }
      s2.interpolator = new Interpolator(this.options);
      s2.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      };
      s2.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s2.resourceStore, s2, this.options);
      s2.backendConnector.on("*", function(event2) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        _this.emit(event2, ...args);
      });
      if (this.modules.languageDetector) {
        s2.languageDetector = createClassOnDemand(this.modules.languageDetector);
        if (s2.languageDetector.init) s2.languageDetector.init(s2, this.options.detection, this.options);
      }
      if (this.modules.i18nFormat) {
        s2.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
        if (s2.i18nFormat.init) s2.i18nFormat.init(this);
      }
      this.translator = new Translator(this.services, this.options);
      this.translator.on("*", function(event2) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        _this.emit(event2, ...args);
      });
      this.modules.external.forEach((m2) => {
        if (m2.init) m2.init(this);
      });
    }
    this.format = this.options.interpolation.format;
    if (!callback) callback = noop$1;
    if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      if (codes.length > 0 && codes[0] !== "dev") this.options.lng = codes[0];
    }
    if (!this.services.languageDetector && !this.options.lng) {
      this.logger.warn("init: no languageDetector is used and no lng is defined");
    }
    const storeApi = ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"];
    storeApi.forEach((fcName) => {
      this[fcName] = function() {
        return _this.store[fcName](...arguments);
      };
    });
    const storeApiChained = ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"];
    storeApiChained.forEach((fcName) => {
      this[fcName] = function() {
        _this.store[fcName](...arguments);
        return _this;
      };
    });
    const deferred = defer();
    const load = () => {
      const finish = (err, t2) => {
        this.isInitializing = false;
        if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn("init: i18next is already initialized. You should call init just once!");
        this.isInitialized = true;
        if (!this.options.isClone) this.logger.log("initialized", this.options);
        this.emit("initialized", this.options);
        deferred.resolve(t2);
        callback(err, t2);
      };
      if (this.languages && this.options.compatibilityAPI !== "v1" && !this.isInitialized) return finish(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, finish);
    };
    if (this.options.resources || !this.options.initImmediate) {
      load();
    } else {
      setTimeout(load, 0);
    }
    return deferred;
  }
  loadResources(language2) {
    let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop$1;
    let usedCallback = callback;
    const usedLng = isString(language2) ? language2 : this.language;
    if (typeof language2 === "function") usedCallback = language2;
    if (!this.options.resources || this.options.partialBundledLanguages) {
      if (usedLng && usedLng.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return usedCallback();
      const toLoad = [];
      const append = (lng) => {
        if (!lng) return;
        if (lng === "cimode") return;
        const lngs = this.services.languageUtils.toResolveHierarchy(lng);
        lngs.forEach((l2) => {
          if (l2 === "cimode") return;
          if (toLoad.indexOf(l2) < 0) toLoad.push(l2);
        });
      };
      if (!usedLng) {
        const fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        fallbacks.forEach((l2) => append(l2));
      } else {
        append(usedLng);
      }
      if (this.options.preload) {
        this.options.preload.forEach((l2) => append(l2));
      }
      this.services.backendConnector.load(toLoad, this.options.ns, (e) => {
        if (!e && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
        usedCallback(e);
      });
    } else {
      usedCallback(null);
    }
  }
  reloadResources(lngs, ns, callback) {
    const deferred = defer();
    if (typeof lngs === "function") {
      callback = lngs;
      lngs = void 0;
    }
    if (typeof ns === "function") {
      callback = ns;
      ns = void 0;
    }
    if (!lngs) lngs = this.languages;
    if (!ns) ns = this.options.ns;
    if (!callback) callback = noop$1;
    this.services.backendConnector.reload(lngs, ns, (err) => {
      deferred.resolve();
      callback(err);
    });
    return deferred;
  }
  use(module) {
    if (!module) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!module.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    if (module.type === "backend") {
      this.modules.backend = module;
    }
    if (module.type === "logger" || module.log && module.warn && module.error) {
      this.modules.logger = module;
    }
    if (module.type === "languageDetector") {
      this.modules.languageDetector = module;
    }
    if (module.type === "i18nFormat") {
      this.modules.i18nFormat = module;
    }
    if (module.type === "postProcessor") {
      postProcessor.addPostProcessor(module);
    }
    if (module.type === "formatter") {
      this.modules.formatter = module;
    }
    if (module.type === "3rdParty") {
      this.modules.external.push(module);
    }
    return this;
  }
  setResolvedLanguage(l2) {
    if (!l2 || !this.languages) return;
    if (["cimode", "dev"].indexOf(l2) > -1) return;
    for (let li = 0; li < this.languages.length; li++) {
      const lngInLngs = this.languages[li];
      if (["cimode", "dev"].indexOf(lngInLngs) > -1) continue;
      if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
        this.resolvedLanguage = lngInLngs;
        break;
      }
    }
  }
  changeLanguage(lng, callback) {
    var _this2 = this;
    this.isLanguageChangingTo = lng;
    const deferred = defer();
    this.emit("languageChanging", lng);
    const setLngProps = (l2) => {
      this.language = l2;
      this.languages = this.services.languageUtils.toResolveHierarchy(l2);
      this.resolvedLanguage = void 0;
      this.setResolvedLanguage(l2);
    };
    const done = (err, l2) => {
      if (l2) {
        setLngProps(l2);
        this.translator.changeLanguage(l2);
        this.isLanguageChangingTo = void 0;
        this.emit("languageChanged", l2);
        this.logger.log("languageChanged", l2);
      } else {
        this.isLanguageChangingTo = void 0;
      }
      deferred.resolve(function() {
        return _this2.t(...arguments);
      });
      if (callback) callback(err, function() {
        return _this2.t(...arguments);
      });
    };
    const setLng = (lngs) => {
      if (!lng && !lngs && this.services.languageDetector) lngs = [];
      const l2 = isString(lngs) ? lngs : this.services.languageUtils.getBestMatchFromCodes(lngs);
      if (l2) {
        if (!this.language) {
          setLngProps(l2);
        }
        if (!this.translator.language) this.translator.changeLanguage(l2);
        if (this.services.languageDetector && this.services.languageDetector.cacheUserLanguage) this.services.languageDetector.cacheUserLanguage(l2);
      }
      this.loadResources(l2, (err) => {
        done(err, l2);
      });
    };
    if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
      setLng(this.services.languageDetector.detect());
    } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
      if (this.services.languageDetector.detect.length === 0) {
        this.services.languageDetector.detect().then(setLng);
      } else {
        this.services.languageDetector.detect(setLng);
      }
    } else {
      setLng(lng);
    }
    return deferred;
  }
  getFixedT(lng, ns, keyPrefix) {
    var _this3 = this;
    const fixedT = function(key, opts) {
      let options;
      if (typeof opts !== "object") {
        for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          rest[_key3 - 2] = arguments[_key3];
        }
        options = _this3.options.overloadTranslationOptionHandler([key, opts].concat(rest));
      } else {
        options = {
          ...opts
        };
      }
      options.lng = options.lng || fixedT.lng;
      options.lngs = options.lngs || fixedT.lngs;
      options.ns = options.ns || fixedT.ns;
      if (options.keyPrefix !== "") options.keyPrefix = options.keyPrefix || keyPrefix || fixedT.keyPrefix;
      const keySeparator = _this3.options.keySeparator || ".";
      let resultKey;
      if (options.keyPrefix && Array.isArray(key)) {
        resultKey = key.map((k2) => `${options.keyPrefix}${keySeparator}${k2}`);
      } else {
        resultKey = options.keyPrefix ? `${options.keyPrefix}${keySeparator}${key}` : key;
      }
      return _this3.t(resultKey, options);
    };
    if (isString(lng)) {
      fixedT.lng = lng;
    } else {
      fixedT.lngs = lng;
    }
    fixedT.ns = ns;
    fixedT.keyPrefix = keyPrefix;
    return fixedT;
  }
  t() {
    return this.translator && this.translator.translate(...arguments);
  }
  exists() {
    return this.translator && this.translator.exists(...arguments);
  }
  setDefaultNamespace(ns) {
    this.options.defaultNS = ns;
  }
  hasLoadedNamespace(ns) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!this.isInitialized) {
      this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
      return false;
    }
    if (!this.languages || !this.languages.length) {
      this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
      return false;
    }
    const lng = options.lng || this.resolvedLanguage || this.languages[0];
    const fallbackLng = this.options ? this.options.fallbackLng : false;
    const lastLng = this.languages[this.languages.length - 1];
    if (lng.toLowerCase() === "cimode") return true;
    const loadNotPending = (l2, n2) => {
      const loadState = this.services.backendConnector.state[`${l2}|${n2}`];
      return loadState === -1 || loadState === 0 || loadState === 2;
    };
    if (options.precheck) {
      const preResult = options.precheck(this, loadNotPending);
      if (preResult !== void 0) return preResult;
    }
    if (this.hasResourceBundle(lng, ns)) return true;
    if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
    if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
    return false;
  }
  loadNamespaces(ns, callback) {
    const deferred = defer();
    if (!this.options.ns) {
      if (callback) callback();
      return Promise.resolve();
    }
    if (isString(ns)) ns = [ns];
    ns.forEach((n2) => {
      if (this.options.ns.indexOf(n2) < 0) this.options.ns.push(n2);
    });
    this.loadResources((err) => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  loadLanguages(lngs, callback) {
    const deferred = defer();
    if (isString(lngs)) lngs = [lngs];
    const preloaded = this.options.preload || [];
    const newLngs = lngs.filter((lng) => preloaded.indexOf(lng) < 0 && this.services.languageUtils.isSupportedCode(lng));
    if (!newLngs.length) {
      if (callback) callback();
      return Promise.resolve();
    }
    this.options.preload = preloaded.concat(newLngs);
    this.loadResources((err) => {
      deferred.resolve();
      if (callback) callback(err);
    });
    return deferred;
  }
  dir(lng) {
    if (!lng) lng = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language);
    if (!lng) return "rtl";
    const rtlLngs = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"];
    const languageUtils = this.services && this.services.languageUtils || new LanguageUtil(get());
    return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    return new I18n(options, callback);
  }
  cloneInstance() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop$1;
    const forkResourceStore = options.forkResourceStore;
    if (forkResourceStore) delete options.forkResourceStore;
    const mergedOptions = {
      ...this.options,
      ...options,
      ...{
        isClone: true
      }
    };
    const clone = new I18n(mergedOptions);
    if (options.debug !== void 0 || options.prefix !== void 0) {
      clone.logger = clone.logger.clone(options);
    }
    const membersToCopy = ["store", "services", "language"];
    membersToCopy.forEach((m2) => {
      clone[m2] = this[m2];
    });
    clone.services = {
      ...this.services
    };
    clone.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    if (forkResourceStore) {
      clone.store = new ResourceStore(this.store.data, mergedOptions);
      clone.services.resourceStore = clone.store;
    }
    clone.translator = new Translator(clone.services, mergedOptions);
    clone.translator.on("*", function(event2) {
      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }
      clone.emit(event2, ...args);
    });
    clone.init(mergedOptions, callback);
    clone.translator.options = mergedOptions;
    clone.translator.backendConnector.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    return clone;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
}
const instance = I18n.createInstance();
instance.createInstance = I18n.createInstance;
instance.createInstance;
instance.dir;
instance.init;
instance.loadResources;
instance.reloadResources;
instance.use;
instance.changeLanguage;
instance.getFixedT;
instance.t;
instance.exists;
instance.setDefaultNamespace;
instance.hasLoadedNamespace;
instance.loadNamespaces;
instance.loadLanguages;
const matchHtmlEntity = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g;
const htmlEntities = {
  "&amp;": "&",
  "&#38;": "&",
  "&lt;": "<",
  "&#60;": "<",
  "&gt;": ">",
  "&#62;": ">",
  "&apos;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&#34;": '"',
  "&nbsp;": " ",
  "&#160;": " ",
  "&copy;": "©",
  "&#169;": "©",
  "&reg;": "®",
  "&#174;": "®",
  "&hellip;": "…",
  "&#8230;": "…",
  "&#x2F;": "/",
  "&#47;": "/"
};
const unescapeHtmlEntity = (m2) => htmlEntities[m2];
const unescape = (text) => text.replace(matchHtmlEntity, unescapeHtmlEntity);
let defaultOptions = {
  bindI18n: "languageChanged",
  bindI18nStore: "",
  transEmptyNodeValue: "",
  transSupportBasicHtmlNodes: true,
  transWrapTextNodes: "",
  transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
  useSuspense: true,
  unescape
};
const setDefaults = (options = {}) => {
  defaultOptions = {
    ...defaultOptions,
    ...options
  };
};
const initReactI18next = {
  type: "3rdParty",
  init(instance2) {
    setDefaults(instance2.options.react);
  }
};
const {
  slice,
  forEach
} = [];
function defaults(obj) {
  forEach.call(slice.call(arguments, 1), (source) => {
    if (source) {
      for (const prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
const serializeCookie = function(name, val) {
  let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
    path: "/"
  };
  const opt = options;
  const value = encodeURIComponent(val);
  let str = `${name}=${value}`;
  if (opt.maxAge > 0) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge)) throw new Error("maxAge should be a Number");
    str += `; Max-Age=${Math.floor(maxAge)}`;
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += `; Domain=${opt.domain}`;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += `; Path=${opt.path}`;
  }
  if (opt.expires) {
    if (typeof opt.expires.toUTCString !== "function") {
      throw new TypeError("option expires is invalid");
    }
    str += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) str += "; HttpOnly";
  if (opt.secure) str += "; Secure";
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true:
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return str;
};
const cookie = {
  create(name, value, minutes, domain) {
    let cookieOptions = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      path: "/",
      sameSite: "strict"
    };
    if (minutes) {
      cookieOptions.expires = /* @__PURE__ */ new Date();
      cookieOptions.expires.setTime(cookieOptions.expires.getTime() + minutes * 60 * 1e3);
    }
    if (domain) cookieOptions.domain = domain;
    document.cookie = serializeCookie(name, encodeURIComponent(value), cookieOptions);
  },
  read(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(";");
    for (let i2 = 0; i2 < ca.length; i2++) {
      let c2 = ca[i2];
      while (c2.charAt(0) === " ") c2 = c2.substring(1, c2.length);
      if (c2.indexOf(nameEQ) === 0) return c2.substring(nameEQ.length, c2.length);
    }
    return null;
  },
  remove(name) {
    this.create(name, "", -1);
  }
};
var cookie$1 = {
  name: "cookie",
  // Deconstruct the options object and extract the lookupCookie property
  lookup(_ref) {
    let {
      lookupCookie
    } = _ref;
    if (lookupCookie && typeof document !== "undefined") {
      return cookie.read(lookupCookie) || void 0;
    }
    return void 0;
  },
  // Deconstruct the options object and extract the lookupCookie, cookieMinutes, cookieDomain, and cookieOptions properties
  cacheUserLanguage(lng, _ref2) {
    let {
      lookupCookie,
      cookieMinutes,
      cookieDomain,
      cookieOptions
    } = _ref2;
    if (lookupCookie && typeof document !== "undefined") {
      cookie.create(lookupCookie, lng, cookieMinutes, cookieDomain, cookieOptions);
    }
  }
};
var querystring = {
  name: "querystring",
  // Deconstruct the options object and extract the lookupQuerystring property
  lookup(_ref) {
    var _a;
    let {
      lookupQuerystring
    } = _ref;
    let found;
    if (typeof window !== "undefined") {
      let {
        search: search2
      } = window.location;
      if (!window.location.search && ((_a = window.location.hash) == null ? void 0 : _a.indexOf("?")) > -1) {
        search2 = window.location.hash.substring(window.location.hash.indexOf("?"));
      }
      const query = search2.substring(1);
      const params = query.split("&");
      for (let i2 = 0; i2 < params.length; i2++) {
        const pos = params[i2].indexOf("=");
        if (pos > 0) {
          const key = params[i2].substring(0, pos);
          if (key === lookupQuerystring) {
            found = params[i2].substring(pos + 1);
          }
        }
      }
    }
    return found;
  }
};
let hasLocalStorageSupport = null;
const localStorageAvailable = () => {
  if (hasLocalStorageSupport !== null) return hasLocalStorageSupport;
  try {
    hasLocalStorageSupport = window !== "undefined" && window.localStorage !== null;
    const testKey = "i18next.translate.boo";
    window.localStorage.setItem(testKey, "foo");
    window.localStorage.removeItem(testKey);
  } catch (e) {
    hasLocalStorageSupport = false;
  }
  return hasLocalStorageSupport;
};
var localStorage = {
  name: "localStorage",
  // Deconstruct the options object and extract the lookupLocalStorage property
  lookup(_ref) {
    let {
      lookupLocalStorage
    } = _ref;
    if (lookupLocalStorage && localStorageAvailable()) {
      return window.localStorage.getItem(lookupLocalStorage) || void 0;
    }
    return void 0;
  },
  // Deconstruct the options object and extract the lookupLocalStorage property
  cacheUserLanguage(lng, _ref2) {
    let {
      lookupLocalStorage
    } = _ref2;
    if (lookupLocalStorage && localStorageAvailable()) {
      window.localStorage.setItem(lookupLocalStorage, lng);
    }
  }
};
let hasSessionStorageSupport = null;
const sessionStorageAvailable = () => {
  if (hasSessionStorageSupport !== null) return hasSessionStorageSupport;
  try {
    hasSessionStorageSupport = window !== "undefined" && window.sessionStorage !== null;
    const testKey = "i18next.translate.boo";
    window.sessionStorage.setItem(testKey, "foo");
    window.sessionStorage.removeItem(testKey);
  } catch (e) {
    hasSessionStorageSupport = false;
  }
  return hasSessionStorageSupport;
};
var sessionStorage$1 = {
  name: "sessionStorage",
  lookup(_ref) {
    let {
      lookupSessionStorage
    } = _ref;
    if (lookupSessionStorage && sessionStorageAvailable()) {
      return window.sessionStorage.getItem(lookupSessionStorage) || void 0;
    }
    return void 0;
  },
  cacheUserLanguage(lng, _ref2) {
    let {
      lookupSessionStorage
    } = _ref2;
    if (lookupSessionStorage && sessionStorageAvailable()) {
      window.sessionStorage.setItem(lookupSessionStorage, lng);
    }
  }
};
var navigator$1 = {
  name: "navigator",
  lookup(options) {
    const found = [];
    if (typeof navigator !== "undefined") {
      const {
        languages,
        userLanguage,
        language: language2
      } = navigator;
      if (languages) {
        for (let i2 = 0; i2 < languages.length; i2++) {
          found.push(languages[i2]);
        }
      }
      if (userLanguage) {
        found.push(userLanguage);
      }
      if (language2) {
        found.push(language2);
      }
    }
    return found.length > 0 ? found : void 0;
  }
};
var htmlTag = {
  name: "htmlTag",
  // Deconstruct the options object and extract the htmlTag property
  lookup(_ref) {
    let {
      htmlTag: htmlTag2
    } = _ref;
    let found;
    const internalHtmlTag = htmlTag2 || (typeof document !== "undefined" ? document.documentElement : null);
    if (internalHtmlTag && typeof internalHtmlTag.getAttribute === "function") {
      found = internalHtmlTag.getAttribute("lang");
    }
    return found;
  }
};
var path = {
  name: "path",
  // Deconstruct the options object and extract the lookupFromPathIndex property
  lookup(_ref) {
    var _a;
    let {
      lookupFromPathIndex
    } = _ref;
    if (typeof window === "undefined") return void 0;
    const language2 = window.location.pathname.match(/\/([a-zA-Z-]*)/g);
    if (!Array.isArray(language2)) return void 0;
    const index2 = typeof lookupFromPathIndex === "number" ? lookupFromPathIndex : 0;
    return (_a = language2[index2]) == null ? void 0 : _a.replace("/", "");
  }
};
var subdomain = {
  name: "subdomain",
  lookup(_ref) {
    var _a, _b;
    let {
      lookupFromSubdomainIndex
    } = _ref;
    const internalLookupFromSubdomainIndex = typeof lookupFromSubdomainIndex === "number" ? lookupFromSubdomainIndex + 1 : 1;
    const language2 = typeof window !== "undefined" && ((_b = (_a = window.location) == null ? void 0 : _a.hostname) == null ? void 0 : _b.match(/^(\w{2,5})\.(([a-z0-9-]{1,63}\.[a-z]{2,6})|localhost)/i));
    if (!language2) return void 0;
    return language2[internalLookupFromSubdomainIndex];
  }
};
let canCookies = false;
try {
  document.cookie;
  canCookies = true;
} catch (e) {
}
const order = ["querystring", "cookie", "localStorage", "sessionStorage", "navigator", "htmlTag"];
if (!canCookies) order.splice(1, 1);
const getDefaults = () => ({
  order,
  lookupQuerystring: "lng",
  lookupCookie: "i18next",
  lookupLocalStorage: "i18nextLng",
  lookupSessionStorage: "i18nextLng",
  // cache user language
  caches: ["localStorage"],
  excludeCacheFor: ["cimode"],
  // cookieMinutes: 10,
  // cookieDomain: 'myDomain'
  convertDetectedLanguage: (l2) => l2
});
class Browser {
  constructor(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.type = "languageDetector";
    this.detectors = {};
    this.init(services, options);
  }
  init() {
    let services = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
      languageUtils: {}
    };
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let i18nOptions = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.services = services;
    this.options = defaults(options, this.options || {}, getDefaults());
    if (typeof this.options.convertDetectedLanguage === "string" && this.options.convertDetectedLanguage.indexOf("15897") > -1) {
      this.options.convertDetectedLanguage = (l2) => l2.replace("-", "_");
    }
    if (this.options.lookupFromUrlIndex) this.options.lookupFromPathIndex = this.options.lookupFromUrlIndex;
    this.i18nOptions = i18nOptions;
    this.addDetector(cookie$1);
    this.addDetector(querystring);
    this.addDetector(localStorage);
    this.addDetector(sessionStorage$1);
    this.addDetector(navigator$1);
    this.addDetector(htmlTag);
    this.addDetector(path);
    this.addDetector(subdomain);
  }
  addDetector(detector) {
    this.detectors[detector.name] = detector;
    return this;
  }
  detect() {
    let detectionOrder = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.options.order;
    let detected = [];
    detectionOrder.forEach((detectorName) => {
      if (this.detectors[detectorName]) {
        let lookup = this.detectors[detectorName].lookup(this.options);
        if (lookup && typeof lookup === "string") lookup = [lookup];
        if (lookup) detected = detected.concat(lookup);
      }
    });
    detected = detected.map((d2) => this.options.convertDetectedLanguage(d2));
    if (this.services && this.services.languageUtils && this.services.languageUtils.getBestMatchFromCodes) return detected;
    return detected.length > 0 ? detected[0] : null;
  }
  cacheUserLanguage(lng) {
    let caches = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.options.caches;
    if (!caches) return;
    if (this.options.excludeCacheFor && this.options.excludeCacheFor.indexOf(lng) > -1) return;
    caches.forEach((cacheName) => {
      if (this.detectors[cacheName]) this.detectors[cacheName].cacheUserLanguage(lng, this.options);
    });
  }
}
Browser.type = "languageDetector";
const km$8 = "km";
const m$8 = "m";
const to$8 = "to";
const or$2 = "or";
const logout$3 = "Log out";
const save$8 = "Save";
const cancel$8 = "Cancel";
const ok$3 = "OK";
const create$8 = "Create";
const disasters$8 = "Disasters";
const loading$8 = "Loading...";
const preparing_data = "Preparing data";
const loading_events$2 = "Loading disasters";
const legend$8 = "Legend";
const maps$8 = "maps";
const vertical_direction$8 = "Vertical direction";
const horizontal_direction$8 = "Horizontal direction";
const legend_presentation$8 = "Legend presentation";
const layers$8 = "Layers";
const toolbar$8 = {
  map_ruler: "Measure distance",
  locate_me: "Locate me",
  panel_title: "Toolbar",
  download: "Download",
  "delete": "Delete",
  boundary_selector: "Select admin boundary",
  create_layer: "Create layer",
  geometry_uploader: "Upload GeoJSON",
  focused_geometry_editor: "Draw or edit geometry",
  edit_in_osm: "Edit map in OSM",
  record_sensors: "Record sensors",
  tools_label: "Tools",
  selected_area_label: "Selected area",
  upload_mcda: "Upload MCDA"
};
const layer_actions$8 = {
  tooltips: {
    erase: "Erase",
    download: "Download",
    edit: "Edit",
    hide: "Hide",
    show: "Show",
    "delete": "Delete"
  }
};
const feed$8 = "Feed";
const deselect$8 = "Deselect";
const spinner_text$8 = "Gathering data";
const updated$8 = "Updated";
const started$2 = "Started";
const no_data_received$8 = "No data received";
const wrong_data_received$8 = "Wrong data received";
const error$8 = "Error";
const sort_icon$8 = "Sort Icon";
const configs$8 = {
  Kontur_public_feed: "Kontur Public",
  Kontur_public_feed_description: "The feed contains real-time data about Cyclones, Droughts, Earthquakes, Floods, Volcanoes, Wildfires."
};
const errors$8 = {
  "default": "Sorry, we are having issues which will be fixed soon",
  timeout: "Request timeout",
  cannot_connect: "Cannot connect to server",
  forbidden: "Forbidden",
  not_found: "Not found",
  unknown: "Unknown",
  server_error: "Server error",
  error_try_again: "Something went wrong. Please try again"
};
const categories$8 = {
  overlays: "Overlays",
  basemap: "Basemap"
};
const groups$8 = {
  layers_in_selected_area: "Layers in selected area",
  your_layers: "Your layers",
  kontur_analytics: "Kontur analytics",
  qa: "OpenStreetMap inspector",
  osmbasedmap: "OpenStreetMap based",
  other: "Other",
  elevation: "Elevation",
  photo: "Imagery",
  map: "Map"
};
const advanced_analytics_data_list$8 = {
  load_world_data: "Load World Data",
  numerator: "Numerator",
  normalized_by: "Normalized By",
  sum: "Sum",
  min: "Min",
  max: "Max",
  mean: "Mean",
  stddev: "Stddev",
  median: "Median",
  filter_numerator: "Filter Numerator",
  filter_denominator: "Filter Denominator"
};
const mcda$8 = {
  title: "Multi-criteria decision analysis",
  name: "Create MCDA",
  modal_title: "Multi-criteria decision analysis",
  modal_input_name: "Analysis name",
  modal_input_name_placeholder: "e.g., Climate change",
  modal_input_indicators: "Layer list",
  modal_input_indicators_placeholder: "Select layers",
  modal_input_indicators_no_options: "No options",
  btn_save: "Save analysis",
  error_analysis_name_cannot_be_empty: "Analysis name cannot be empty",
  error_invalid_file: "Invalid MCDA file format",
  error_invalid_parameter: "Invalid '{{parameter}}' parameter",
  error_invalid_layer_parameter: "Invalid '{{parameter}}' parameter in '{{axisName}}' layer",
  error_wrong_mcda_version: "Wrong MCDA version",
  legend_title: "Legend",
  legend_subtitle: "Hexagons are colored based on analysis layer settings. Click a hexagon to see its values.",
  layer_editor: {
    save_changes: "Save changes",
    range: "Value range",
    outliers: "Outliers",
    reverse_to_good_bad: "Reverse to Good → Bad",
    reverse_to_bad_good: "Reverse to Bad → Good",
    weight: "Weight",
    transform: "Transform",
    transformation: "Transformation",
    normalize: "Normalize",
    normalization: "Normalization",
    range_buttons: {
      full_range: "Full range",
      "3_sigma": "3σ",
      "2_sigma": "2σ",
      "1_sigma": "1σ"
    },
    outliers_options: {
      clamp: "Clamp",
      hide: "Hide",
      dont_modify: "Don't modify"
    },
    transformations: {
      no_transformation: "No transformation",
      square_root: "Square root: sign(x)⋅√|x|",
      cube_root: "Cube root: ∛x",
      log_one: "log₁₀(x - xmin + 1)",
      log_epsilon: "log₁₀(x - xmin + ε)"
    },
    no: "No",
    max_min: "Max-min",
    errors: {
      weight_cannot_be_empty: "Weight cannot be empty",
      weight_must_be_a_number: "Weight must be a valid number",
      range_from_cannot_be_bigger: "The ‘from’ value cannot be bigger than the ‘to’ value",
      range_cannot_be_empty: "Range cannot be empty",
      range_must_be_a_number: "Range must be a valid number"
    },
    tips: {
      range: "The values that will be considered the worst and the best in your analysis.",
      sentiment: "Determine the direction of sentiment for the layer's impact on the analysis:\n* **Bad → Good**: Higher values indicate a positive sentiment.\n* **Good → Bad**: Higher values indicate a negative sentiment.",
      weight: "By default, all layers contribute equally to the analysis through a weighted average. Adjusting the increased weight of a layer (2, 3, etc.) allows you to assign additional importance to it in the analysis.",
      transform: "Apply calculations to the values. Achieving a more linear distribution will provide more useful information for analysis.\n\n **Note**: Calculations are done before normalization.",
      normalize: "Adjusts values to a standardized scale. This helps compare them easily and make decisions.\n* **Standard score scaling**: This option adjusts values to a standardized scale, ensuring they are all comparable.\n* **No (for specialists only)**: Leaves values unmodified.",
      outliers: "* **Clamp**: Set values above the range to 1 and below the range to 0.\n* **Don’t modify**: Keep 0 and 1 for min and max, but allow outlier scores beyond this range.\n* **Exclude**: Exclude areas where values are out of range."
    }
  },
  bad: "Bad",
  good: "Good"
};
const multivariate$8 = {
  multivariate_analysis: "Multivariate Analysis",
  create_analysis_layer: "Create analysis layer",
  upload_analysis_layer: "Upload analysis layer",
  popup: {
    score_header: "Score {{level}}",
    compare_header: "Compare {{level}}"
  },
  score: "Score",
  compare: "Compare"
};
const search$8 = {
  search_location: "Search location",
  info_block: "You can search for 📍 locations",
  info_block_with_mcda: "You can search for 📍 locations or ask ✨ AI your question like “Where is dead wood”",
  input_placeholder: "Search",
  input_placeholder_mcda: "Search or ask AI",
  locations_no_result: "No locations found",
  mcda_loading_message: "AI is generating an analysis for you",
  mcda_no_result: "No AI suggestion",
  mcda_error_message: "AI engine did not respond. Please try again later",
  mcda_create_analysis: "Create analysis",
  upload_analysis: "“{{name}}” Multi-Criteria Decision Analysis has been created"
};
const event_list$8 = {
  warning_title: "Cannot filter by map view",
  warning_description: "Map is not ready yet, try later",
  bbox_filter_button: "Filter by map view",
  analytics: {
    affected_people: {
      tooltip: "Affected people",
      value: "No humanitarian impact"
    },
    settled_area_tooltip: "Settled area",
    loss_tooltip: "Estimated loss"
  },
  no_event_in_feed: "The disaster was not found in the current disaster feed",
  no_selected_disaster: "No disaster selected",
  chose_disaster: "Choose disaster",
  no_historical_disasters: "No historical disasters in this area",
  no_feed_disasters: "No disasters in this feed",
  no_feed_disasters_matching_your_filters: "No disasters matching your filters",
  no_disasters: "No disasters",
  severity_unknown: "Unknown",
  severity_termination: "Termination",
  severity_minor: "Minor",
  severity_moderate: "Moderate",
  severity_severe: "Severe",
  severity_extreme: "Extreme",
  open_timeline_button: "Timeline"
};
const create_layer$8 = {
  edit_layer: "Edit Layer",
  edit_features: "Edit Features",
  delete_layer: "Delete Layer",
  create_layer: "Create Layer",
  saving_layer: "Saving layer...",
  field_name: "Field name",
  layer_name: "Layer name",
  marker_icon: "Marker icon",
  type: "Type",
  select: "Select",
  short_text: "Short Text",
  long_text: "Long Text",
  link: "Link",
  image: "Image",
  fields: "Fields",
  add_field: "Add field",
  location: "Location",
  edit_feature_placeholder: "Select some feature for start edit feature properties"
};
const analytics_panel$8 = {
  header_title: "Analytics",
  error_loading: "Failed receiving data about selected area. It may be too large.",
  info_short: "Calculations are made for selected area"
};
const advanced_analytics_panel$8 = {
  header_title: "Advanced analytics",
  error: "Error while fetching advanced analytics data"
};
const advanced_analytics_empty$8 = {
  not_found: "Sorry, the requested disaster was not found",
  error: "An error occurred",
  analytics_for_selected: "Analytics for selected area",
  will_be_provided: "will be provided here",
  no_analytics: "No analytics for the selected area"
};
const llm_analytics$8 = {
  header: "AI insights",
  placeholder: {
    select_area: "Select area (<icon1 />,<icon2 />,<icon3 />) you want to explore to get AI Insights.",
    you_can_also: "You can also:",
    fill_bio: "<icon /> <lnk>Fill out analysis objectives</lnk> to personalize AI analysis",
    select_and_save_as_reference_area: "<icon /> Select an area and save it as a reference to compare with another one",
    learn_more: "<lnk><icon/> Learn more about AI Insights</lnk>"
  }
};
const draw_tools$8 = {
  area: "Polygon",
  line: "Line",
  point: "Point",
  finish_drawing: "Finish Drawing",
  caption: "Click on the map to begin drawing",
  no_geometry_error: "No drawn geometry to download",
  overlap_error: "Polygon should not overlap itself",
  save_features: "Save features"
};
const boundary_selector$8 = {
  title: "Focus to administrative boundary"
};
const geometry_uploader$8 = {
  title: "Focus to uploaded geometry",
  error: "Error while reading uploaded file"
};
const focus_geometry$8 = {
  title: "Focus to freehand geometry"
};
const focus_geometry_layer$3 = {
  settings: {
    name: "Selected area"
  }
};
const reference_area_layer$8 = {
  settings: {
    name: "Reference area"
  }
};
const drawings$3 = {
  self_directions_not_supported: "Self intersections are not supported"
};
const bivariate$8 = {
  panel: {
    header: "Bivariate matrix"
  },
  matrix: {
    caption: {
      base_axis: "Base axis",
      annex_axis: "Annex axis",
      tooltip: {
        p1: "Charts involving the Base and Annex axes help establish a relationship between two data sets.",
        li1: "Annex axis - parameters that we analyse",
        li2: "Base axis - reference point in the analysis",
        b: "Ex: the best location to open a cafe",
        p2: "We can explore the number of eatery places (Annex axis) against Population density (Base axis).",
        p3: "In this scenario, we are first interested in a small number of eatery places, and the number of people in that place gives us additional information."
      }
    },
    header: {
      title: "Choose two layers to explore correlations",
      hint: "Layers and correlations are displayed for the current Selected Area"
    },
    icon: {
      population: "Value divided by Population",
      area_km2: "Value divided by Area",
      total_building_count: "Value divided by Total Buildings Estimate",
      populated_area_km2: "Value divided by Populated Area",
      one: "Without divider",
      roads: "Value divided by Total Roads Length"
    },
    progress: {
      rendering: "Rendering",
      applied: "Applied on the map"
    },
    loading_error: "Unfortunately, we cannot display the matrix. Try refreshing the page or come back later."
  },
  legend: {
    high: "High",
    low: "Low",
    medium: "Medium"
  },
  color_manager: {
    not_defined: "Not defined",
    sentiments_combinations_filter: "Sentiments combinations",
    layers_filter: "Layers",
    no_legends: "There are no legends satisfying the conditions.",
    no_data: "No Data.",
    sentiments_tab: "Sentiments",
    color_legends_tab: "Color Legends",
    layers_tab: "Layers (indicators)"
  }
};
const sidebar$8 = {
  biv_color_manager: "Сolor manager",
  edit_osm: "Edit in OpenStreetMap",
  ruler: "Ruler",
  collapse: "Collapse",
  expand: "Expand",
  icon_alt: "Application logo"
};
const login$8 = {
  email: "Email",
  password: "Password",
  login_button: "Login",
  sign_up: "Sign up",
  logging_in: "Logging in...",
  log_in: "Log in",
  forgot_password: "Forgot password?",
  description: "Please log in to change your settings",
  error: {
    email_empty: "Email cannot be empty",
    email_invalid: "Email has to be valid",
    password: "Password cannot be empty",
    connect: "Could not connect to authentication service"
  }
};
const currency$8 = {
  usd: "USD"
};
const subscription$8 = {
  title: "Plans & Pricing",
  price_summary: "* Billed as ${{pricePerYear}} USD once yearly",
  unauthorized_button: "Sign in to subscribe",
  current_plan_button: "Current plan",
  sales_button: "Contact sales",
  book_demo_button: "Book a demo",
  request_trial_button: "Request trial",
  errors: {
    payment_initialization: "There was an error during payment initialization. Please try again or contact our support"
  },
  success_modal: {
    title: "Success",
    thank_you_for_subscribing: "Thank you for subscribing to our platform!",
    after_the_page_refreshes: "After the page refreshes, you can start using Kontur Atlas"
  }
};
const reports$8 = {
  title: "Disaster Ninja Reports",
  no_data: "No data for this report",
  sorting: "Sorting data...",
  loading: "Loading data",
  open_josm: "Open via JOSM remote control",
  josm_logo_alt: "JOSM logo",
  see_all: "See all reports",
  wrong_id: "Wrong report ID",
  description: "<0>Kontur </0> generates several reports that help validate OpenStreetMap quality. They contain links to areas on <4>osm.org </4> and links to open them in the JOSM editor with enabled remote control for editing."
};
const modes$8 = {
  map: "Map",
  about: "About",
  cookies: "Cookies",
  reports: "Reports",
  report: "Report",
  profile: "Profile",
  privacy: "Privacy",
  terms: "Terms",
  user_guide: "User guide"
};
const profile$8 = {
  interfaceTheme: "Theme",
  interfaceLanguage: "Language",
  units: "Units",
  fullName: "Full name",
  email: "Email",
  metric: "metric",
  imperialBeta: "imperial (beta)",
  profileSettingsHeader: "Personalize your experience",
  your_current_job: "your current job",
  area_of_expertise: "area of expertise",
  challenges: "challenges",
  personalization_prompt: "For better personalization, please include details such as:",
  ai_tools_compatibility: "This information is compatible with AI tools",
  improves_analysis: "Improves analysis",
  bio_placeholder: "Bio",
  bio_textarea_placeholder: "e.g. GIS specialist with 5+ years of experience in disaster risk analysis, focused on urban resilience.",
  analysis_objectives: "Analysis objectives",
  objectives_textarea_placeholder: "e.g. Urban planning analysis with a focus on climate resilience. My current challenge is improving flood risk mapping.",
  appSettingsHeader: "Settings",
  your_organization: "Your organization",
  your_contacts: "Your contact info",
  organization_name: "Organization name",
  position: "Position",
  gis_specialists: "GIS specialists in your team",
  saveButton: "Save changes",
  phone_number: "Phone number with country code",
  linkedin: "LinkedIn profile",
  konturTheme: "Kontur",
  HOTTheme: "HOT",
  defaultDisasterFeed: "Default disaster feed",
  defaultOSMeditor: "Default OpenStreetMap editor (beta)",
  successNotification: "All changes have been applied successfully",
  dont_know: "I don’t know",
  languageOption: {
    en: "English",
    es: "Spanish",
    ar: "Arabic",
    ko: "Korean",
    id: "Indonesian",
    de: "German",
    be: "Belarusian",
    ru: "Russian",
    uk: "Ukrainian"
  },
  reference_area: {
    title: "Reference area",
    freehand_geometry: "Freehand geometry",
    to_replace_reference_area: 'You can redefine your reference area on map. Select an area and click "Save as reference area" on toolbar.\n',
    description: "Save an area you are familiar with as a reference. We will use it as a baseline to compare other areas and explain the differences.",
    set_the_reference_area: "Set area on map",
    tooltip_text: "1.Select an area of interest on the map using the Admin Boundary or Draw Geometry tool. <br/> 2. Click the 'Save as Reference' button on the toolbar.",
    accessing_location: "Accessing your location",
    accessing_location_error: "Error. Try another way.",
    select_location: "Select my current location",
    notification: "Your reference area {{name}} has been saved"
  }
};
const current_event$3 = {
  not_found_request: "Sorry, the requested disaster was not found"
};
const locate_me$8 = {
  get_location_error: "Error while getting location",
  feature_title: "Locate me"
};
const episode$3 = "Timeline";
const loading_episodes$8 = "Loading Episodes";
const zoom_to_world$2 = "Zoom to the whole world";
const cookie_banner$8 = {
  header: "We value your privacy",
  body: "We use absolutely necessary cookies to provide you personalized services and optional cookies to improve {{appName}} and your experience. You can manage cookie settings or withdraw consent to optional cookies at any time.\nFor more information, please, check our [Privacy Policy](about/privacy)",
  decline_all: "Decline optional cookies",
  accept_all: "Accept optional cookies"
};
const live_sensor$8 = {
  start: "Start sensor recording",
  finish: "Stop sensor recording",
  finishMessage: "Recording has been finished",
  startMessage: "Recording has been started",
  noSensorsError: "Your device does not have the required sensors"
};
const layer_features_panel$8 = {
  empty: "Layer features within selected area will be provided here",
  noFeatureSelected: "No layer feature selected",
  chooseFeature: "Choose layer feature",
  listInfo: "The list is filtered by selected area and sorted by project number",
  error_loading: "Failed to load layer features data. Please try again.",
  no_features: "No features found in the selected area."
};
const reference_area$8 = {
  save_as_reference_area: "Save as reference area",
  error_couldnt_save: "Unfortunately, we could not save your reference area. Please try again.",
  selected_area_saved_as_reference_area: "Selected area has been saved as reference area in your profile"
};
const en_common = {
  km: km$8,
  m: m$8,
  to: to$8,
  or: or$2,
  logout: logout$3,
  save: save$8,
  cancel: cancel$8,
  ok: ok$3,
  create: create$8,
  disasters: disasters$8,
  loading: loading$8,
  preparing_data,
  loading_events: loading_events$2,
  legend: legend$8,
  maps: maps$8,
  vertical_direction: vertical_direction$8,
  horizontal_direction: horizontal_direction$8,
  legend_presentation: legend_presentation$8,
  layers: layers$8,
  toolbar: toolbar$8,
  layer_actions: layer_actions$8,
  feed: feed$8,
  deselect: deselect$8,
  spinner_text: spinner_text$8,
  updated: updated$8,
  started: started$2,
  no_data_received: no_data_received$8,
  wrong_data_received: wrong_data_received$8,
  error: error$8,
  sort_icon: sort_icon$8,
  configs: configs$8,
  errors: errors$8,
  categories: categories$8,
  groups: groups$8,
  advanced_analytics_data_list: advanced_analytics_data_list$8,
  mcda: mcda$8,
  multivariate: multivariate$8,
  search: search$8,
  event_list: event_list$8,
  create_layer: create_layer$8,
  analytics_panel: analytics_panel$8,
  advanced_analytics_panel: advanced_analytics_panel$8,
  advanced_analytics_empty: advanced_analytics_empty$8,
  llm_analytics: llm_analytics$8,
  draw_tools: draw_tools$8,
  boundary_selector: boundary_selector$8,
  geometry_uploader: geometry_uploader$8,
  focus_geometry: focus_geometry$8,
  focus_geometry_layer: focus_geometry_layer$3,
  reference_area_layer: reference_area_layer$8,
  drawings: drawings$3,
  bivariate: bivariate$8,
  sidebar: sidebar$8,
  login: login$8,
  currency: currency$8,
  subscription: subscription$8,
  reports: reports$8,
  modes: modes$8,
  profile: profile$8,
  current_event: current_event$3,
  locate_me: locate_me$8,
  episode: episode$3,
  loading_episodes: loading_episodes$8,
  zoom_to_world: zoom_to_world$2,
  cookie_banner: cookie_banner$8,
  live_sensor: live_sensor$8,
  layer_features_panel: layer_features_panel$8,
  reference_area: reference_area$8
};
const km$7 = "km";
const m$7 = "m";
const to$7 = "a";
const maps$7 = "mapas";
const save$7 = "Guardar";
const cancel$7 = "Cancelar";
const mcda$7 = {
  btn_cancel: "Cancelar",
  legend_title: "Leyenda",
  layer_editor: {
    outliers_options: {},
    save_changes: "Guardar cambios",
    range_buttons: {},
    transformations: {},
    errors: {},
    tips: {}
  }
};
const create$7 = "Crear";
const disasters$7 = "Desastres";
const loading$7 = "Cargando...";
const legend$7 = "Leyenda";
const vertical_direction$7 = "Dirección vertical";
const horizontal_direction$7 = "Dirección horizontal";
const legend_presentation$7 = "Presentación de la leyenda";
const layers$7 = "Capas";
const bivariate$7 = {
  color_manager: {
    layers_filter: "Capas",
    not_defined: "No definido",
    sentiments_combinations_filter: "Combinaciones de sentimientos",
    no_legends: "No hay leyendas que cumplan las condiciones.",
    no_data: "No hay datos.",
    sentiments_tab: "Sentimientos",
    color_legends_tab: "Leyendas de colores",
    layers_tab: "Capas (indicadores)"
  },
  matrix: {
    caption: {
      base_axis: "Eje base",
      annex_axis: "Eje anexo",
      tooltip: {
        p1: "Las gráficas que incluyen los ejes base y anexo ayudan a establecer una relación entre dos conjuntos de datos.",
        li1: "Eje anexo: parámetros que analizamos",
        li2: "Eje base: punto de referencia en el análisis",
        b: "Ej.: la mejor ubicación para abrir una cafetería",
        p2: "Podemos explorar el número de locales de comida (eje anexo) frente a la densidad de población (eje base).",
        p3: "En este escenario, en primer lugar nos interesa un número reducido de locales de comida, y la cantidad de personas presentes nos da información adicional."
      }
    },
    header: {
      title: "Elija dos capas para explorar las correlaciones",
      hint: "Las capas y correlaciones se muestran para el área seleccionada actual"
    },
    icon: {
      population: "Valor dividido por la población",
      area_km2: "Valor dividido por el área",
      total_building_count: "Valor dividido por la estimación total de edificios",
      populated_area_km2: "Valor dividido por el área poblada",
      one: "Sin divisor",
      roads: "Valor dividido por la longitud total de las carreteras"
    },
    progress: {
      rendering: "Renderizado",
      applied: "Aplicado en el mapa"
    }
  },
  legend: {
    high: "Alto",
    low: "Bajo",
    medium: "Medio"
  }
};
const toolbar$7 = {
  locate_me: "Localizarme"
};
const locate_me$7 = {
  feature_title: "Localizarme",
  get_location_error: "Error al obtener la ubicación"
};
const layer_actions$7 = {
  tooltips: {}
};
const feed$7 = "Fuente";
const deselect$7 = "Anular la selección";
const spinner_text$7 = "Recopilación de datos";
const updated$7 = "Actualizado";
const no_data_received$7 = "No se han recibido datos";
const wrong_data_received$7 = "Se han recibido datos erróneos";
const error$7 = "Error";
const sort_icon$7 = "Icono de ordenar";
const configs$7 = {
  Kontur_public_feed: "Kontur Public",
  Kontur_public_feed_description: "El feed contiene datos en tiempo real sobre Ciclones, Sequías, Terremotos, Inundaciones, Volcanes, Incendios forestales."
};
const errors$7 = {
  forbidden: "Prohibido",
  not_found: "No encontrado",
  unknown: "Desconocido"
};
const event_list$7 = {
  severity_unknown: "Desconocido",
  analytics: {
    affected_people: {
      value: "Sin impacto humanitario"
    },
    loss_tooltip: "Pérdida estimada"
  },
  no_selected_disaster: "No se ha seleccionado ningún desastre",
  chose_disaster: "Seleccione el desastre"
};
const categories$7 = {
  overlays: "Superposiciones",
  basemap: "Mapa base"
};
const groups$7 = {
  layers_in_selected_area: "Capas en el área seleccionada",
  other: "Otros",
  elevation: "Elevación",
  map: "Mapa"
};
const modes$7 = {
  map: "Mapa",
  about: "Acerca de",
  reports: "Informes",
  profile: "Perfil"
};
const advanced_analytics_data_list$7 = {
  load_world_data: "Cargar datos mundiales",
  numerator: "Numerador",
  normalized_by: "Normalizado por",
  sum: "Suma",
  min: "Mín.",
  max: "Máx.",
  mean: "Media",
  stddev: "Desv. est.",
  median: "Mediana",
  filter_denominator: "Filtrar Denominador"
};
const profile$7 = {
  saveButton: "Guardar cambios",
  reference_area: {},
  email: "Correo electrónico",
  interfaceTheme: "Tema",
  interfaceLanguage: "Idioma",
  units: "Unidades",
  metric: "métricas",
  imperialBeta: "imperiales (beta)",
  bio_placeholder: "Bio",
  appSettingsHeader: "Ajustes",
  konturTheme: "Kontur",
  HOTTheme: "HOT",
  defaultDisasterFeed: "Feed de desastres predeterminado",
  defaultOSMeditor: "Editor predeterminado de OpenStreetMap (beta)",
  successNotification: "Todos los cambios se han aplicado correctamente",
  languageOption: {
    en: "Inglés",
    es: "Español",
    ar: "Árabe",
    ko: "Сoreano",
    id: "Indonesio",
    de: "Alemán",
    uk: "Ucranio"
  }
};
const multivariate$7 = {
  popup: {}
};
const search$7 = {
  search_location: "Buscar ubicación"
};
const create_layer$7 = {
  edit_layer: "Editar capa",
  edit_features: "Editar características",
  delete_layer: "Eliminar capa",
  create_layer: "Crear capa",
  saving_layer: "Guardando capa...",
  field_name: "Nombre de campo",
  layer_name: "Nombre de la capa",
  marker_icon: "Icono de marcador",
  type: "Tipo",
  select: "Seleccionar",
  short_text: "Texto corto",
  long_text: "Texto largo",
  link: "Enlace",
  image: "Imagen",
  fields: "Campos",
  add_field: "Agregar campo",
  location: "Ubicación",
  edit_feature_placeholder: "Seleccione una característica para comenzar a editar las propiedades de la misma"
};
const analytics_panel$7 = {
  header_title: "Análisis"
};
const advanced_analytics_panel$7 = {
  header_title: "Análisis avanzado",
  error: "Error en la obtención de datos de análisis Avanzado"
};
const advanced_analytics_empty$7 = {};
const llm_analytics$7 = {
  placeholder: {}
};
const draw_tools$7 = {
  line: "Línea",
  point: "Punto",
  finish_drawing: "Terminar el dibujo",
  caption: "Haga clic en el mapa para empezar a dibujar",
  no_geometry_error: "No hay geometría dibujada para descargar",
  overlap_error: "El polígono no debe superponerse sobre sí mismo",
  save_features: "Guardar características"
};
const boundary_selector$7 = {
  title: "Enfocar en el límite administrativo"
};
const geometry_uploader$7 = {
  title: "Enfocar en la geometría cargada",
  error: "Error al leer el archivo cargado"
};
const focus_geometry$7 = {
  title: "Enfocar en la geometría a mano"
};
const reference_area_layer$7 = {
  settings: {}
};
const sidebar$7 = {
  biv_color_manager: "Administrador de color",
  edit_osm: "Editar en OpenStreetMap",
  ruler: "Regla",
  collapse: "Contraer",
  expand: "Expandir",
  icon_alt: "Logotipo de la aplicación"
};
const login$7 = {
  email: "Correo electrónico",
  password: "Contraseña",
  login_button: "Inicio de sesión",
  sign_up: "Registrarse",
  logging_in: "Iniciando sesión...",
  log_in: "Iniciar sesión",
  description: "Acceda a su cuenta para cambiar los ajustes"
};
const currency$7 = {};
const subscription$7 = {
  errors: {},
  success_modal: {}
};
const reports$7 = {
  title: "Informes de Disaster Ninja",
  no_data: "No hay datos para este informe",
  sorting: "Ordenando datos...",
  loading: "Cargando datos",
  open_josm: "Abrir a través del control remoto JOSM",
  josm_logo_alt: "Logotipo de JOSM",
  see_all: "Ver todos los informes",
  wrong_id: "ID de informe incorrecto",
  description: "<0>Kontur </0> genera una serie de informes útiles para validar la calidad de OpenStreetMap. Contienen enlaces a zonas en <4>osm.org </4> y enlaces para abrirlas en el editor JOSM con control remoto habilitado para la edición."
};
const about$7 = {
  title: "¡Bienvenido a Disaster Ninja!",
  intro: "¿Desea recibir notificaciones sobre desastres en curso? ¿Le interesan los datos de población instantáneos y otros datos analíticos de alguna región del mundo? Disaster Ninja muestra algunas de las capacidades de <2>Kontur</2> para ocuparse de estas necesidades.<br/><br/> Inicialmente la diseñamos como una herramienta de apoyo a los mapeadores de servicios humanitarios. Ahora ha ampliado sus funcionalidades y aplicaciones prácticas. Tanto si trabaja en la gestión de desastres como si construye una ciudad inteligente o realiza investigaciones sobre el cambio climático, Disaster Ninja puede ayudarle a:",
  l1: "1. Estar al día con los últimos eventos peligrosos a nivel mundial.",
  p1: "El panel de Desastres se actualiza continuamente para informarle sobre los acontecimientos en curso. Utiliza la información proporcionada por <2>Kontur Event Feed</2>, a la que también puede acceder a través de la interfaz de la aplicación.",
  l2: "2. Centrarse en su área de interés.",
  p2: "El panel de Herramientas de Dibujo le permite dibujar o subir su propia geometría en el mapa. También puede centrarse en un área o en una unidad administrativa - país, ciudad o región — expuesta a desastres.",
  l3: "3. Recibir análisis de su área de interés.",
  p3: "El panel de Análisis le muestra el número de personas que viven en la zona según <2>Kontur Population</2> y según una estimación de las zonas sin mapear en OpenStreetMap. Los clientes de Kontur tienen acceso a cientos de otros indicadores a través de Advance Analytics.",
  l4: "4. Explorar los datos del mapa y sacar sus propias conclusiones.",
  p4: "El panel Capas le ofrece varias opciones para mostrar dos indicadores en simultáneo en un mapa bivariado, p. ej:, la densidad de población y la distancia a la estación de bomberos más cercana. Utilice las leyendas de colores para evaluar qué áreas requieren atención. <br/>Consejo: en general, el verde indica riesgo bajo / pocas zonas sin mapear, el rojo — riesgo alto / muchas zonas sin mapear.",
  p5: "Además, puede cambiar a Informes en el panel de la izquierda para acceder a los datos sobre posibles errores e inconsistencias en OpenStreetMap y ayudarle a realizar correcciones mapeando la zona correspondiente con el editor JOSM.",
  goToMap: "Ir al mapa ahora",
  p6: "Esperamos que esta herramienta le resulte valiosa. Utilice el chat de Disaster Ninja si tiene alguna pregunta sobre sus funcionalidades y estaremos encantados de ayudarle. También puede contactarnos por correo electrónico en <1>hello@kontur.io</1> si tiene algún comentario o sugerencia para mejorar la herramienta.<br/><br/> Disaster Ninja es un proyecto de código abierto. Encuentre el código en la <8>cuenta de GitHub de Kontur</8>."
};
const loading_episodes$7 = "Cargando episodios";
const cookie_banner$7 = {};
const live_sensor$7 = {};
const layer_features_panel$7 = {};
const reference_area$7 = {};
const es_common = {
  km: km$7,
  m: m$7,
  to: to$7,
  maps: maps$7,
  save: save$7,
  cancel: cancel$7,
  mcda: mcda$7,
  create: create$7,
  disasters: disasters$7,
  loading: loading$7,
  legend: legend$7,
  vertical_direction: vertical_direction$7,
  horizontal_direction: horizontal_direction$7,
  legend_presentation: legend_presentation$7,
  layers: layers$7,
  bivariate: bivariate$7,
  toolbar: toolbar$7,
  locate_me: locate_me$7,
  layer_actions: layer_actions$7,
  feed: feed$7,
  deselect: deselect$7,
  spinner_text: spinner_text$7,
  updated: updated$7,
  no_data_received: no_data_received$7,
  wrong_data_received: wrong_data_received$7,
  error: error$7,
  sort_icon: sort_icon$7,
  configs: configs$7,
  errors: errors$7,
  event_list: event_list$7,
  categories: categories$7,
  groups: groups$7,
  modes: modes$7,
  advanced_analytics_data_list: advanced_analytics_data_list$7,
  profile: profile$7,
  multivariate: multivariate$7,
  search: search$7,
  create_layer: create_layer$7,
  analytics_panel: analytics_panel$7,
  advanced_analytics_panel: advanced_analytics_panel$7,
  advanced_analytics_empty: advanced_analytics_empty$7,
  llm_analytics: llm_analytics$7,
  draw_tools: draw_tools$7,
  boundary_selector: boundary_selector$7,
  geometry_uploader: geometry_uploader$7,
  focus_geometry: focus_geometry$7,
  reference_area_layer: reference_area_layer$7,
  sidebar: sidebar$7,
  login: login$7,
  currency: currency$7,
  subscription: subscription$7,
  reports: reports$7,
  about: about$7,
  loading_episodes: loading_episodes$7,
  cookie_banner: cookie_banner$7,
  live_sensor: live_sensor$7,
  layer_features_panel: layer_features_panel$7,
  reference_area: reference_area$7
};
const km$6 = "كم";
const m$6 = "م";
const to$6 = "إلى";
const maps$6 = "خرائط";
const save$6 = "حفظ";
const cancel$6 = "إلغاء";
const mcda$6 = {
  btn_cancel: "إلغاء",
  legend_title: "عنوان تفسيري",
  layer_editor: {
    outliers_options: {},
    save_changes: "حفظ التغييرات",
    range_buttons: {},
    transformations: {},
    errors: {},
    tips: {}
  }
};
const create$6 = "إنشاء";
const disasters$6 = "كوارث";
const loading$6 = "جارٍ التحميل...";
const legend$6 = "عنوان تفسيري";
const vertical_direction$6 = "الاتجاه الرأسي";
const horizontal_direction$6 = "الاتجاه الأفقي";
const legend_presentation$6 = "عرض العنوان التفسيري";
const layers$6 = "طبقات";
const bivariate$6 = {
  color_manager: {
    layers_filter: "طبقات",
    not_defined: "غير معرف",
    sentiments_combinations_filter: "تركيبات المشاعر",
    no_legends: "لا توجد ملاحظات تفي بالشروط.",
    no_data: "لايوجد بيانات.",
    sentiments_tab: "المشاعر",
    color_legends_tab: "مؤشرات اللون",
    layers_tab: "الطبقات (المؤشرات)"
  },
  matrix: {
    caption: {
      base_axis: "المحور الأساسي",
      annex_axis: "المحور الملحق",
      tooltip: {
        p1: "تساعد المخططات التي تتضمن محوري القاعدة والملحق في إنشاء علاقة بين مجموعتي بيانات.",
        li1: "محور الملحق - المعلمات التي نقوم بتحليلها",
        li2: "المحور الأساسي - النقطة المرجعية في التحليل",
        b: "مثال: أفضل موقع لفتح مقهى",
        p2: "يمكننا استكشاف عدد أماكن المطاعم (المحور الملحق) مقابل الكثافة السكانية (المحور الأساسي).",
        p3: "في هذا السيناريو، نهتم أولاً بعدد صغير من أماكن تناول الطعام ويعطينا عدد الأشخاص في هذا المكان معلومات إضافية."
      }
    },
    header: {
      title: "اختر طبقتين لاستكشاف الارتباطات",
      hint: "يتم عرض الطبقات والارتباطات للمنطقة المحددة الحالية"
    },
    icon: {
      population: "القيمة مقسومة على عدد السكان",
      area_km2: "القيمة مقسومة على المنطقة",
      total_building_count: "القيمة مقسومة على تقدير إجمالي المباني",
      populated_area_km2: "القيمة مقسومة على المنطقة المأهولة",
      one: "بدون فاصل",
      roads: "القيمة مقسومة على إجمالي طول الطرق"
    },
    progress: {
      rendering: "استدعاء",
      applied: "مطبق على الخريطة"
    }
  },
  legend: {
    high: "مرتفع",
    low: "منخفض",
    medium: "متوسط"
  }
};
const toolbar$6 = {
  locate_me: "حدد موقعي"
};
const locate_me$6 = {
  feature_title: "حدد موقعي",
  get_location_error: "حدث خطأ أثناء الحصول على الموقع"
};
const layer_actions$6 = {
  tooltips: {}
};
const feed$6 = "تغذية";
const deselect$6 = "إلغاء";
const spinner_text$6 = "جمع البيانات";
const updated$6 = "تحديث";
const no_data_received$6 = "لم تُستقبل أي بيانات";
const wrong_data_received$6 = "تم استلام بيانات خاطئة";
const error$6 = "خطأ";
const sort_icon$6 = "أيقونة الترتيب";
const configs$6 = {
  Kontur_public_feed: "Kontur Public",
  Kontur_public_feed_description: "يحتوي الموجز على بيانات فورية عن الأعاصير والجفاف والزلازل والفيضانات والبراكين وحرائق الغابات."
};
const errors$6 = {
  forbidden: "محظور",
  not_found: "لم يتم العثور على",
  unknown: "غير معروف"
};
const event_list$6 = {
  severity_unknown: "غير معروف",
  analytics: {
    affected_people: {
      value: "لا أثر إنساني"
    },
    loss_tooltip: "الخسارة المقدرة"
  },
  no_selected_disaster: "لم يتم اختيار كارثة",
  chose_disaster: "اختر كارثة"
};
const categories$6 = {
  overlays: "تراكميات",
  basemap: "الخريطة الأساسية"
};
const groups$6 = {
  layers_in_selected_area: "طبقات في المنطقة المختارة",
  other: "آخر",
  elevation: "ارتفاع",
  map: "الخريطة"
};
const modes$6 = {
  map: "الخريطة",
  about: "عن",
  reports: "التقارير",
  profile: "الملف الشخصي"
};
const advanced_analytics_data_list$6 = {
  load_world_data: "تحميل بيانات العالم",
  numerator: "البسط",
  normalized_by: "تطبيع بواسطة",
  sum: "مجموع",
  min: "الحد الأدنى",
  max: "الحد الأقصى",
  mean: "المتوسط",
  stddev: "Stddev",
  median: "الوسيط",
  filter_denominator: "مقام المرشح"
};
const profile$6 = {
  saveButton: "حفظ التغييرات",
  reference_area: {},
  email: "البريد الإلكتروني",
  interfaceTheme: "النسق",
  interfaceLanguage: "اللغة",
  units: "الوحدات",
  metric: "المقياس",
  imperialBeta: "إمبريالي (بيتا)",
  bio_placeholder: "السيرة",
  appSettingsHeader: "الإعدادات",
  konturTheme: "Kontur",
  HOTTheme: "حار",
  defaultDisasterFeed: "موجز الكوارث الافتراضي",
  defaultOSMeditor: "محرر OpenStreetMap الافتراضي (بيتا)",
  successNotification: "تم تطبيق جميع التغييرات بنجاح",
  languageOption: {
    en: "الإنجليزية",
    es: "الإسبانية",
    ar: "العربية",
    ko: "الكورية",
    id: "الأندونيسية",
    de: "ألمانية",
    uk: "الأوكرانية"
  }
};
const multivariate$6 = {
  popup: {}
};
const search$6 = {
  search_location: "البحث عن الموقع"
};
const create_layer$6 = {
  edit_layer: "تعديل الطبقة",
  edit_features: "تعديل الميزات",
  delete_layer: "حذف الطبقة",
  create_layer: "خلق الطبقة",
  saving_layer: "حفظ الطبقة...",
  field_name: "اسم المجال",
  layer_name: "اسم الطبقة",
  marker_icon: "رمز العلامة",
  type: "النوع",
  select: "تحديد",
  short_text: "نص قصير",
  long_text: "نص طويل",
  link: "رابط",
  image: "صورة",
  fields: "مجالات",
  add_field: "إضافة مجال",
  location: "موقع",
  edit_feature_placeholder: "حدد بعض الميزات لبدء تحرير خصائص الميزة"
};
const analytics_panel$6 = {
  header_title: "التحليلات"
};
const advanced_analytics_panel$6 = {
  header_title: "تحليلات متقدمة",
  error: "خطأ أثناء جلب بيانات التحليلات المتقدمة"
};
const advanced_analytics_empty$6 = {};
const llm_analytics$6 = {
  placeholder: {}
};
const draw_tools$6 = {
  line: "خط",
  point: "نقطة",
  finish_drawing: "إنهاء الرسم",
  caption: "انقر على الخريطة لبدء الرسم",
  no_geometry_error: "لا يوجد مجسم مرسوم للتنزيل",
  overlap_error: "يجب ألا يتداخل المضلع مع نفسه",
  save_features: "حفظ الميزات"
};
const boundary_selector$6 = {
  title: "التركيز على الحدود الإدارية"
};
const geometry_uploader$6 = {
  title: "التركيز على المجسم المحمل",
  error: "خطأ أثناء قراءة الملف الذي تم تحميله"
};
const focus_geometry$6 = {
  title: "ركز على المجسم الحر"
};
const reference_area_layer$6 = {
  settings: {}
};
const sidebar$6 = {
  biv_color_manager: "مدير الألوان",
  edit_osm: "التعديل في OpenStreetMap",
  ruler: "المسطرة",
  collapse: "إغلاق",
  expand: "فتح",
  icon_alt: "شعار التطبيق"
};
const login$6 = {
  email: "البريد الإلكتروني",
  password: "كلمة السر",
  login_button: "تسجيل الدخول",
  sign_up: "إنشاء حساب",
  logging_in: "جارٍ تسجيل الدخول...",
  log_in: "تسجيل الدخول",
  description: "يرجى تسجيل الدخول لتغيير إعداداتك"
};
const currency$6 = {};
const subscription$6 = {
  errors: {},
  success_modal: {}
};
const reports$6 = {
  title: "تقارير Disaster Ninja",
  no_data: "لا توجد بيانات لهذا التقرير",
  sorting: "جارٍ ترتيب البيانات...",
  loading: "جارٍ تحميل البيانات",
  open_josm: "الفتح من خلال وحدة تحكم JOSM عن بعد",
  josm_logo_alt: "شعار JOSM",
  see_all: "عرض جميع التقارير",
  wrong_id: "معرف التقرير خاطئ",
  description: "ينشئ <0> Kontur</0> عدة تقارير تساعد في التحقق من جودة OpenStreetMap. تحتوي هذه التقارير على روابط لمناطق على <4> osm.org </4> وروابط يمكن فتحها في محرر JOSM مع تمكين التحكم عن بعد للتحرير."
};
const about$6 = {};
const loading_episodes$6 = "جارٍ تجميل الحلقات";
const cookie_banner$6 = {};
const live_sensor$6 = {};
const layer_features_panel$6 = {};
const reference_area$6 = {};
const ar_common = {
  km: km$6,
  m: m$6,
  to: to$6,
  maps: maps$6,
  save: save$6,
  cancel: cancel$6,
  mcda: mcda$6,
  create: create$6,
  disasters: disasters$6,
  loading: loading$6,
  legend: legend$6,
  vertical_direction: vertical_direction$6,
  horizontal_direction: horizontal_direction$6,
  legend_presentation: legend_presentation$6,
  layers: layers$6,
  bivariate: bivariate$6,
  toolbar: toolbar$6,
  locate_me: locate_me$6,
  layer_actions: layer_actions$6,
  feed: feed$6,
  deselect: deselect$6,
  spinner_text: spinner_text$6,
  updated: updated$6,
  no_data_received: no_data_received$6,
  wrong_data_received: wrong_data_received$6,
  error: error$6,
  sort_icon: sort_icon$6,
  configs: configs$6,
  errors: errors$6,
  event_list: event_list$6,
  categories: categories$6,
  groups: groups$6,
  modes: modes$6,
  advanced_analytics_data_list: advanced_analytics_data_list$6,
  profile: profile$6,
  multivariate: multivariate$6,
  search: search$6,
  create_layer: create_layer$6,
  analytics_panel: analytics_panel$6,
  advanced_analytics_panel: advanced_analytics_panel$6,
  advanced_analytics_empty: advanced_analytics_empty$6,
  llm_analytics: llm_analytics$6,
  draw_tools: draw_tools$6,
  boundary_selector: boundary_selector$6,
  geometry_uploader: geometry_uploader$6,
  focus_geometry: focus_geometry$6,
  reference_area_layer: reference_area_layer$6,
  sidebar: sidebar$6,
  login: login$6,
  currency: currency$6,
  subscription: subscription$6,
  reports: reports$6,
  about: about$6,
  loading_episodes: loading_episodes$6,
  cookie_banner: cookie_banner$6,
  live_sensor: live_sensor$6,
  layer_features_panel: layer_features_panel$6,
  reference_area: reference_area$6
};
const km$5 = "킬로미터";
const m$5 = "미터";
const to$5 = "목적지";
const maps$5 = "지도";
const save$5 = "저장";
const cancel$5 = "취소";
const mcda$5 = {
  btn_cancel: "취소",
  legend_title: "범례",
  layer_editor: {
    outliers_options: {},
    save_changes: "변경 사항 저장",
    range_buttons: {},
    transformations: {},
    errors: {},
    tips: {}
  }
};
const create$5 = "생성";
const disasters$5 = "재난";
const loading$5 = "로딩 중...";
const legend$5 = "범례";
const vertical_direction$5 = "수직 방향";
const horizontal_direction$5 = "수평 방향";
const legend_presentation$5 = "범례 표시";
const layers$5 = "레이어";
const bivariate$5 = {
  color_manager: {
    layers_filter: "레이어",
    not_defined: "정의되지 않음",
    sentiments_combinations_filter: "감정 조합",
    no_legends: "조건을 충족하는 범례가 없습니다.",
    no_data: "데이터가 없습니다.",
    sentiments_tab: "감정",
    color_legends_tab: "색상 범례",
    layers_tab: "레이어(지표)"
  },
  matrix: {
    caption: {
      base_axis: "기본 축",
      annex_axis: "보조 축",
      tooltip: {
        p1: "기본 축과 보조 축이 포함된 차트를 통해 두 데이터 세트 간의 관계를 설정할 수 있습니다.",
        li1: "보조 축 - 분석 대상 매개변수",
        li2: "기본 축 - 분석의 기준점",
        b: "예: 카페 개업에 최적의 위치",
        p2: "인구 밀도(기본 축)에 대한 음식점 개수(보조 축)를 알아볼 수 있습니다.",
        p3: "이 경우에는 주로 소수의 음식점에 관심이 있는 것이며, 추가적으로 그 장소에 있는 사람 수를 알아볼 수 있습니다."
      }
    },
    header: {
      title: "상관 관계를 알아보려면 두 개의 레이어를 선택합니다.",
      hint: "레이어와 상관 관계가 현재 선택된 영역에 표시됩니다."
    },
    icon: {
      population: "인구로 나눈 값",
      area_km2: "영역으로 나눈 값",
      total_building_count: "전체 건물 추정치로 나눈 값",
      populated_area_km2: "인구 밀집 지역으로 나눈 값",
      one: "나누지 않음",
      roads: "전체 도로 길이로 나눈 값"
    },
    progress: {
      rendering: "렌더링",
      applied: "지도에 적용됨"
    }
  },
  legend: {
    high: "높음",
    low: "낮음",
    medium: "중간"
  }
};
const toolbar$5 = {
  locate_me: "내 위치 확인"
};
const locate_me$5 = {
  feature_title: "내 위치 확인",
  get_location_error: "위치를 가져오는 중에 오류가 발생했습니다."
};
const layer_actions$5 = {
  tooltips: {}
};
const feed$5 = "피드";
const deselect$5 = "선택 취소";
const spinner_text$5 = "데이터 수집";
const updated$5 = "업데이트됨";
const no_data_received$5 = "수신한 데이터 없음";
const wrong_data_received$5 = "잘못된 데이터 수신";
const error$5 = "오류";
const sort_icon$5 = "정렬 아이콘";
const configs$5 = {
  Kontur_public_feed: "Kontur Public",
  Kontur_public_feed_description: "피드에는 사이클론, 가뭄, 지진, 홍수, 화산 폭발, 산불에 대한 실시간 데이터가 포함됩니다."
};
const errors$5 = {
  forbidden: "사용할 수 없음",
  not_found: "찾을 수 없음",
  unknown: "알 수 없음"
};
const event_list$5 = {
  severity_unknown: "알 수 없음",
  analytics: {
    affected_people: {
      value: "인도주의적 영향 없음"
    },
    loss_tooltip: "예상 손해"
  },
  no_selected_disaster: "선택된 재난 없음",
  chose_disaster: "재난 선택"
};
const categories$5 = {
  overlays: "오버레이",
  basemap: "백지도"
};
const groups$5 = {
  layers_in_selected_area: "선택 영역 내 레이어",
  other: "기타",
  elevation: "입면도",
  map: "지도"
};
const modes$5 = {
  map: "지도",
  about: "정보",
  reports: "보고서",
  profile: "프로필"
};
const advanced_analytics_data_list$5 = {
  load_world_data: "전 세계 데이터 로드하기",
  numerator: "분자",
  normalized_by: "정규화 기준:",
  sum: "합계",
  min: "최소",
  max: "최대",
  mean: "평균",
  stddev: "표본 표준 편차",
  median: "중앙값",
  filter_denominator: "분모 필터"
};
const profile$5 = {
  saveButton: "변경 사항 저장",
  reference_area: {},
  email: "이메일",
  interfaceTheme: "주제",
  interfaceLanguage: "언어",
  units: "단위",
  metric: "미터법",
  imperialBeta: "영국식 단위(베타)",
  bio_placeholder: "Bio",
  appSettingsHeader: "설정",
  konturTheme: "Kontur",
  HOTTheme: "HOT",
  defaultDisasterFeed: "기본 재난 피드",
  defaultOSMeditor: "기본 OpenStreetMap 편집기(베타)",
  successNotification: "모든 변경 사항이 성공적으로 적용되었습니다.",
  languageOption: {
    en: "영어",
    es: "스페인어",
    ar: "아랍어",
    ko: "한국어",
    id: "인도네시아 인",
    de: "독일 말",
    uk: "우크라이나 인"
  }
};
const multivariate$5 = {
  popup: {}
};
const search$5 = {
  search_location: "위치 검색"
};
const create_layer$5 = {
  edit_layer: "레이어 편집",
  edit_features: "특성 편집",
  delete_layer: "레이어 삭제",
  create_layer: "레이어 생성",
  saving_layer: "레이어 저장 중...",
  field_name: "필드 이름",
  layer_name: "레이어 이름",
  marker_icon: "마커 아이콘",
  type: "유형",
  select: "선택",
  short_text: "짧은 텍스트",
  long_text: "긴 텍스트",
  link: "링크",
  image: "이미지",
  fields: "필드",
  add_field: "필드 추가",
  location: "위치",
  edit_feature_placeholder: "일부 특성을 선택하여 특성 속성 편집을 시작하세요."
};
const analytics_panel$5 = {
  header_title: "분석"
};
const advanced_analytics_panel$5 = {
  header_title: "고급 분석",
  error: "고급 분석 데이터를 가져오는 중에 오류가 발생했습니다."
};
const advanced_analytics_empty$5 = {};
const llm_analytics$5 = {
  placeholder: {}
};
const draw_tools$5 = {
  line: "라인",
  point: "점",
  finish_drawing: "그리기 완료",
  caption: "그리기를 시작하려면 지도를 클릭하세요.",
  no_geometry_error: "다운로드할 수 있는 기하 도형이 없습니다.",
  overlap_error: "다각형은 그 자체로 겹치지 않아야 합니다.",
  save_features: "특성 저장"
};
const boundary_selector$5 = {
  title: "행정 경계에 초점 맞추기"
};
const geometry_uploader$5 = {
  title: "업로드된 기하 도형에 초점 맞추기",
  error: "업로드된 파일을 읽는 중 오류가 발생했습니다."
};
const focus_geometry$5 = {
  title: "손으로 직접 그린 기하 도형에 초점 맞추기"
};
const reference_area_layer$5 = {
  settings: {}
};
const sidebar$5 = {
  biv_color_manager: "색상 관리자",
  edit_osm: "OpenStreetMap에서 편집",
  ruler: "눈금자",
  collapse: "접기",
  expand: "펼치기",
  icon_alt: "애플리케이션 로고"
};
const login$5 = {
  email: "이메일",
  password: "비밀번호",
  login_button: "로그인",
  sign_up: "가입",
  logging_in: "로그인 중...",
  log_in: "로그인",
  description: "설정을 변경하려면 로그인하세요."
};
const currency$5 = {};
const subscription$5 = {
  errors: {},
  success_modal: {}
};
const reports$5 = {
  title: "Disaster Ninja 보고서",
  no_data: "이 보고서에 데이터가 없습니다.",
  sorting: "데이터 정렬 중...",
  loading: "데이터 로딩 중",
  open_josm: "JOSM 원격 제어를 통해 열기",
  josm_logo_alt: "JOSM 로고",
  see_all: "모든 보고서 보기",
  wrong_id: "잘못된 보고서 ID",
  description: "<0>Kontur</0>는 몇 가지 보고서를 생성하여 OpenStreetMap 품질을 평가하도록 지원합니다. 보고서에는 <4>osm.org </4>의 영역으로 연결되는 링크, 원격 제어가 활성화된 JOSM 편집기에서 해당 영역을 열어 편집할 수 있는 링크가 포함되어 있습니다."
};
const about$5 = {
  title: "Disaster Ninja에 오신 것을 환영합니다!",
  intro: "현재 진행 중인 재난에 대해 알림을 받아보시겠습니까? 전 세계 모든 지역의 인구 데이터와 기타 분석 사항을 즉시 알아보고 싶으신가요? Disaster Ninja에서는 이러한 요구 사항을 해결하기 위해 몇 가지 <2>Kontur</2> 기능을 사용합니다.<br/><br/>처음에는 인도주의적인 문제를 다루기 위한 의사 결정 지원 도구로 고안되었지만, 이제는 기능과 용법이 여러 가지로 늘어났습니다. 재난 관리, 스마트 시티 구축, 기후 변화에 관한 연구 수행 등 어떤 업무를 하더라도 다음과 같은 도움을 드릴 수 있습니다.",
  l1: "1. 전 세계의 최신 위험 이벤트의 동향을 알려 드립니다.",
  p1: "재난 패널이 지속적으로 새로 고침 되어 현재 일어나는 이벤트에 대한 정보를 제공합니다. <2>Kontur 이벤트 피드</2>의 데이터를 사용하며, API를 통해서도 해당 데이터에 액세스할 수 있습니다.",
  l2: "2. 관심 영역을 집중적으로 보여 드립니다.",
  p2: "그리기 도구 패널을 사용하면 자체 기하 도형을 지도에 그리거나 업로드할 수 있습니다. 재난에 노출된 영역이나 행정 단위(예: 국가, 도시, 지역)에 초점을 맞출 수도 있습니다.",
  l3: "3. 집중 영역에 대한 분석을 제공합니다.",
  p3: "분석 패널은 <2>Kontur 인구</2>당 해당 영역에 거주하는 사람의 수와 OpenStreetMap 내 예상 매핑 갭을 보여줍니다. 그 외에도 Kontur 고객은 고급 분석을 통해 수백 가지 지표에 액세스할 수 있습니다.",
  l4: "4. 지도의 데이터를 탐색하여 결론을 내릴 수 있습니다.",
  p4: "레이어 패널을 사용하면 이변수 지도에서 두 가지 지표를 동시에 표시하는 다양한 옵션을 사용할 수 있게 됩니다(예: 인구 밀도, 가장 가까운 소방서까지의 거리). 색상 범례를 사용하여 주의가 필요한 영역을 평가하세요. <br/>힌트: 일반적으로 녹색은 저위험/적은 갭을 의미하고 빨간색은 고위험/많은 갭을 의미합니다.",
  p5: "또한, 왼쪽 패널의 보고서로 이동하여 OpenStreetMap의 잠재적인 오류 및 불일치 데이터에 액세스하고, JOSM 편집기를 통해 각 영역을 매핑하여 해당 데이터를 수정할 수도 있습니다.",
  goToMap: "지금 바로 지도로 이동하세요.",
  p6: "이 도구가 많은 도움이 되기를 바랍니다. 기능에 대해 궁금한 점은 Disaster Ninja의 챗박스를 통해 언제든지 문의해 주시면 도와 드리겠습니다. 도구 개선에 대한 피드백이나 제안 사항이 있을 경우, <1>hello@kontur.io</1> 로 이메일 주셔도 됩니다.<br/><br/>Disaster Ninja는 오픈 소스 프로젝트입니다. <8>Kontur의 GitHub 계정</8>에서 코드를 찾아보세요."
};
const loading_episodes$5 = "에피소드 로딩 중";
const cookie_banner$5 = {};
const live_sensor$5 = {};
const layer_features_panel$5 = {};
const reference_area$5 = {};
const ko_common = {
  km: km$5,
  m: m$5,
  to: to$5,
  maps: maps$5,
  save: save$5,
  cancel: cancel$5,
  mcda: mcda$5,
  create: create$5,
  disasters: disasters$5,
  loading: loading$5,
  legend: legend$5,
  vertical_direction: vertical_direction$5,
  horizontal_direction: horizontal_direction$5,
  legend_presentation: legend_presentation$5,
  layers: layers$5,
  bivariate: bivariate$5,
  toolbar: toolbar$5,
  locate_me: locate_me$5,
  layer_actions: layer_actions$5,
  feed: feed$5,
  deselect: deselect$5,
  spinner_text: spinner_text$5,
  updated: updated$5,
  no_data_received: no_data_received$5,
  wrong_data_received: wrong_data_received$5,
  error: error$5,
  sort_icon: sort_icon$5,
  configs: configs$5,
  errors: errors$5,
  event_list: event_list$5,
  categories: categories$5,
  groups: groups$5,
  modes: modes$5,
  advanced_analytics_data_list: advanced_analytics_data_list$5,
  profile: profile$5,
  multivariate: multivariate$5,
  search: search$5,
  create_layer: create_layer$5,
  analytics_panel: analytics_panel$5,
  advanced_analytics_panel: advanced_analytics_panel$5,
  advanced_analytics_empty: advanced_analytics_empty$5,
  llm_analytics: llm_analytics$5,
  draw_tools: draw_tools$5,
  boundary_selector: boundary_selector$5,
  geometry_uploader: geometry_uploader$5,
  focus_geometry: focus_geometry$5,
  reference_area_layer: reference_area_layer$5,
  sidebar: sidebar$5,
  login: login$5,
  currency: currency$5,
  subscription: subscription$5,
  reports: reports$5,
  about: about$5,
  loading_episodes: loading_episodes$5,
  cookie_banner: cookie_banner$5,
  live_sensor: live_sensor$5,
  layer_features_panel: layer_features_panel$5,
  reference_area: reference_area$5
};
const km$4 = "km";
const m$4 = "m";
const to$4 = "ke";
const maps$4 = "peta";
const save$4 = "Simpan";
const cancel$4 = "Batalkan";
const mcda$4 = {
  btn_cancel: "Batalkan",
  legend_title: "Legenda",
  layer_editor: {
    outliers_options: {},
    save_changes: "Simpan perubahan",
    range_buttons: {},
    transformations: {},
    errors: {},
    tips: {}
  }
};
const create$4 = "Buat";
const disasters$4 = "Bencana";
const loading$4 = "Memuat...";
const legend$4 = "Legenda";
const vertical_direction$4 = "Arah vertikal";
const horizontal_direction$4 = "Arah horizontal";
const legend_presentation$4 = "Penyajian legenda";
const layers$4 = "Lapisan";
const bivariate$4 = {
  color_manager: {
    layers_filter: "Lapisan",
    not_defined: "Tidak terdefinisi",
    sentiments_combinations_filter: "Gabungan sentimen",
    no_legends: "Tidak ada legenda yang memenuhi kondisi ini.",
    no_data: "Tidak Ada Data.",
    sentiments_tab: "Sentimen",
    color_legends_tab: "Legenda Warna",
    layers_tab: "Lapisan (indikator)"
  },
  matrix: {
    caption: {
      base_axis: "Sumbu Dasar",
      annex_axis: "Sumbu Tambahan",
      tooltip: {
        p1: "Diagram yang mencakup sumbu Dasar dan sumbu Tambahan membantu menetapkan hubungan antara dua kumpulan data.",
        li1: "Sumbu Tambahan - parameter yang kita analisis",
        li2: "Sumbu Dasar - titik referensi dalam analisis",
        b: "Contoh: lokasi terbaik untuk membuka kafe",
        p2: "Kita dapat menyelidiki jumlah tempat makan (sumbu Tambahan) terhadap Kerapatan populasi (sumbu Dasar).",
        p3: "Dalam skenario ini, pada awalnya kita tertarik dengan beberapa tempat makan, lalu kita mendapatkan informasi tambahan dari jumlah orang di tempat itu."
      }
    },
    header: {
      title: "Pilih dua lapisan untuk memeriksa korelasi",
      hint: "Lapisan dan korelasi ditampilkan untuk Area Pilihan terkini"
    },
    icon: {
      population: "Nilai dibagi dengan Populasi",
      area_km2: "Nilai dibagi dengan Area",
      total_building_count: "Nilai dibagi dengan Perkiraan Jumlah Bangunan",
      populated_area_km2: "Nilai dibagi dengan Area Berpenduduk",
      one: "Tanpa pembagi",
      roads: "Nilai dibagi dengan Total Panjang Jalan"
    },
    progress: {
      rendering: "Merender",
      applied: "Diterapkan pada peta"
    }
  },
  legend: {
    high: "Tinggi",
    low: "Rendah",
    medium: "Sedang"
  }
};
const toolbar$4 = {
  locate_me: "Temukan saya"
};
const locate_me$4 = {
  feature_title: "Temukan saya",
  get_location_error: "Kesalahan saat memperoleh lokasi"
};
const layer_actions$4 = {
  tooltips: {}
};
const feed$4 = "Feed";
const deselect$4 = "Batalkan Pilihan";
const spinner_text$4 = "Mengumpulkan data";
const updated$4 = "Diperbarui";
const no_data_received$4 = "Tidak ada data yang diterima";
const wrong_data_received$4 = "Data yang diterima salah";
const error$4 = "Kesalahan";
const sort_icon$4 = "Sortir Ikon";
const configs$4 = {
  Kontur_public_feed: "Publik Kontur",
  Kontur_public_feed_description: "Feed berisi data waktu-nyata tentang Angin Topan, Kekeringan, Gempa, Banjir, Gunung Meletus, Kebakaran Hutan."
};
const errors$4 = {
  forbidden: "Terlarang",
  not_found: "Tidak ditemukan",
  unknown: "Tidak diketahui"
};
const event_list$4 = {
  severity_unknown: "Tidak diketahui",
  analytics: {
    affected_people: {
      value: "Tidak berdampak kemanusiaan"
    },
    loss_tooltip: "Estimasi kerugian"
  },
  no_selected_disaster: "Tidak ada bencana yang dipilih",
  chose_disaster: "Pilih bencana"
};
const categories$4 = {
  overlays: "Tumpang Susun",
  basemap: "Peta Dasar"
};
const groups$4 = {
  layers_in_selected_area: "Lapisan di area pilihan",
  other: "Lainnya",
  elevation: "Elevasi",
  map: "Peta"
};
const modes$4 = {
  map: "Peta",
  about: "Tentang",
  reports: "Laporan",
  profile: "Profil"
};
const advanced_analytics_data_list$4 = {
  load_world_data: "Memuat Data Dunia",
  numerator: "Pembilang",
  normalized_by: "Dinormalkan Dengan",
  sum: "Jumlah",
  min: "Min",
  max: "Maks",
  mean: "Rerata",
  stddev: "Simpangan baku",
  median: "Median",
  filter_denominator: "Filter Penyebut"
};
const profile$4 = {
  saveButton: "Simpan perubahan",
  reference_area: {},
  email: "Email",
  interfaceTheme: "Tema",
  interfaceLanguage: "Bahasa",
  units: "Satuan",
  metric: "metrik",
  imperialBeta: "imperial (beta)",
  bio_placeholder: "Bio",
  appSettingsHeader: "Pengaturan",
  konturTheme: "Kontur",
  HOTTheme: "HANGAT",
  defaultDisasterFeed: "Feed bencana bawaan",
  defaultOSMeditor: "Editor OpenStreetMap bawaan (beta)",
  successNotification: "Semua perubahan telah berhasil diterapkan",
  languageOption: {
    en: "Inggris",
    es: "Spanyol",
    ar: "Arab",
    ko: "Korea",
    id: "Indonesia",
    de: "Jerman",
    uk: "Orang Ukraina"
  }
};
const multivariate$4 = {
  popup: {}
};
const search$4 = {
  search_location: "Cari lokasi"
};
const create_layer$4 = {
  edit_layer: "Edit Lapisan",
  edit_features: "Edit Fitur",
  delete_layer: "Hapus Lapisan",
  create_layer: "Buat Lapisan",
  saving_layer: "Menyimpan lapisan...",
  field_name: "Nama bidang",
  layer_name: "Nama lapisan",
  marker_icon: "Ikon penanda",
  type: "Jenis",
  select: "Pilih",
  short_text: "Teks Singkat",
  long_text: "Teks Panjang",
  link: "Tautan",
  image: "Gambar",
  fields: "Bidang",
  add_field: "Tambahkan bidang",
  location: "Lokasi",
  edit_feature_placeholder: "Pilih beberapa fitur untuk mulai mengedit properti fitur"
};
const analytics_panel$4 = {
  header_title: "Analitik"
};
const advanced_analytics_panel$4 = {
  header_title: "Analitik tingkat lanjut",
  error: "Kesalahan saat mengambil data analitik tingkat lanjut"
};
const advanced_analytics_empty$4 = {};
const llm_analytics$4 = {
  placeholder: {}
};
const draw_tools$4 = {
  line: "Garis",
  point: "Titik",
  finish_drawing: "Selesai Menggambar",
  caption: "Klik peta untuk mulai menggambar",
  no_geometry_error: "Tidak ada gambar geometri untuk diunduh",
  overlap_error: "Poligon tidak boleh bertumpang-tindih sendiri",
  save_features: "Simpan fitur"
};
const boundary_selector$4 = {
  title: "Fokus ke batas administratif"
};
const geometry_uploader$4 = {
  title: "Fokus ke geometri unggahan",
  error: "Kesalahan saat membaca file unggahan"
};
const focus_geometry$4 = {
  title: "Fokus ke geometri bebas"
};
const reference_area_layer$4 = {
  settings: {}
};
const sidebar$4 = {
  biv_color_manager: "Pengelola warna",
  edit_osm: "Edit di OpenStreetMap",
  ruler: "Penggaris",
  collapse: "Ciutkan",
  expand: "Bentangkan",
  icon_alt: "Logo aplikasi"
};
const login$4 = {
  email: "Email",
  password: "Kata Sandi",
  login_button: "Masuk",
  sign_up: "Daftar",
  logging_in: "Masuk...",
  log_in: "Masuk",
  description: "Masuk untuk mengubah pengaturan Anda"
};
const currency$4 = {};
const subscription$4 = {
  errors: {},
  success_modal: {}
};
const reports$4 = {
  title: "Laporan Disaster Ninja",
  no_data: "Tidak ada data untuk laporan ini",
  sorting: "Menyortir data...",
  loading: "Memuat data",
  open_josm: "Buka melalui kendali jarak jaruh JOSM",
  josm_logo_alt: "Logo JOSM",
  see_all: "Lihat semua laporan",
  wrong_id: "ID laporan salah",
  description: "<0>Kontur </0> menghasilkan beberapa laporan yang membantu memvalidasi kualitas OpenStreetMap. Laporan tersebut berisi tautan ke area di <4>osm.org </4> dan tautan untuk membukanya di editor JOSM dengan kendali jarak jauh untuk pengeditan yang diaktifkan."
};
const about$4 = {
  title: "Selamat datang di Disaster Ninja!",
  intro: "Apakah Anda ingin menerima kabar tentang bencana yang sedang terjadi? Anda tertarik dengan data populasi dan analitik lainnya yang tersaji seketika untuk wilayah mana pun di dunia? Disaster Ninja menampilkan beberapa kemampuan dari <2>Kontur</2> dalam mengatasi berbagai kebutuhan ini.<br/><br/>Pada awalnya, kami merancang alat ini sebagai alat bantu untuk pemetaan kemanusiaan. Kini, fungsionalitas dan kasus penggunaannya telah bertambah. Apakah Anda bekerja pada pengelolaan bencana, membangun kota cerdas, ataupun meneliti perubahan iklim, Disaster Ninja dapat membantu Anda untuk:",
  l1: "1. Selalu mendapatkan kabar terbaru tentang kejadian berbahaya terkini di seluruh dunia.",
  p1: "Panel Bencana disegarkan secara terus-menerus untuk memberi tahu Anda kejadian yang sedang berlangsung. Panel ini memakai data dari <2>Feed Kejadian Kontur</2>, yang juga dapat diakses melalui API.",
  l2: "2. Fokus pada area perhatian Anda.",
  p2: "Panel Peralatan Gambar memungkinkan Anda menggambar atau mengunggah geometri Anda sendiri pada peta. Anda juga dapat berfokus pada area yang terpapar bencana atau satuan administratif — negara, kota, atau wilayah.",
  l3: "3. Dapatkan analitik untuk area yang menjadi fokus.",
  p3: "Panel Analitik memperlihatkan jumlah orang yang tinggal di area tersebut untuk setiap <2>Populasi Kontur</2> dan perkiraan kesenjangan pemetaan di OpenStreetMap. Pelanggan Kontur memiliki akses ke ratusan indikator lainnya melalui Analitik Lanjut.",
  l4: "4. Selidiki data pada peta dan buat kesimpulan.",
  p4: "Panel Lapisan memberi Anda berbagai opsi untuk menampilkan dua indikator secara serentak pada peta bivariat, misalnya kepadatan populasi dan jarak ke stasiun pemadam kebakaran terdekat. Gunakan legenda warna untuk menilai area mana yang perlu diperhatikan. <br/>Petunjuk: secara umum, warna hijau menunjukkan risiko rendah/sedikit kesenjangan, warna merah — risiko tinggi/banyak kesenjangan.",
  p5: "Selain itu, Anda dapat beralih ke Laporan di panel kiri untuk mengakses data tentang potensi kesalahan dan inkonsistensi di OpenStreetMap serta membantu memperbaikinya dengan memetakan masing-masing area menggunakan editor JOSM.",
  goToMap: "Buka peta sekarang",
  p6: "Kami berharap agar alat ini bermanfaat bagi Anda. Gunakan kotak obrolan di Disaster Ninja untuk setiap pertanyaan tentang fungsionalitas, dan kami dengan senang hati akan memandu Anda. Anda juga dapat menghubungi kami melalui email di <1>hello@kontur.io</1> jika Anda memiliki tanggapan atau saran untuk meningkatkan alat ini.<br/><br/>Disaster Ninja adalah proyek sumber terbuka. Temukan kodenya di <8>akun GitHub Kontur</8>."
};
const loading_episodes$4 = "Memuat Episode";
const cookie_banner$4 = {};
const live_sensor$4 = {};
const layer_features_panel$4 = {};
const reference_area$4 = {};
const id_common = {
  km: km$4,
  m: m$4,
  to: to$4,
  maps: maps$4,
  save: save$4,
  cancel: cancel$4,
  mcda: mcda$4,
  create: create$4,
  disasters: disasters$4,
  loading: loading$4,
  legend: legend$4,
  vertical_direction: vertical_direction$4,
  horizontal_direction: horizontal_direction$4,
  legend_presentation: legend_presentation$4,
  layers: layers$4,
  bivariate: bivariate$4,
  toolbar: toolbar$4,
  locate_me: locate_me$4,
  layer_actions: layer_actions$4,
  feed: feed$4,
  deselect: deselect$4,
  spinner_text: spinner_text$4,
  updated: updated$4,
  no_data_received: no_data_received$4,
  wrong_data_received: wrong_data_received$4,
  error: error$4,
  sort_icon: sort_icon$4,
  configs: configs$4,
  errors: errors$4,
  event_list: event_list$4,
  categories: categories$4,
  groups: groups$4,
  modes: modes$4,
  advanced_analytics_data_list: advanced_analytics_data_list$4,
  profile: profile$4,
  multivariate: multivariate$4,
  search: search$4,
  create_layer: create_layer$4,
  analytics_panel: analytics_panel$4,
  advanced_analytics_panel: advanced_analytics_panel$4,
  advanced_analytics_empty: advanced_analytics_empty$4,
  llm_analytics: llm_analytics$4,
  draw_tools: draw_tools$4,
  boundary_selector: boundary_selector$4,
  geometry_uploader: geometry_uploader$4,
  focus_geometry: focus_geometry$4,
  reference_area_layer: reference_area_layer$4,
  sidebar: sidebar$4,
  login: login$4,
  currency: currency$4,
  subscription: subscription$4,
  reports: reports$4,
  about: about$4,
  loading_episodes: loading_episodes$4,
  cookie_banner: cookie_banner$4,
  live_sensor: live_sensor$4,
  layer_features_panel: layer_features_panel$4,
  reference_area: reference_area$4
};
const km$3 = "km";
const m$3 = "m";
const to$3 = "bis";
const maps$3 = "Karten";
const save$3 = "Speichern";
const cancel$3 = "Abbrechen";
const mcda$3 = {
  btn_cancel: "Abbrechen",
  legend_title: "Legende",
  layer_editor: {
    outliers_options: {},
    save_changes: "Änderungen speichern",
    range_buttons: {},
    transformations: {},
    errors: {},
    tips: {}
  }
};
const create$3 = "Erstellen";
const disasters$3 = "Katastrophen";
const loading$3 = "Wird geladen...";
const legend$3 = "Legende";
const vertical_direction$3 = "Vertikale Richtung";
const horizontal_direction$3 = "Horizontale Richtung";
const legend_presentation$3 = "Darstellung der Legende";
const layers$3 = "Ebenen";
const bivariate$3 = {
  color_manager: {
    layers_filter: "Ebenen",
    not_defined: "Nicht definiert",
    sentiments_combinations_filter: "Stimmungs-Kombinationen",
    no_legends: "Es gibt keine Legenden, die den Kriterien entsprechen.",
    no_data: "Keine Daten.",
    sentiments_tab: "Stimmungen",
    color_legends_tab: "Farbe Legenden",
    layers_tab: "Ebenen (Indikatoren)"
  },
  matrix: {
    caption: {
      base_axis: "Basisachse",
      annex_axis: "Hilfsachse",
      tooltip: {
        p1: "Diagramme mit der Basis- und der Hilfsachse helfen, eine Beziehung zwischen zwei Datensätzen herzustellen.",
        li1: "Hilfsachse - Parameter, die wir analysieren",
        li2: "Basisachse - Referenzpunkt in der Analyse",
        b: "Beispiel: der beste Standort für die Eröffnung eines Cafés",
        p2: "Wir können die Anzahl der Lokale (Hilfsachse) gegen die Bevölkerungsdichte (Basisachse) untersuchen.",
        p3: "In diesem Szenario liegt unser Interesse zunächst auf einer kleinen Anzahl von Lokalen, wobei uns die Anzahl der Personen in diesem Ort zusätzliche Informationen liefert."
      }
    },
    header: {
      title: "Wählen Sie zwei Ebenen, um Zusammenhänge zu untersuchen",
      hint: "Die Ebenen und Zusammenhänge werden für den aktuellen ausgewählten Bereich angezeigt"
    },
    icon: {
      population: "Wert geteilt durch Einwohnerzahl",
      area_km2: "Wert geteilt durch Fläche",
      total_building_count: "Wert geteilt durch geschätzte Gesamtbebauung",
      populated_area_km2: "Wert geteilt durch bevölkerte Fläche",
      one: "Ohne Teilung",
      roads: "Wert geteilt durch die Gesamtlänge der Straßen"
    },
    progress: {
      rendering: "Übertragung",
      applied: "Wird auf die Karte angewendet"
    }
  },
  legend: {
    high: "Hoch",
    low: "Niedrig",
    medium: "Mittel"
  }
};
const toolbar$3 = {
  locate_me: "Standort finden"
};
const locate_me$3 = {
  feature_title: "Standort finden",
  get_location_error: "Fehler beim Abrufen des Standorts"
};
const layer_actions$3 = {
  tooltips: {}
};
const feed$3 = "Feed";
const deselect$3 = "Auswahl aufheben";
const spinner_text$3 = "Daten sammeln";
const updated$3 = "Aktualisiert";
const no_data_received$3 = "Keine Daten erhalten";
const wrong_data_received$3 = "Falsche Daten empfangen";
const error$3 = "Fehler";
const sort_icon$3 = "Sortiersymbol";
const configs$3 = {
  Kontur_public_feed: "Kontur Öffentlichkeit",
  Kontur_public_feed_description: "Der Feed enthält Echtzeitdaten über Wirbelstürme, Dürren, Erdbeben, Überschwemmungen, Vulkanausbrüche und Waldbrände."
};
const errors$3 = {
  forbidden: "Verboten",
  not_found: "Nicht gefunden",
  unknown: "Unbekannt"
};
const event_list$3 = {
  severity_unknown: "Unbekannt",
  analytics: {
    affected_people: {
      value: "Keine humanitären Auswirkungen"
    },
    loss_tooltip: "Geschätzter Verlust"
  },
  no_selected_disaster: "Keine Katastrophe ausgewählt",
  chose_disaster: "Katastrophe auswählen"
};
const categories$3 = {
  overlays: "Überlagerungen",
  basemap: "Basiskarte"
};
const groups$3 = {
  layers_in_selected_area: "Ebenen im ausgewählten Bereich",
  other: "Andere",
  elevation: "Höhe",
  map: "Karte"
};
const modes$3 = {
  map: "Karte",
  about: "Über uns",
  reports: "Berichte",
  profile: "Profil"
};
const advanced_analytics_data_list$3 = {
  load_world_data: "Weltdaten laden",
  numerator: "Zähler",
  normalized_by: "Normalisiert auf",
  sum: "Summe",
  min: "Min",
  max: "Max",
  mean: "Mittelwert",
  stddev: "SD",
  median: "Median",
  filter_denominator: "Filter Nenner"
};
const profile$3 = {
  saveButton: "Änderungen speichern",
  reference_area: {},
  email: "E-Mail",
  interfaceTheme: "Thema",
  interfaceLanguage: "Sprache",
  units: "Einheiten",
  metric: "metrisch",
  imperialBeta: "imperial (beta)",
  bio_placeholder: "Bio",
  appSettingsHeader: "Einstellungen",
  konturTheme: "Kontur",
  HOTTheme: "HOT",
  defaultDisasterFeed: "Standardmäßige Katastrophenmeldung",
  defaultOSMeditor: "Standardmäßiger OpenStreetMap-Editor (Beta)",
  successNotification: "Alle Änderungen wurden erfolgreich übernommen",
  languageOption: {
    en: "Englisch",
    es: "Spanisch",
    ar: "Arabisch",
    ko: "Koreanisch",
    id: "Indonesisch",
    de: "Deutsch",
    uk: "Ukrainisch"
  }
};
const multivariate$3 = {
  popup: {}
};
const search$3 = {
  search_location: "Standort suchen"
};
const create_layer$3 = {
  edit_layer: "Ebene bearbeiten",
  edit_features: "Merkmale bearbeiten",
  delete_layer: "Ebene löschen",
  create_layer: "Ebene erstellen",
  saving_layer: "Ebene wird gespeichert...",
  field_name: "Feldname",
  layer_name: "Name der Ebene",
  marker_icon: "Markierungssymbol",
  type: "Typ",
  select: "Auswählen",
  short_text: "Kurzer Text",
  long_text: "Langer Text",
  link: "Link",
  image: "Bild",
  fields: "Felder",
  add_field: "Feld hinzufügen",
  location: "Standort",
  edit_feature_placeholder: "Wählen Sie einige Merkmale aus, um Merkmalseigenschaften zu bearbeiten"
};
const analytics_panel$3 = {
  header_title: "Analytik"
};
const advanced_analytics_panel$3 = {
  header_title: "Erweiterte Analytik",
  error: "Fehler beim Abrufen von erweiterten Analysedaten"
};
const advanced_analytics_empty$3 = {};
const llm_analytics$3 = {
  placeholder: {}
};
const draw_tools$3 = {
  line: "Linie",
  point: "Punkt",
  finish_drawing: "Zeichnen beenden",
  caption: "Klicken Sie auf die Karte, um mit dem Zeichnen zu beginnen",
  no_geometry_error: "Keine gezeichnete Formen zum Herunterladen",
  overlap_error: "Das Polygon darf sich nicht überschneiden",
  save_features: "Merkmale speichern"
};
const boundary_selector$3 = {
  title: "Fokus auf die Verwaltungsgrenze"
};
const geometry_uploader$3 = {
  title: "Fokus auf die hochgeladene geometrische Form",
  error: "Fehler beim Lesen der hochgeladenen Datei"
};
const focus_geometry$3 = {
  title: "Fokus auf freihändig gezeichnete Formen"
};
const reference_area_layer$3 = {
  settings: {}
};
const sidebar$3 = {
  biv_color_manager: "Farbmanager",
  edit_osm: "In OpenStreetMap bearbeiten",
  ruler: "Lineal",
  collapse: "Zusammenklappen",
  expand: "Erweitern",
  icon_alt: "Logo der Anwendung"
};
const login$3 = {
  email: "E-Mail",
  password: "Passwort",
  login_button: "Anmelden",
  sign_up: "Registrieren",
  logging_in: "Anmelden...",
  log_in: "Einloggen",
  description: "Bitte melden Sie sich an, um Ihre Einstellungen zu ändern"
};
const currency$3 = {};
const subscription$3 = {
  errors: {},
  success_modal: {}
};
const reports$3 = {
  title: "Disaster Ninja Berichte",
  no_data: "Keine Daten für diesen Bericht",
  sorting: "Daten werden sortiert...",
  loading: "Daten werden geladen",
  open_josm: "Öffnen über die JOSM-Fernsteuerung",
  josm_logo_alt: "JOSM-Logo",
  see_all: "Alle Berichte anzeigen",
  wrong_id: "Falsche Berichts-ID",
  description: "<0>Kontur </0> generiert verschiedene Berichte, die bei der Überprüfung der Qualität von OpenStreetMap helfen. Sie enthalten Links zu Gebieten auf <4>osm.org </4> und Links, um sie im JOSM-Editor mit aktivierter Fernsteuerung zur Bearbeitung öffnen zu können."
};
const about$3 = {
  title: "Willkommen bei Disaster Ninja!",
  intro: "Möchten Sie über aktuelle Katastrophen informiert werden? Sind Sie an sofortigen Bevölkerungsdaten und anderen Analysen für eine beliebige Region auf der Welt interessiert? Disaster Ninja zeigt Ihnen einige der Funktionen von <2>Kontur</2>, mit denen diese Anforderungen umgesetzt werden können.<br/><br/>Ursprünglich haben wir es als Entscheidungshilfe für Kartografen im humanitären Bereich entwickelt. Mittlerweile ist der Funktionsumfang und der Anwendungsbereich des Programms erweitert worden. Ganz gleich, ob Sie im Katastrophenmanagement tätig sind, eine intelligente Stadt bauen oder über den Klimawandel forschen, Disaster Ninja kann Ihnen dabei helfen:",
  l1: "1. Über die aktuellen Gefahrenereignisse weltweit auf dem Laufenden zu bleiben.",
  p1: "Das Bedienfeld von Disasters wird kontinuierlich aktualisiert, um Sie über aktuelle Ereignisse zu informieren. Es bezieht die Daten aus dem <2>Kontur Ereignis-Feed</2>, auf den Sie auch über eine API zugreifen können.",
  l2: "2. Den Fokus auf Ihr Interessengebiet zu legen.",
  p2: "Mit den Zeichenwerkzeugen können Sie Ihre eigene geometrische Form auf die Karte zeichnen oder hochladen. Sie können sich auch auf ein von einer Katastrophe betroffenes Gebiet oder eine Verwaltungseinheit - ein Land, eine Stadt oder eine Region - konzentrieren.",
  l3: "3. Die Analytik für den ausgewählten Bereich aufrufen.",
  p3: "Das Bedienfeld Analytik zeigt die Anzahl der in diesem Gebiet lebenden Menschen pro <2>Kontur Bevölkerung</2> und geschätzte Kartierungslücken in OpenStreetMap. Kontur-Kunden haben über Erweiterte Analytik Zugang zu Hunderten von weiteren Indikatoren.",
  l4: "4. Die Daten auf der Karte entdecken und Schlussfolgerungen ziehen.",
  p4: "Das Ebenen-Panel bietet Ihnen verschiedene Optionen, um zwei Indikatoren gleichzeitig auf einer bivariaten Karte anzuzeigen, z. B. die Bevölkerungsdichte und die Entfernung zur nächsten Feuerwache. Verwenden Sie die Farblegende, um zu beurteilen, welche Bereiche Aufmerksamkeit erfordern. <br/>Tipp: Im Allgemeinen bedeutet grün ein geringes Risiko / wenige Lücken, rot ein hohes Risiko / viele Lücken.",
  p5: "Außerdem können Sie im linken Bereich zu Berichte wechseln, um auf Daten zu potenziellen Fehlern und Unstimmigkeiten in OpenStreetMap zuzugreifen und dabei zu helfen, diese zu beheben, indem Sie das entsprechende Gebiet mit dem JOSM-Editor kartieren.",
  goToMap: "Jetzt die Karte aufrufen",
  p6: "Wir hoffen, dass dieses Tool Ihnen von Nutzen ist. Wenn Sie Fragen zur Funktionalität haben, können Sie die Chatbox auf Disaster Ninja nutzen, und wir helfen Ihnen gerne weiter. Sie können uns auch eine E-Mail an <1>hello@kontur.io</1> schreiben, wenn Sie Feedback oder Vorschläge zur Verbesserung des Tools haben.<br/><br/>Disaster Ninja ist ein Open-Source-Projekt. Sie finden den Code in <8>Konturs GitHub-Konto</8>."
};
const loading_episodes$3 = "Episoden werden geladen";
const cookie_banner$3 = {};
const live_sensor$3 = {};
const layer_features_panel$3 = {};
const reference_area$3 = {};
const de_common = {
  km: km$3,
  m: m$3,
  to: to$3,
  maps: maps$3,
  save: save$3,
  cancel: cancel$3,
  mcda: mcda$3,
  create: create$3,
  disasters: disasters$3,
  loading: loading$3,
  legend: legend$3,
  vertical_direction: vertical_direction$3,
  horizontal_direction: horizontal_direction$3,
  legend_presentation: legend_presentation$3,
  layers: layers$3,
  bivariate: bivariate$3,
  toolbar: toolbar$3,
  locate_me: locate_me$3,
  layer_actions: layer_actions$3,
  feed: feed$3,
  deselect: deselect$3,
  spinner_text: spinner_text$3,
  updated: updated$3,
  no_data_received: no_data_received$3,
  wrong_data_received: wrong_data_received$3,
  error: error$3,
  sort_icon: sort_icon$3,
  configs: configs$3,
  errors: errors$3,
  event_list: event_list$3,
  categories: categories$3,
  groups: groups$3,
  modes: modes$3,
  advanced_analytics_data_list: advanced_analytics_data_list$3,
  profile: profile$3,
  multivariate: multivariate$3,
  search: search$3,
  create_layer: create_layer$3,
  analytics_panel: analytics_panel$3,
  advanced_analytics_panel: advanced_analytics_panel$3,
  advanced_analytics_empty: advanced_analytics_empty$3,
  llm_analytics: llm_analytics$3,
  draw_tools: draw_tools$3,
  boundary_selector: boundary_selector$3,
  geometry_uploader: geometry_uploader$3,
  focus_geometry: focus_geometry$3,
  reference_area_layer: reference_area_layer$3,
  sidebar: sidebar$3,
  login: login$3,
  currency: currency$3,
  subscription: subscription$3,
  reports: reports$3,
  about: about$3,
  loading_episodes: loading_episodes$3,
  cookie_banner: cookie_banner$3,
  live_sensor: live_sensor$3,
  layer_features_panel: layer_features_panel$3,
  reference_area: reference_area$3
};
const km$2 = "км";
const m$2 = "м";
const to$2 = "до";
const maps$2 = "мапи";
const logout$2 = "Вийти";
const save$2 = "Зберегти";
const cancel$2 = "Скасувати";
const mcda$2 = {
  btn_cancel: "Скасувати",
  legend_title: "Легенда",
  layer_editor: {
    outliers_options: {
      hide: "Приховати"
    },
    save_changes: "Зберегти зміни",
    range_buttons: {},
    transformations: {},
    errors: {},
    tips: {}
  }
};
const ok$2 = "OK";
const create$2 = "Створити";
const disasters$2 = "Катастрофа";
const loading$2 = "Завантаження...";
const legend$2 = "Легенда";
const vertical_direction$2 = "По вертикалі";
const horizontal_direction$2 = "По горизонталі";
const legend_presentation$2 = "Презентація легенди";
const layers$2 = "Шари";
const bivariate$2 = {
  color_manager: {
    layers_filter: "Шари",
    not_defined: "Не задано",
    sentiments_combinations_filter: "Комбінація сентиментів",
    no_legends: "Немає легенд, що задовольняють умовам.",
    no_data: "Немає даних.",
    sentiments_tab: "Сентименти",
    color_legends_tab: "Легенда кольорів",
    layers_tab: "Шари (індикатори)"
  },
  panel: {
    header: "Біваріативна Матриця"
  },
  matrix: {
    caption: {
      base_axis: "Базова вісь",
      annex_axis: "Додаткова вісь",
      tooltip: {
        p1: "Діаграми, що містять базову та додаткову осі, допомагають встановити зв’язок між двома наборами даних.",
        li1: "Додаткова вісь - параметри, які ми аналізуємо",
        li2: "Базова вісь - орієнтир при аналізі",
        b: "Наприклад: найкраще місце щоб відкрити кафе",
        p2: "Ми можемо дослідити кількість закладів харчування (додаткова вісь) проти щільності населення (базова вісь).",
        p3: "У цьому сценарії нас спочатку цікавить невелика кількість закладів харчування, а кількість людей у цьому місці дає нам додаткову інформацію."
      }
    },
    header: {
      title: "Виберіть два шари, щоб дослідити їх кореляції",
      hint: "Шари та кореляції показані для виділеної області"
    },
    icon: {
      population: "Значення, поділене на кількість населення",
      area_km2: "Значення, поділене на площу",
      total_building_count: "Значення, поділене на загальну кількість будівель",
      populated_area_km2: "Значення, поділене на заселену площу",
      one: "Без знаменника",
      roads: "Значення, поділене на загальну довжину доріг"
    },
    progress: {
      rendering: "Візуалізація",
      applied: "Нанесено на карту"
    },
    loading_error: "На жаль, ми не можемо показати матрицю. Спробуйте оновити сторінку або зачекать."
  },
  legend: {
    high: "Високий",
    low: "Низький",
    medium: "Середній"
  }
};
const toolbar$2 = {
  map_ruler: "Виміряти відстань",
  locate_me: "Знайти мене",
  panel_title: "Панель інструментів",
  download: "Завантажити",
  "delete": "Видалити",
  boundary_selector: "Вибрати адміністративний кордон",
  create_layer: "Створити шар",
  geometry_uploader: "Завантажити GeoJSON",
  focused_geometry_editor: "Намалювати або редагувати геометрію",
  edit_in_osm: "Редагувати мапу в OpenStreetMap",
  record_sensors: "Записати дані сенсорів",
  tools_label: "Інструменти",
  selected_area_label: "Вибрана область",
  upload_mcda: "Завантажити MCDA"
};
const locate_me$2 = {
  feature_title: "Знайти мене",
  get_location_error: "Помилка під час визначення місцеположення"
};
const layer_actions$2 = {
  tooltips: {
    download: "Завантажити",
    erase: "Стерти",
    edit: "Редагувати",
    hide: "Приховати",
    show: "Показати"
  }
};
const focus_geometry_layer$2 = {
  settings: {
    name: "Вибрана область"
  }
};
const feed$2 = "Стрічка";
const deselect$2 = "Зняти вибір";
const spinner_text$2 = "Збираємо дані";
const updated$2 = "Оновлено";
const no_data_received$2 = "Немає даних";
const wrong_data_received$2 = "Отримано неправильні дані";
const error$2 = "Помилка";
const sort_icon$2 = "Значок сортування";
const configs$2 = {
  Kontur_public_feed_description: "Стрічка містить дані в реальному часі про циклони, посухи, землетруси, повені, вулкани, лісові пожежі."
};
const errors$2 = {
  "default": "Вибачте, у нас виникли проблеми, які незабаром будуть вирішені",
  timeout: "Час очікування запиту минув",
  cannot_connect: "Не вдається під'єднатися до сервера",
  forbidden: "Заборонено",
  not_found: "Не знайдено",
  unknown: "Невідомий",
  server_error: "Помилка серверу",
  error_try_again: "Щось пішло не так. Будь ласка, спробуйте знову"
};
const event_list$2 = {
  severity_unknown: "Невідомий",
  warning_description: "Карта ще не готова, спробуйте пізніше",
  analytics: {
    affected_people: {
      tooltip: "Люди які постраждали",
      value: "Жодного гуманітарного впливу"
    },
    settled_area_tooltip: "Заселений район",
    loss_tooltip: "Орієнтовні збитки"
  },
  no_selected_disaster: "Катастрофа не вибрана",
  chose_disaster: "Виберіть катастрофу",
  no_historical_disasters: "Катастроф на цій території не знайдено",
  no_feed_disasters: "У стрічці немає катастроф",
  no_disasters: "Ніяких катастроф",
  severity_termination: "Припинення",
  severity_minor: "Незначний",
  severity_moderate: "Помірний",
  severity_severe: "Сильний",
  severity_extreme: "Екстримальний",
  open_timeline_button: "Відкрити темпоральну шкалу"
};
const categories$2 = {
  overlays: "Оверлеї",
  basemap: "Базова карта"
};
const groups$2 = {
  layers_in_selected_area: "Шари у вибраній області",
  your_layers: "Ваші шари",
  kontur_analytics: "Аналітика Kontur",
  qa: "Інспектор OpenStreetMap",
  osmbasedmap: "На основі OpenStreetMap",
  other: "Інше",
  elevation: "Рел'єф",
  photo: "Зображення",
  map: "Мапа"
};
const modes$2 = {
  map: "Мапа",
  about: "Про нас",
  reports: "Звіти",
  profile: "Профіль",
  privacy: "Конфіденційність"
};
const advanced_analytics_data_list$2 = {
  load_world_data: "Завантажити дані на всю планету",
  numerator: "Чисельник",
  normalized_by: "Нормалізовано за",
  sum: "Сума",
  min: "Мін.",
  max: "Макс.",
  mean: "Середнє",
  stddev: "Стандартне відхилення",
  median: "Медіана",
  filter_numerator: "Фільтр чисельника",
  filter_denominator: "Фільтр знаменника"
};
const profile$2 = {
  saveButton: "Зберегти зміни",
  reference_area: {},
  email: "Електронна пошта",
  interfaceTheme: "Тема",
  interfaceLanguage: "Мова",
  units: "Одиниці вимірювання",
  metric: "метрична система",
  imperialBeta: "англійська система (бета)",
  bio_placeholder: "Про себе",
  appSettingsHeader: "Налаштування",
  position: "Позиція",
  defaultDisasterFeed: "Стрічка катастроф за замовчуванням",
  defaultOSMeditor: "Редактор OpenStreetMap за замовчуванням (бета)",
  successNotification: "Усі зміни успішно застосовано",
  languageOption: {
    en: "Англійська",
    es: "Іспанська",
    ar: "Арабська",
    ko: "Корейська",
    id: "Індонезійська",
    de: "Німецька",
    be: "Білоруська",
    ru: "Російська",
    uk: "Українська"
  }
};
const multivariate$2 = {
  popup: {}
};
const search$2 = {
  search_location: "Знайти місцеположення",
  mcda_create_analysis: "Створити аналіз"
};
const episode$2 = "Відкрити темпоральну шкалу";
const create_layer$2 = {
  edit_layer: "Редагувати шар",
  edit_features: "Редагувати об'єкт",
  delete_layer: "Видалити шар",
  create_layer: "Створити шар",
  saving_layer: "Зберігаємо зміни...",
  field_name: "Назва поля",
  layer_name: "Назва шару",
  marker_icon: "Значок маркера",
  type: "Тип",
  select: "Вибрати",
  short_text: "Текст(короткий)",
  long_text: "Текст(довгий)",
  link: "Посилання",
  image: "Зображення",
  fields: "Поля",
  add_field: "Додати поле",
  location: "Позиція",
  edit_feature_placeholder: "Виберіть об’єкт для редагування його значень"
};
const analytics_panel$2 = {
  header_title: "Аналітика",
  info_short: "Аналітика для обраної території"
};
const advanced_analytics_panel$2 = {
  header_title: "Розширена аналітика",
  error: "Помилка під час отримання даних розширеної аналітики"
};
const advanced_analytics_empty$2 = {
  not_found: "Вибачте, запитана катастрофа не знайдена",
  error: "Сталася помилка",
  analytics_for_selected: "Аналітика для обраної території",
  will_be_provided: "буде надано тут"
};
const current_event$2 = {
  not_found_request: "Вибачте, запитана катастрофа не знайдена"
};
const llm_analytics$2 = {
  placeholder: {}
};
const draw_tools$2 = {
  line: "Лінія",
  point: "Точка",
  finish_drawing: "Закінчити малювання",
  caption: "Натисніть на карту, щоб почати малювати",
  no_geometry_error: "Немає геометрії для завантаження",
  overlap_error: "Полігон не має перетинати сам себе",
  save_features: "Зберегти об'єкти"
};
const boundary_selector$2 = {
  title: "Фокусувати на адміністративну одиницю"
};
const geometry_uploader$2 = {
  title: "Фокусувати на завантажену геометрію",
  error: "Помилка під час завантаження файлу"
};
const focus_geometry$2 = {
  title: "Фокусувати на намальовану геометрію"
};
const reference_area_layer$2 = {
  settings: {}
};
const drawings$2 = {
  self_directions_not_supported: "Самоперетин не підтримується!"
};
const sidebar$2 = {
  biv_color_manager: "Редактор кольорів",
  edit_osm: "Редагувати в OpenStreetMap",
  ruler: "Лінійка",
  collapse: "Згорнути",
  expand: "Розгорнути",
  icon_alt: "Логотип аплікації"
};
const login$2 = {
  email: "Електронна пошта",
  password: "Пароль",
  login_button: "Логін",
  sign_up: "Зареєструватися",
  logging_in: "Входимо...",
  log_in: "Увійти",
  forgot_password: "Забули пароль?",
  description: "Увійдіть, щоб змінити налаштування",
  error: {
    email_empty: "Електронна пошта не може бути пустою",
    email_invalid: "Електронна пошта має бути коректною",
    password: "Пароль не може бути пустим",
    connect: "Не вдалося під'єднатися до служби аутентифікації"
  }
};
const currency$2 = {};
const subscription$2 = {
  errors: {},
  success_modal: {}
};
const reports$2 = {
  title: "Звіти Disaster Ninja",
  no_data: "Нема даних для звіту",
  sorting: "Сортуємо дані...",
  loading: "Завантажуємо дані",
  open_josm: "Відкрити в JOSM",
  josm_logo_alt: "Логотип JOSM",
  see_all: "Дивитися всі звіти",
  wrong_id: "Неправильний ID звіту",
  description: "<0>Kontur </0> генерує декілька звітів які допомагають перевіряти якість даних OpenStreetMap. Вони містять посилання на <4>osm.org</4> і посилання, щоб відкрити їх у редакторі JOSM для редагування."
};
const about$2 = {
  title: "Вітаємо на Disaster Ninja!",
  intro: "Ви хочете отримувати повідомлення про катастрофи? Вас цікавлять миттєві дані про населення та інша аналітика для будь-якого регіону світу? Disaster Ninja від <2>Kontur</2> може задовольнити ці потреби.<br/><br/> Ми розробили це як інструмент підтримки прийняття рішень для гуманітарних картографів. Тепер його функціональність зросла. Незалежно від того, чи працюєте ви в сфері боротьби зі стихійними лихами, будуєте розумне місто чи проводите дослідження щодо зміни клімату, Disaster Ninja може вам допомогти:",
  l1: "1. Будьте в курсі останніх катастроф у всьому світі.",
  p1: "Панель Катастроф постійно оновлюється, щоб інформувати вас про поточні події. Дані отримані з каналу подій <2>Kontur</2>, до якого також можна отримати доступ через API.",
  l2: "2. Фокусуйтеся на вашій сфері інтересів.",
  p2: 'Панель "Інструменти малювання" дозволяє малювати або завантажувати власну геометрію на карту. Ви також можете фокусуватися на області, що постраждала від стихійного лиха, або на адміністративній одиниці — країна, район чи місто.',
  l3: "3. Отримайте аналітику для вибраної області.",
  p3: "Панель Аналітика показує кількість людей, які проживають у цьому регіоні на основі <2>населення Kontur</2> і потенційні прогалини картографування в OpenStreetMap. Клієнти Kontur мають доступ до сотень інших показників за допомогою Детальної Аналітики.",
  l4: "4. Досліджуйте дані на карті та робіть висновки.",
  p4: 'Панель "Шари" надає різні параметри для одночасного відображення двох індикаторів на карті, наприклад, щільність населення та відстань до найближчої пожежної частини. Використовуйте легенду кольорів, щоб визначити, які області потребують уваги. <br/>Підказка: загалом зелений колір означає низький ризик / мало прогалин, червоний — високий ризик / багато прогалин.',
  p5: "Крім того, ви можете перейти до звітів на лівій панелі, щоб отримати доступ до даних про потенційні помилки та невідповідності в даних OpenStreetMap і допомогти їх виправити, наприклад за допомогою редактора JOSM.",
  goToMap: "Перейти до мапи",
  p6: "Ми сподіваємося, що цей інструмент буде корисний. Використовуйте вікно чату на Disaster Ninja, щоб задати будь-які запитання щодо функціональності, і ми з радістю допоможемо вам. Ви також можете зв’язатися з нами електронною поштою <1>hello@kontur.io</1> якщо у вас є відгуки чи пропозиції щодо вдосконалення інструменту.<br/><br/> Disaster Ninja є проєктом з відкритим кодом. Дивіться код в обліковому записі GitHub <8>Kontur</8>."
};
const loading_episodes$2 = "Завантаження епізодів";
const cookie_banner$2 = {
  header: "Ми цінуємо вашу приватність",
  body: "Ми використовуємо абсолютно необхідні файли cookies, щоб надавати вам персоналізовані послуги, і додаткові файли cookies, щоб покращити Disaster Ninja та ваш досвід. Ви можете будь-коли змінити налаштування файлів cookies або відкликати згоду на використання додаткових файлів cookies.\nЩоб дізнатися більше, перегляньте нашу [Політику конфіденційності](about/privacy)",
  decline_all: "Відхилити файли cookies",
  accept_all: "Прийняти файли cookies"
};
const live_sensor$2 = {
  start: "Почати запис даних з сенсорів",
  finish: "Зупинити запис даних з сенсорів",
  finishMessage: "Запис даних завершенно",
  startMessage: "Запис даних розпочато",
  noSensorsError: "Ваш пристрій не має необхідних сенсорів"
};
const layer_features_panel$2 = {};
const reference_area$2 = {};
const uk_common = {
  km: km$2,
  m: m$2,
  to: to$2,
  maps: maps$2,
  logout: logout$2,
  save: save$2,
  cancel: cancel$2,
  mcda: mcda$2,
  ok: ok$2,
  create: create$2,
  disasters: disasters$2,
  loading: loading$2,
  legend: legend$2,
  vertical_direction: vertical_direction$2,
  horizontal_direction: horizontal_direction$2,
  legend_presentation: legend_presentation$2,
  layers: layers$2,
  bivariate: bivariate$2,
  toolbar: toolbar$2,
  locate_me: locate_me$2,
  layer_actions: layer_actions$2,
  focus_geometry_layer: focus_geometry_layer$2,
  feed: feed$2,
  deselect: deselect$2,
  spinner_text: spinner_text$2,
  updated: updated$2,
  no_data_received: no_data_received$2,
  wrong_data_received: wrong_data_received$2,
  error: error$2,
  sort_icon: sort_icon$2,
  configs: configs$2,
  errors: errors$2,
  event_list: event_list$2,
  categories: categories$2,
  groups: groups$2,
  modes: modes$2,
  advanced_analytics_data_list: advanced_analytics_data_list$2,
  profile: profile$2,
  multivariate: multivariate$2,
  search: search$2,
  episode: episode$2,
  create_layer: create_layer$2,
  analytics_panel: analytics_panel$2,
  advanced_analytics_panel: advanced_analytics_panel$2,
  advanced_analytics_empty: advanced_analytics_empty$2,
  current_event: current_event$2,
  llm_analytics: llm_analytics$2,
  draw_tools: draw_tools$2,
  boundary_selector: boundary_selector$2,
  geometry_uploader: geometry_uploader$2,
  focus_geometry: focus_geometry$2,
  reference_area_layer: reference_area_layer$2,
  drawings: drawings$2,
  sidebar: sidebar$2,
  login: login$2,
  currency: currency$2,
  subscription: subscription$2,
  reports: reports$2,
  about: about$2,
  loading_episodes: loading_episodes$2,
  cookie_banner: cookie_banner$2,
  live_sensor: live_sensor$2,
  layer_features_panel: layer_features_panel$2,
  reference_area: reference_area$2
};
const km$1 = "км";
const m$1 = "м";
const to$1 = "да";
const or$1 = "ці";
const maps$1 = "Мапы";
const logout$1 = "Выйсці";
const save$1 = "Захаваць";
const cancel$1 = "Адмяніць";
const mcda$1 = {
  btn_cancel: "Адмяніць",
  legend_title: "Легенда",
  layer_editor: {
    outliers_options: {
      hide: "Схаваць",
      clamp: "Абмежаваць",
      dont_modify: "Не змяняць"
    },
    save_changes: "Захаваць змены",
    range: "Дыяпазон значэнняў",
    outliers: "Выбітныя значэнні",
    reverse_to_good_bad: "Перавярнуць на Добра → Дрэнна",
    reverse_to_bad_good: "Перавярнуць на Дрэнна → Добра",
    weight: "Вага",
    transform: "Трансфармаваць",
    transformation: "Трансфармацыя",
    normalize: "Нармалізаваць",
    normalization: "Нармалізацыя",
    range_buttons: {
      full_range: "Поўны дыяпазон",
      "3_sigma": "3σ",
      "2_sigma": "2σ",
      "1_sigma": "1σ"
    },
    transformations: {
      no_transformation: "Без трансфармацыі",
      square_root: "Квадратны корань: sign(x)⋅√|x|",
      cube_root: "Кубічны корань: ∛x",
      log: "log₁₀(x - xmin + 1)",
      log_epsilon: "log₁₀(x - xmin + ε)"
    },
    no: "Без нармалізацыі",
    max_min: "Максімум-мінімум",
    errors: {
      weight_cannot_be_empty: "Вага не можа быць пустой",
      weight_must_be_a_number: "Вага павінна быць лікам",
      range_from_cannot_be_bigger: "Значэнне ‘ад’ не можа быць большым за значэнне ‘да’",
      range_cannot_be_empty: "Дыяпазон не можа быць пустым",
      range_must_be_a_number: "Дыяпазон павінен быць лікам"
    },
    tips: {
      range: "Значэнні, якія будуць лічыцца найгоршымі і найлепшымі ў вашым аналізе.",
      sentiment: "Вызначце кірунак уздзеяння для аналізу:\n* **Дрэнна → Добра**: Больш высокія значэнні паказваюць на станоўчы напрамак.\n* **Добра → Дрэнна**: Больш высокія значэнні паказваюць на адмоўны напрамак.",
      weight: "Па змаўчанні ўсе слаі аднолькава ўплываюць на аналіз праз узважаную сярэднюю. Павелічэнне вагі слоя (напрыклад, 2, 3 і г.д.) дазваляе вам надаць яму большую важкасць у аналізе.",
      transform: "Прымяняйце разлікі да значэнняў. Атрыманне больш лінейнага размеркавання забяспечыць карысную інфармацыю для аналізу.\n\n **Заўвага**: Разлікі выконваюцца перад нармалізацыяй.",
      normalize: "Прыводзіць значэнні да стандартызаванай шкалы. Гэта дапамагае лёгка параўноўваць іх і прымаць рашэнні.\n* **Стандартная шкала адзнак**: Гэты варыянт прыводзіць значэнні да стандартызаванай шкалы, робячы іх супастаўнымі.\n* **Не (толькі для спецыялістаў)**: Пакідае значэнні без змен.",
      outliers: "* **Абмежаваць**: Задаць значэнні вышэй за дыяпазон як 1, ніжэй — як 0.\n* **Не змяняць**: Захаваць 0 і 1 як мінімум і максімум, але дапускаць значэнні за межамі гэтага дыяпазону.\n* **Выключыць**: Выключыць з аналізу вобласці, дзе значэнні выходзяць за межы дыяпазону."
    }
  },
  title: "Шматкрытэрыяльны аналіз",
  modal_title: "Шматкрытэрыяльны аналіз",
  name: "Стварыць аналіз",
  modal_input_name: "Назва аналізу",
  modal_input_name_placeholder: "Напрыклад, Кліматычныя змены",
  modal_input_indicators: "Спіс слаёў",
  modal_input_indicators_placeholder: "Абраць слаі",
  modal_input_indicators_no_options: "Няма варыянтаў",
  btn_save: "Захаваць аналіз",
  error_analysis_name_cannot_be_empty: "Назва аналізу не можа быць пустой",
  error_bad_layer_data: "Няправільныя даныя слоя шматкрытэрыяльнага аналізу",
  error_invalid_file: "Няправільны фармат файла шматкрытэрыяльнага аналізу",
  error_invalid_parameter: "Няправільны параметр '{{parameter}}'",
  error_invalid_layer_parameter: "Няправільны параметр '{{parameter}}' у слоі '{{axisName}}'",
  error_wrong_mcda_version: "Няправільная версія MCDA",
  legend_subtitle: "Шасцікутнікі афарбаваны згодна з наладамі аналітычных слаёў. Націсніце на шасцікутнік, каб убачыць яго значэнні.",
  bad: "Дрэнна",
  good: "Добра"
};
const ok$1 = "ОК";
const create$1 = "Стварыць";
const disasters$1 = "Катастрофы";
const loading$1 = "Загрузка...";
const loading_events$1 = "Загрузка катастроф";
const legend$1 = "Легенда";
const vertical_direction$1 = "Вертыкальны напрамак";
const horizontal_direction$1 = "Гарызантальны напрамак";
const legend_presentation$1 = "Адлюстраванне легенды";
const layers$1 = "Слаі";
const bivariate$1 = {
  color_manager: {
    layers_filter: "Слаі",
    not_defined: "Не вызначана",
    sentiments_combinations_filter: "Спалучэнні напрамкаў",
    no_legends: "Няма легенд, якія адпавядаюць умовам.",
    no_data: "Няма даных",
    sentiments_tab: "Напрамак",
    color_legends_tab: "Каляровыя легенды",
    layers_tab: "Слаі (індыкатары)"
  },
  panel: {
    header: "Біварыятыўная матрыца"
  },
  matrix: {
    caption: {
      base_axis: "Базавая вось",
      annex_axis: "Дапаможная вось",
      tooltip: {
        p1: "Графікі, якія выкарыстоўваюць базавую і дапаможную восі, дапамагаюць вызначыць сувязь паміж двума наборамі даных.",
        li1: "Дапаможная вось - параметры, якія мы аналізуем",
        li2: "Базавая вось - апорная кропка ў аналізе",
        b: "Напрыклад: найлепшае месца для адкрыцця кавярні",
        p2: "Мы можам даследаваць колькасць месцаў грамадскага харчавання (дапаможная вось) у параўнанні са шчыльнасцю насельніцтва (базавая вось).",
        p3: "У гэтым выпадку нас найперш цікавіць невялікая колькасць месцаў грамадскага харчавання, а колькасць людзей у гэтым месцы дае дадатковую інфармацыю."
      }
    },
    header: {
      title: "Выберыце два слоя для даследавання карэляцый",
      hint: "Слаі і карэляцыі адлюстроўваюцца для вылучанай вобласці"
    },
    icon: {
      population: "Значэнне, падзеленае на насельніцтва",
      area_km2: "Значэнне, падзеленае на плошчу",
      total_building_count: "Значэнне, падзеленае на агульную колькасць будынкаў",
      populated_area_km2: "Значэнне, падзеленае на заселеную тэрыторыю",
      one: "Без дзялення",
      roads: "Значэнне, падзеленае на агульную даўжыню дарог"
    },
    progress: {
      rendering: "Адмалёўка",
      applied: "Ужыта на карце"
    },
    loading_error: "На жаль, мы не можам адлюстраваць матрыцу. Паспрабуйце абнавіць старонку ці вярнуцца пазней."
  },
  legend: {
    high: "Высокі",
    low: "Нізкі",
    medium: "Сярэдні"
  }
};
const toolbar$1 = {
  map_ruler: "Вымераць адлегласць",
  locate_me: "Вызначыць маё месцазнаходжанне",
  panel_title: "Панэль інструментаў",
  download: "Спампаваць",
  "delete": "Выдаліць",
  boundary_selector: "Вылучыць адміністрацыйную мяжу",
  create_layer: "Стварыць слой",
  geometry_uploader: "Загрузіць GeoJSON",
  focused_geometry_editor: "Маляваць або рэдагаваць геаметрыю",
  edit_in_osm: "Рэдагаваць мапу ў OSM",
  record_sensors: "Запісваць даныя датчыкаў",
  tools_label: "Інструменты",
  selected_area_label: "Вылучаная вобласць",
  upload_mcda: "Загрузіць аналіз"
};
const locate_me$1 = {
  feature_title: "Вызначыць маё месцазнаходжанне",
  get_location_error: "Памылка пры атрыманні месцазнаходжання"
};
const layer_actions$1 = {
  tooltips: {
    download: "Спампаваць",
    erase: "Сцерці",
    edit: "Рэдагаваць",
    hide: "Схаваць",
    show: "Паказаць"
  }
};
const focus_geometry_layer$1 = {
  settings: {
    name: "Вылучаная вобласць"
  }
};
const feed$1 = "Стужка";
const deselect$1 = "Зняць вылучэнне";
const spinner_text$1 = "Збор даных";
const updated$1 = "Абноўлена";
const started$1 = "Пачалося";
const no_data_received$1 = "Даныя не атрыманы";
const wrong_data_received$1 = "Атрыманы памылковыя даныя";
const error$1 = "Памылка";
const sort_icon$1 = "Сартаванне";
const configs$1 = {
  Kontur_public_feed: "Kontur Public",
  Kontur_public_feed_description: "Стужка змяшчае даныя ў рэжыме рэальнага часу аб цыклонах, засухах, землятрусах, паводках, вулканах і лясных пажарах."
};
const errors$1 = {
  "default": "Прабачце, узніклі праблемы, якія хутка будуць выпраўлены",
  timeout: "Час чакання запыту скончыўся",
  cannot_connect: "Не атрымалася злучыцца з серверам",
  forbidden: "Забаронена",
  not_found: "Не знойдзена",
  unknown: "Невядома",
  server_error: "Памылка сервера",
  error_try_again: "Нешта пайшло не так. Калі ласка, паспрабуйце зноў"
};
const event_list$1 = {
  severity_unknown: "Невядома",
  warning_title: "Немагчыма адфільтраваць па віду мапы",
  warning_description: "Мапа яшчэ не гатовая, паспрабуйце пазней",
  bbox_filter_button: "Адфільтраваць па віду мапы",
  analytics: {
    affected_people: {
      tooltip: "Пацярпелыя людзі",
      value: "Няма гуманітарных наступстваў"
    },
    settled_area_tooltip: "Заселеная тэрыторыя",
    loss_tooltip: "Прыблізныя страты"
  },
  no_event_in_feed: "Катастрофа не была знойдзеная ў цякучай стужцы катастроф",
  no_selected_disaster: "Катастрофа не выбрана",
  chose_disaster: "Выбраць катастрофу",
  no_historical_disasters: "Няма гістарычных катастроф у дадзеным раёне",
  no_feed_disasters: "Няма катастроф у гэтай стужцы",
  no_feed_disasters_matching_your_filters: "Няма катастроф, што адпавядаюць вашым фільтрам",
  no_disasters: "Няма катастроф",
  severity_termination: "Спыненне",
  severity_minor: "Нязначная",
  severity_moderate: "Умераная",
  severity_severe: "Сур'ёзная",
  severity_extreme: "Экстрэмальная",
  open_timeline_button: "Часавая шкала"
};
const categories$1 = {
  overlays: "Оверлэі",
  basemap: "Базавая мапа"
};
const groups$1 = {
  layers_in_selected_area: "Слаі ў вылучанай зоне",
  your_layers: "Вашы слаі",
  kontur_analytics: "Аналітыка Kontur",
  qa: "Інспектар OpenStreetMap",
  osmbasedmap: "На аснове OpenStreetMap",
  other: "Іншае",
  elevation: "Вышыня",
  photo: "Здымкі",
  map: "Мапа"
};
const modes$1 = {
  map: "Мапа",
  about: "Пра сервіс",
  cookies: "Файлы cookie",
  reports: "Справаздачы",
  report: "Справаздача",
  profile: "Профіль",
  privacy: "Прыватнасць",
  terms: "Умовы",
  user_guide: "Дапаможнік"
};
const advanced_analytics_data_list$1 = {
  load_world_data: "Загрузіць сусветныя даныя",
  numerator: "Лічнік",
  normalized_by: "Нармалізавана па",
  sum: "Сума",
  min: "Мінімум",
  max: "Максімум",
  mean: "Сярэдняе",
  stddev: "Стандартнае адхіленне",
  median: "Медыяна",
  filter_numerator: "Фільтр па лічніку",
  filter_denominator: "Фільтр па назоўніку"
};
const profile$1 = {
  saveButton: "Захаваць змены",
  reference_area: {
    title: "Эталонная вобласць",
    freehand_geometry: "Адвольная геаметрыя",
    to_replace_reference_area: 'Вы можаце пераназначыць вашу эталонную вобласць на карце. Вылучыце вобласць і націсніце "Захаваць як эталонную вобласць" у панэлі інструментаў.\n',
    description: "Захавайце знаёмую вам вобласць як эталонную. Мы будзем выкарыстоўваць яе як падставу для параўнання іншых абласцей і тлумачэння адрозненняў.",
    set_the_reference_area: "Вылучыць вобласць на карце",
    tooltip_text: "1. Вылучыце вобласць цікавасці на карце, выкарыстоўваючы інструменты 'Адміністрацыйныя межы' або 'Маляванне геаметрыі'. <br/> 2. Націсніце кнопку 'Захаваць як эталонную вобласць' у панэлі інструментаў.",
    accessing_location: "Атрыманне вашага месцазнаходжання",
    accessing_location_error: "Памылка. Паспрабуйце іншы спосаб.",
    select_location: "Абраць маю цякучае месцазнаходжанне",
    notification: "Ваша эталонная вобласць {{name}} была захаваная"
  },
  email: "Электронная пошта",
  interfaceTheme: "Тэма",
  interfaceLanguage: "Мова",
  units: "Адзінкі вымярэння",
  fullName: "Поўнае імя",
  metric: "метрычная сістэма",
  imperialBeta: "імперская сістэма (бэта)",
  profileSettingsHeader: "Наладзьце свой вопыт выкарыстання",
  your_current_job: "ваша цяперашняя праца",
  area_of_expertise: "сфера дзейнасці",
  challenges: "праблемы",
  personalization_prompt: "Для лепшай персаналізацыі, калі ласка, пазначце наступнае:",
  ai_tools_compatibility: "Гэтая інфармацыя сумяшчальная з інструментамі AI",
  improves_analysis: "Паляпшае аналіз",
  bio_placeholder: "Аб сабе",
  bio_textarea_placeholder: "Напрыклад, спецыяліст у галіне ГІС з 5+ гадамі вопыту ў аналізе рызыкаў катастроф, арыентаваны на гарадскую ўстойлівасць.",
  analysis_objectives: "Мэты аналізу",
  objectives_textarea_placeholder: "Напрыклад, аналіз гарадскога планавання з акцэнтам на кліматычную ўстойлівасць. Мая цяперашняя задача — паляпшэнне картаграфавання рызыкаў паводак.",
  appSettingsHeader: "Налады",
  your_organization: "Ваша арганізацыя",
  your_contacts: "Вашыя кантактныя даныя",
  organization_name: "Назва арганізацыі",
  position: "Пасада",
  gis_specialists: "ГІС-спецыялісты ў вашай камандзе",
  phone_number: "Нумар тэлефона з кодам краіны",
  linkedin: "Профіль у LinkedIn",
  konturTheme: "Kontur",
  HOTTheme: "HOT",
  defaultDisasterFeed: "Стужка катастроф па змаўчанні",
  defaultOSMeditor: "Рэдактар OpenStreetMap па змаўчанні (бэта)",
  successNotification: "Усе змены былі паспяхова захаваны",
  dont_know: "Я не ведаю",
  languageOption: {
    en: "Англійская",
    es: "Іспанская",
    ar: "Арабская",
    ko: "Карэйская",
    id: "Інданезійская",
    de: "Нямецкая",
    be: "Беларуская",
    ru: "Руская",
    uk: "Украінская"
  }
};
const multivariate$1 = {
  upload_analysis_layer: "Загрузіць аналітычны слой",
  popup: {
    score_header: "Адзнака {{level}}",
    base_header: "Аснова {{level}}"
  }
};
const search$1 = {
  search_location: "Пошук месца",
  info_block: "Вы можаце шукаць 📍 месцы",
  info_block_with_mcda: "Вы можаце шукаць 📍 месцы або задаць ✨ AI ваша пытанне, напрыклад: «Дзе знаходзіцца сухастой?»",
  input_placeholder: "Пошук",
  input_placeholder_mcda: "Шукаць або спытацца ў AI",
  locations_no_result: "Няма знойдзеных месцаў",
  mcda_loading_message: "AI стварае аналіз для вас",
  mcda_no_result: "Няма прапаноў ад AI",
  mcda_error_message: "AI не адказаў. Паспрабуйце пазней",
  mcda_create_analysis: "Стварыць аналіз",
  upload_analysis: "“{{name}}” шматкрытэрыяльны аналіз быў створаны"
};
const episode$1 = "Часавая шкала";
const create_layer$1 = {
  edit_layer: "Рэдагаваць слой",
  edit_features: "Рэдагаваць аб'екты",
  delete_layer: "Выдаліць слой",
  create_layer: "Стварыць слой",
  saving_layer: "Захаванне слоя...",
  field_name: "Назва поля",
  layer_name: "Назва слоя",
  marker_icon: "Іконка маркера",
  type: "Тып",
  select: "Выбраць",
  short_text: "Кароткі тэкст",
  long_text: "Доўгі тэкст",
  link: "Спасылка",
  image: "Выява",
  fields: "Палі",
  add_field: "Дадаць поле",
  location: "Месцазнаходжанне",
  edit_feature_placeholder: "Выберыце аб'ект для пачатку рэдагавання яго ўласцівасцей"
};
const analytics_panel$1 = {
  header_title: "Аналітыка",
  error_loading: "Не атрымалася атрымаць даныя аб вылучанай вобласці. Магчыма, яна занадта вялікая.",
  info_short: "Разлікі зробленыя для вылучанай вобласці"
};
const advanced_analytics_panel$1 = {
  header_title: "Пашыраная аналітыка",
  error: "Памылка падчас атрымання даных пашыранай аналітыкі"
};
const advanced_analytics_empty$1 = {
  not_found: "Прабачце, запытаная катастрофа не знойдзена",
  error: "Адбылася памылка",
  analytics_for_selected: "Аналітыка для вылучанай вобласці",
  will_be_provided: "будзе пададзена тут",
  no_analytics: "Няма аналітыкі для вылучанай вобласці"
};
const current_event$1 = {
  not_found_request: "Прабачце, запытаная катастрофа не знойдзена"
};
const llm_analytics$1 = {
  header: "Аналітыка AI",
  placeholder: {
    select_area: "Вылучыце вобласць (<icon1 />,<icon2 />,<icon3 />), якую хочаце даследаваць для атрымання Аналітыкі AI.",
    you_can_also: "Вы таксама можаце:",
    fill_bio: "<icon /> <lnk>Запоўніце мэты аналізу</lnk>, каб персаналізаваць AI аналіз",
    select_and_save_as_reference_area: "<icon /> Вылучыце вобласць і захавайце яе як эталонную для параўнання з іншай",
    learn_more: "<lnk><icon/> Даведайцеся больш пра Аналітыку AI</lnk>"
  }
};
const draw_tools$1 = {
  area: "Шматкутнік",
  line: "Лінія",
  point: "Кропка",
  finish_drawing: "Скончыць маляванне",
  caption: "Націсніце на мапу, каб пачаць маляванне",
  no_geometry_error: "Няма намаляванай геаметрыі для загрузкі",
  overlap_error: "Шматкутнік не павінен перакрываць сам сябе",
  save_features: "Захаваць аб'екты"
};
const boundary_selector$1 = {
  title: "Фокус на адміністрацыйную мяжу"
};
const geometry_uploader$1 = {
  title: "Фокус на загружаную геаметрыю",
  error: "Памылка пры чытанні загружанага файла"
};
const focus_geometry$1 = {
  title: "Фокус на адвольную геаметрыю"
};
const reference_area_layer$1 = {
  settings: {
    name: "Эталонная вобласць"
  }
};
const drawings$1 = {
  self_directions_not_supported: "Самаперакрыцці не падтрымліваюцца"
};
const sidebar$1 = {
  edit_osm: "Рэдагаваць у OpenStreetMap",
  ruler: "Лінейка",
  collapse: "Згарнуць",
  expand: "Разгарнуць",
  icon_alt: "Лагатып дадатку"
};
const login$1 = {
  email: "Электронная пошта",
  password: "Пароль",
  login_button: "Увайсці",
  sign_up: "Зарэгістравацца",
  logging_in: "Уваход...",
  log_in: "Увайсці",
  forgot_password: "Забыліся пароль?",
  description: "Калі ласка, увайдзіце, каб змяніць налады",
  error: {
    email_empty: "Поле электроннай пошты не можа быць пустым",
    email_invalid: "Увядзіце сапраўдны адрас электроннай пошты",
    password: "Поле пароля не можа быць пустым",
    connect: "Не ўдалося падключыцца да службы аўтэнтыфікацыі"
  }
};
const currency$1 = {
  usd: "USD"
};
const subscription$1 = {
  title: "Тарыфы і цэны",
  price_summary: "* Выстаўляецца рахунак ${{pricePerYear}} USD раз на год",
  unauthorized_button: "Увайдзіце, каб аформіць падпіску",
  current_plan_button: "Цяперашні план",
  sales_button: "Звязацца з аддзелам продажаў",
  book_demo_button: "Замовіць дэма",
  request_trial_button: "Запытаць пробны перыяд",
  errors: {
    payment_initialization: "Адбылася памылка падчас ініцыялізацыі плацяжу. Калі ласка, паспрабуйце яшчэ раз ці звяжыцеся са службай падтрымкі"
  },
  success_modal: {
    title: "Паспяхова",
    thank_you_for_subscribing: "Дзякуй за падпіску на нашу платформу!",
    after_the_page_refreshes: "Пасля абнаўлення старонкі вы можаце пачаць выкарыстоўваць Kontur Atlas"
  }
};
const reports$1 = {
  title: "Справаздачы Disaster Ninja",
  no_data: "Няма даных для гэтай справаздачы",
  sorting: "Сартыроўка даных...",
  loading: "Загрузка даных",
  open_josm: "Адкрыць праз дыстанцыйнае кіраванне JOSM",
  josm_logo_alt: "Лагатып JOSM",
  see_all: "Паглядзець усе справаздачы",
  wrong_id: "Няправільны ідэнтыфікатар справаздачы",
  description: "<0>Kontur </0> стварае некалькі справаздач, якія дапамагаюць ацаніць якасць OpenStreetMap. Яны ўтрымліваюць спасылкі на вобласці на <4>osm.org </4> і спасылкі для адкрыцця іх у рэдактары JOSM з уключаным дыстанцыйным кіраваннем."
};
const about$1 = {};
const loading_episodes$1 = "Загрузка эпізодаў";
const zoom_to_world$1 = "Аддаліцца да ўсяго свету";
const cookie_banner$1 = {
  header: "Мы цэнім вашу прыватнасць",
  body: "Мы выкарыстоўваем неабходныя файлы cookie для прадастаўлення вам персаналізаваных паслуг, а таксама дадатковыя файлы cookie для паляпшэння {{appName}} і вашага вопыту выкарыстання. Вы можаце кіраваць наладамі cookie або адклікаць згоду на дадатковыя cookie ў любы момант.\nДля атрымання дадатковай інфармацыі азнаёмцеся з нашай [Палітыкай прыватнасці](about/privacy)",
  decline_all: "Адмовіцца ад дадатковых cookie",
  accept_all: "Прыняць дадатковыя cookie"
};
const live_sensor$1 = {
  start: "Пачаць запіс з датчыкаў",
  finish: "Спыніць запіс з датчыкаў",
  finishMessage: "Запіс завершаны",
  startMessage: "Запіс пачаты",
  noSensorsError: "Вашае прылада не мае неабходных датчыкаў"
};
const layer_features_panel$1 = {
  empty: "Аб'екты слоя ў вылучанай вобласці будуць паказаны тут",
  noFeatureSelected: "Не абраны аб'ект слоя",
  chooseFeature: "Абярыце аб'ект слоя",
  listInfo: "Спіс адфільтраваны па вылучанай вобласці і адсартаваны па нумары праекта",
  error_loading: "Не атрымалася загрузіць даныя аб'ектаў слоя. Калі ласка, паспрабуйце яшчэ раз.",
  no_features: "У вылучанай вобласці не знойдзена аб'ектаў."
};
const reference_area$1 = {
  save_as_reference_area: "Захаваць як эталонную вобласць",
  error_couldnt_save: "На жаль, не атрымалася захаваць вашу эталонную вобласць. Калі ласка, паспрабуйце яшчэ раз.",
  selected_area_saved_as_reference_area: "Вылучаная вобласць была захаваная як эталонная ў вашым профілі"
};
const be_common = {
  km: km$1,
  m: m$1,
  to: to$1,
  or: or$1,
  maps: maps$1,
  logout: logout$1,
  save: save$1,
  cancel: cancel$1,
  mcda: mcda$1,
  ok: ok$1,
  create: create$1,
  disasters: disasters$1,
  loading: loading$1,
  loading_events: loading_events$1,
  legend: legend$1,
  vertical_direction: vertical_direction$1,
  horizontal_direction: horizontal_direction$1,
  legend_presentation: legend_presentation$1,
  layers: layers$1,
  bivariate: bivariate$1,
  toolbar: toolbar$1,
  locate_me: locate_me$1,
  layer_actions: layer_actions$1,
  focus_geometry_layer: focus_geometry_layer$1,
  feed: feed$1,
  deselect: deselect$1,
  spinner_text: spinner_text$1,
  updated: updated$1,
  started: started$1,
  no_data_received: no_data_received$1,
  wrong_data_received: wrong_data_received$1,
  error: error$1,
  sort_icon: sort_icon$1,
  configs: configs$1,
  errors: errors$1,
  event_list: event_list$1,
  categories: categories$1,
  groups: groups$1,
  modes: modes$1,
  advanced_analytics_data_list: advanced_analytics_data_list$1,
  profile: profile$1,
  multivariate: multivariate$1,
  search: search$1,
  episode: episode$1,
  create_layer: create_layer$1,
  analytics_panel: analytics_panel$1,
  advanced_analytics_panel: advanced_analytics_panel$1,
  advanced_analytics_empty: advanced_analytics_empty$1,
  current_event: current_event$1,
  llm_analytics: llm_analytics$1,
  draw_tools: draw_tools$1,
  boundary_selector: boundary_selector$1,
  geometry_uploader: geometry_uploader$1,
  focus_geometry: focus_geometry$1,
  reference_area_layer: reference_area_layer$1,
  drawings: drawings$1,
  sidebar: sidebar$1,
  login: login$1,
  currency: currency$1,
  subscription: subscription$1,
  reports: reports$1,
  about: about$1,
  loading_episodes: loading_episodes$1,
  zoom_to_world: zoom_to_world$1,
  cookie_banner: cookie_banner$1,
  live_sensor: live_sensor$1,
  layer_features_panel: layer_features_panel$1,
  reference_area: reference_area$1
};
const km = "км";
const m = "м";
const to = "до";
const or = "или";
const maps = "Карты";
const logout = "Выйти";
const save = "Сохранить";
const cancel = "Отменить";
const mcda = {
  btn_cancel: "Отменить",
  legend_title: "Легенда",
  layer_editor: {
    outliers_options: {
      hide: "Скрыть",
      clamp: "Ограничить",
      dont_modify: "Не изменять"
    },
    save_changes: "Сохранить изменения",
    range: "Диапазон значений",
    outliers: "Выпадающие значения",
    reverse_to_good_bad: "Перевернуть: Хорошо → Плохо",
    reverse_to_bad_good: "Перевернуть: Плохо → Хорошо",
    weight: "Вес",
    transform: "Трансформировать",
    transformation: "Трансформация",
    normalize: "Нормализовать",
    normalization: "Нормализация",
    range_buttons: {
      full_range: "Полный диапазон",
      "3_sigma": "3σ",
      "2_sigma": "2σ",
      "1_sigma": "1σ"
    },
    transformations: {
      no_transformation: "Без трансформации",
      square_root: "Квадратный корень: sign(x)⋅√|x|",
      cube_root: "Кубический корень: ∛x",
      log: "log₁₀(x - xmin + 1)",
      log_epsilon: "log₁₀(x - xmin + ε)"
    },
    no: "Без нормализации",
    max_min: "Макс-мин",
    errors: {
      weight_cannot_be_empty: "Вес не может быть пустым",
      weight_must_be_a_number: "Вес должен быть числом",
      range_from_cannot_be_bigger: "Значение «от» не может быть больше, чем значение «до»",
      range_cannot_be_empty: "Диапазон не может быть пустым",
      range_must_be_a_number: "Диапазон должен быть числом"
    },
    tips: {
      range: "Значения, которые будут считаться наихудшими и наилучшими в вашем анализе.",
      sentiment: "Определите направление коннотаций слоя на анализ:\n* **Плохо → Хорошо**: Более высокие значения указывают на положительное направление.\n* **Хорошо → Плохо**: Более высокие значения указывают на отрицательное направление.",
      weight: "По умолчанию все слои вносят равный вклад в анализ через средневзвешенное значение. Увеличение веса слоя (2, 3 и т. д.) позволяет придать ему дополнительную значимость в анализе.",
      transform: "Примените вычисления к значениям. Достижение более линейного распределения обеспечит более полезную информацию для анализа.\n\n **Примечание**: Вычисления выполняются перед нормализацией.",
      normalize: "Приводит значения к стандартизированной шкале. Это упрощает их сравнение и принятие решений.\n* **Стандартная шкала оценки**: Этот вариант приводит значения к стандартизированной шкале, чтобы они были сопоставимы.\n* **Нет (только для специалистов)**: Оставляет значения без изменений.",
      outliers: "* **Ограничить**: Установить значения выше диапазона как 1, а ниже диапазона – как 0.\n* **Не изменять**: Сохранить 0 и 1 для минимального и максимального значений, но допустить выбросы за пределами этого диапазона.\n* **Исключить**: Исключить области, где значения выходят за пределы диапазона."
    }
  },
  title: "Многокритериальный анализ",
  modal_title: "Многокритериальный анализ",
  name: "Создать анализ",
  modal_input_name: "Название анализа",
  modal_input_name_placeholder: "Например, Изменение климата",
  modal_input_indicators: "Список слоёв",
  modal_input_indicators_placeholder: "Выберите слои",
  modal_input_indicators_no_options: "Нет доступных вариантов",
  btn_save: "Сохранить анализ",
  error_analysis_name_cannot_be_empty: "Название анализа не может быть пустым",
  error_bad_layer_data: "Некорректные данные слоя многокритериального анализа",
  error_invalid_file: "Некорректный формат файла многокритериального анализа",
  error_invalid_parameter: "Некорректный параметр '{{parameter}}'",
  error_invalid_layer_parameter: "Некорректный параметр '{{parameter}}' в слое '{{axisName}}'",
  error_wrong_mcda_version: "Неподдерживаемая версия многокритериального анализа",
  legend_subtitle: "Шестиугольники окрашены в соответствии с настройками анализа слоя. Нажмите на шестиугольник, чтобы увидеть его значения.",
  bad: "Плохо",
  good: "Хорошо"
};
const ok = "ОК";
const create = "Создать";
const disasters = "Катастрофы";
const loading = "Загрузка...";
const loading_events = "Загрузка катастроф";
const legend = "Легенда";
const vertical_direction = "Вертикальное направление";
const horizontal_direction = "Горизонтальное направление";
const legend_presentation = "Отображение легенды";
const layers = "Слои";
const bivariate = {
  color_manager: {
    layers_filter: "Слои",
    not_defined: "Не определено",
    sentiments_combinations_filter: "Комбинации направлений",
    no_legends: "Нет легенд, удовлетворяющих условиям.",
    no_data: "Нет данных.",
    sentiments_tab: "Направление",
    color_legends_tab: "Цветовые легенды",
    layers_tab: "Слои (индикаторы)"
  },
  panel: {
    header: "Бивариативная матрица"
  },
  matrix: {
    caption: {
      base_axis: "Базовая ось",
      annex_axis: "Дополнительная ось",
      tooltip: {
        p1: "Графики с базовой и дополнительной осями помогают установить взаимосвязь между двумя наборами данных.",
        li1: "Дополнительная ось – параметры, которые мы анализируем",
        li2: "Базовая ось – эталонная точка в анализе",
        b: "Например: лучшее место для открытия кафе",
        p2: "Мы можем изучить количество мест общественного питания (дополнительная ось) по отношению к плотности населения (базовая ось).",
        p3: "В этом сценарии нас интересует небольшое количество мест общественного питания, а количество людей в этом месте даёт дополнительную информацию."
      }
    },
    header: {
      title: "Выберите два слоя для исследования корреляций",
      hint: "Слои и корреляции отображаются для текущей выделенной области"
    },
    icon: {
      population: "Значение, делённое на население",
      area_km2: "Значение, делённое на площадь",
      total_building_count: "Значение, делённое на общее количество зданий",
      populated_area_km2: "Значение, делённое на заселённую площадь",
      one: "Без делителя",
      roads: "Значение, делённое на общую длину дорог"
    },
    progress: {
      rendering: "Отрисовка",
      applied: "Применено на карте"
    },
    loading_error: "К сожалению, мы не можем отобразить матрицу. Попробуйте обновить страницу или зайдите позже."
  },
  legend: {
    high: "Высокий",
    low: "Низкий",
    medium: "Средний"
  }
};
const toolbar = {
  map_ruler: "Измерить расстояние",
  locate_me: "Определить моё местоположение",
  panel_title: "Панель инструментов",
  download: "Скачать",
  "delete": "Удалить",
  boundary_selector: "Выделить административную границу",
  create_layer: "Создать слой",
  geometry_uploader: "Загрузить GeoJSON",
  focused_geometry_editor: "Рисовать или редактировать геометрию",
  edit_in_osm: "Редактировать карту в OSM",
  record_sensors: "Записать данные с датчиков",
  tools_label: "Инструменты",
  selected_area_label: "Выделенная область",
  upload_mcda: "Загрузить анализ"
};
const locate_me = {
  feature_title: "Определить моё местоположение",
  get_location_error: "Ошибка при определении местоположения"
};
const layer_actions = {
  tooltips: {
    download: "Скачать",
    erase: "Стереть",
    edit: "Редактировать",
    hide: "Скрыть",
    show: "Показать"
  }
};
const focus_geometry_layer = {
  settings: {
    name: "Выделенная область"
  }
};
const feed = "Лента";
const deselect = "Снять выделение";
const spinner_text = "Сбор данных";
const updated = "Обновлено";
const started = "Запущено";
const no_data_received = "Данные не получены";
const wrong_data_received = "Получены неверные данные";
const error = "Ошибка";
const sort_icon = "Сортировка";
const configs = {
  Kontur_public_feed: "Kontur Public",
  Kontur_public_feed_description: "Лента содержит данные в реальном времени о циклонах, засухах, землетрясениях, наводнениях, вулканах, лесных пожарах."
};
const errors = {
  "default": "Извините, у нас возникли проблемы, которые скоро будут исправлены",
  timeout: "Время ожидания запроса истекло",
  cannot_connect: "Не удается подключиться к серверу",
  forbidden: "Доступ запрещен",
  not_found: "Не найдено",
  unknown: "Неизвестно",
  server_error: "Ошибка сервера",
  error_try_again: "Что-то пошло не так. Пожалуйста, попробуйте снова"
};
const event_list = {
  severity_unknown: "Неизвестно",
  warning_title: "Невозможно отфильтровать по виду карты",
  warning_description: "Карта еще не готова, попробуйте позже",
  bbox_filter_button: "Фильтровать по виду карты",
  analytics: {
    affected_people: {
      tooltip: "Пострадавшие люди",
      value: "Гуманитарного воздействия нет"
    },
    settled_area_tooltip: "Заселённая территория",
    loss_tooltip: "Предполагаемый ущерб"
  },
  no_event_in_feed: "Катастрофа не найдена в текущей ленте катастроф",
  no_selected_disaster: "Катастрофа не выбрана",
  chose_disaster: "Выберите катастрофу",
  no_historical_disasters: "В этой области нет исторических катастроф",
  no_feed_disasters: "В этой ленте нет катастроф",
  no_feed_disasters_matching_your_filters: "Нет катастроф, соответствующих вашим фильтрам",
  no_disasters: "Нет катастроф",
  severity_termination: "Прекращение",
  severity_minor: "Незначительное",
  severity_moderate: "Умеренное",
  severity_severe: "Серьезное",
  severity_extreme: "Экстремальное",
  open_timeline_button: "Таймлайн"
};
const categories = {
  overlays: "Оверлеи",
  basemap: "Базовая карта"
};
const groups = {
  layers_in_selected_area: "Слои в выделенной области",
  your_layers: "Ваши слои",
  kontur_analytics: "Аналитика Kontur",
  qa: "Инспектор OpenStreetMap",
  osmbasedmap: "На основе OpenStreetMap",
  other: "Другое",
  elevation: "Высота",
  photo: "Изображения",
  map: "Карта"
};
const modes = {
  map: "Карта",
  about: "О сервисе",
  cookies: "Файлы cookie",
  reports: "Отчёты",
  report: "Отчёт",
  profile: "Профиль",
  privacy: "Конфиденциальность",
  terms: "Условия",
  user_guide: "Руководство"
};
const advanced_analytics_data_list = {
  load_world_data: "Загрузить мировые данные",
  numerator: "Числитель",
  normalized_by: "Нормализовано по",
  sum: "Сумма",
  min: "Минимум",
  max: "Максимум",
  mean: "Среднее",
  stddev: "Стандартное отклонение",
  median: "Медиана",
  filter_numerator: "Фильтр числителя",
  filter_denominator: "Фильтр знаменателя"
};
const profile = {
  saveButton: "Сохранить изменения",
  reference_area: {
    title: "Эталонная область",
    freehand_geometry: "Свободная геометрия",
    to_replace_reference_area: 'Вы можете переопределить свою эталонную область на карте. Выберите область и нажмите "Сохранить как эталонную область" на панели инструментов.\n',
    description: "Сохраните знакомую вам область как эталонную. Мы будем использовать её в качестве основания для сравнения с другими областями и объяснения различий.",
    set_the_reference_area: "Выделить область на карте",
    tooltip_text: "1. Выделите интересующую область на карте, используя инструмент границ администраций или инструмент рисования геометрии. <br/> 2. Нажмите кнопку 'Сохранить как эталонную область' на панели инструментов.",
    accessing_location: "Определение вашего местоположения",
    accessing_location_error: "Ошибка. Попробуйте другой способ.",
    select_location: "Выбрать моё текущее местоположение",
    notification: "Ваша эталонная область {{name}} была сохранена"
  },
  email: "Электронная почта",
  interfaceTheme: "Тема",
  interfaceLanguage: "Язык",
  units: "Единицы измерения",
  fullName: "Полное имя",
  metric: "метрическая",
  imperialBeta: "имперская (бета)",
  profileSettingsHeader: "Персонализируйте свой опыт",
  your_current_job: "ваша текущая должность",
  area_of_expertise: "область экспертизы",
  challenges: "проблемы",
  personalization_prompt: "Для лучшей персонализации укажите, например:",
  ai_tools_compatibility: "Эта информация совместима с инструментами AI",
  improves_analysis: "Улучшает аналитику",
  bio_placeholder: "О себе",
  bio_textarea_placeholder: "Например, ГИС-специалист с более чем 5-летним опытом анализа рисков катастроф, с фокусом на устойчивость городов.",
  analysis_objectives: "Цели анализа",
  objectives_textarea_placeholder: "Например, анализ городского планирования с акцентом на устойчивость к климатическим изменениям. Моя текущая задача — улучшение картографирования рисков наводнений.",
  appSettingsHeader: "Настройки",
  your_organization: "Ваша организация",
  your_contacts: "Ваши контактные данные",
  organization_name: "Название организации",
  position: "Должность",
  gis_specialists: "ГИС-специалисты в вашей команде",
  phone_number: "Номер телефона с кодом страны",
  linkedin: "Профиль в LinkedIn",
  konturTheme: "Kontur",
  HOTTheme: "HOT",
  defaultDisasterFeed: "Лента катастроф по умолчанию",
  defaultOSMeditor: "Редактор OpenStreetMap по умолчанию (бета)",
  successNotification: "Все изменения успешно применены",
  dont_know: "Не знаю",
  languageOption: {
    en: "Английский",
    es: "Испанский",
    ar: "Арабский",
    ko: "Корейский",
    id: "Индонезийский",
    de: "Немецкий",
    be: "Белорусский",
    ru: "Русский",
    uk: "Украинский"
  }
};
const multivariate = {
  upload_analysis_layer: "Загрузить слой анализа",
  popup: {
    score_header: "Оценка {{level}}",
    base_header: "Основа {{level}}"
  }
};
const search = {
  search_location: "Поиск мест",
  info_block: "Вы можете искать 📍 места",
  info_block_with_mcda: "Вы можете искать 📍 места или задать ✨ AI вопрос, например: «Где находится сухостой?»",
  input_placeholder: "Поиск",
  input_placeholder_mcda: "Найти или спросить AI",
  locations_no_result: "Места не найдены",
  mcda_loading_message: "AI создаёт анализ для вас",
  mcda_no_result: "Нет предложений от AI",
  mcda_error_message: "AI не ответил. Пожалуйста, попробуйте позже",
  mcda_create_analysis: "Создать анализ",
  upload_analysis: "Многокритериальный анализ «{{name}}» создан"
};
const episode = "Таймлайн";
const create_layer = {
  edit_layer: "Редактировать слой",
  edit_features: "Редактировать объекты",
  delete_layer: "Удалить слой",
  create_layer: "Создать слой",
  saving_layer: "Сохранение слоя...",
  field_name: "Название поля",
  layer_name: "Название слоя",
  marker_icon: "Иконка маркера",
  type: "Тип",
  select: "Выбрать",
  short_text: "Короткий текст",
  long_text: "Длинный текст",
  link: "Ссылка",
  image: "Изображение",
  fields: "Поля",
  add_field: "Добавить поле",
  location: "Местоположение",
  edit_feature_placeholder: "Выберите объект, чтобы начать редактирование его свойств"
};
const analytics_panel = {
  header_title: "Аналитика",
  error_loading: "Не удалось получить данные о выделенной области. Возможно, она слишком велика.",
  info_short: "Расчеты выполняются для выделенной области"
};
const advanced_analytics_panel = {
  header_title: "Расширенная аналитика",
  error: "Ошибка при получении данных расширенной аналитики"
};
const advanced_analytics_empty = {
  not_found: "Извините, запрашиваемая катастрофа не найдена",
  error: "Произошла ошибка",
  analytics_for_selected: "Аналитика для выделенной области",
  will_be_provided: "будет представлена здесь",
  no_analytics: "Нет аналитики для выделенной области"
};
const current_event = {
  not_found_request: "Извините, запрашиваемая катастрофа не найдена"
};
const llm_analytics = {
  header: "Аналитика AI",
  placeholder: {
    select_area: "Выберите область (<icon1 />,<icon2 />,<icon3 />), которую хотите исследовать, чтобы получить аналитику AI.",
    you_can_also: "Вы также можете:",
    fill_bio: "<icon /> <lnk>Заполните цели анализа</lnk>, чтобы персонализировать AI анализ",
    select_and_save_as_reference_area: "<icon /> Выберите область и сохраните её как эталонную, чтобы сравнивать с другой",
    learn_more: "<lnk><icon/> Узнать больше об аналитике AI</lnk>"
  }
};
const draw_tools = {
  area: "Многоугольник",
  line: "Линия",
  point: "Точка",
  finish_drawing: "Завершить рисование",
  caption: "Нажмите на карту, чтобы начать рисование",
  no_geometry_error: "Нет нарисованной геометрии для загрузки",
  overlap_error: "Полигон не должен пересекаться сам с собой",
  save_features: "Сохранить объекты"
};
const boundary_selector = {
  title: "Фокус на административной границе"
};
const geometry_uploader = {
  title: "Фокус на загруженной геометрии",
  error: "Ошибка при чтении загруженного файла"
};
const focus_geometry = {
  title: "Фокус на свободно нарисованной геометрии"
};
const reference_area_layer = {
  settings: {
    name: "Эталонная область"
  }
};
const drawings = {
  self_directions_not_supported: "Самопересечения не поддерживаются"
};
const sidebar = {
  biv_color_manager: "Менеджер цветов",
  edit_osm: "Редактировать в OpenStreetMap",
  ruler: "Линейка",
  collapse: "Свернуть",
  expand: "Развернуть",
  icon_alt: "Логотип приложения"
};
const login = {
  email: "Электронная почта",
  password: "Пароль",
  login_button: "Войти",
  sign_up: "Регистрация",
  logging_in: "Вход в систему...",
  log_in: "Войти",
  forgot_password: "Забыли пароль?",
  description: "Пожалуйста, войдите в систему, чтобы изменить настройки",
  error: {
    email_empty: "Поле электронной почты не может быть пустым",
    email_invalid: "Введите корректный адрес электронной почты",
    password: "Пароль не может быть пустым",
    connect: "Не удалось подключиться к службе аутентификации"
  }
};
const currency = {
  usd: "USD"
};
const subscription = {
  title: "Тарифы и цены",
  price_summary: "* Выставляется счёт на ${{pricePerYear}} USD раз в год",
  unauthorized_button: "Войдите, чтобы подписаться",
  current_plan_button: "Текущий план",
  sales_button: "Связаться с отделом продаж",
  book_demo_button: "Записаться на демонстрацию",
  request_trial_button: "Запросить пробную версию",
  errors: {
    payment_initialization: "Произошла ошибка при инициализации платежа. Попробуйте снова или свяжитесь со службой поддержки"
  },
  success_modal: {
    title: "Успех",
    thank_you_for_subscribing: "Спасибо за подписку на нашу платформу!",
    after_the_page_refreshes: "После обновления страницы вы сможете начать использовать Kontur Atlas"
  }
};
const reports = {
  title: "Отчёты Disaster Ninja",
  no_data: "Нет данных для этого отчёта",
  sorting: "Сортировка данных...",
  loading: "Загрузка данных",
  open_josm: "Открыть через удалённое управление JOSM",
  josm_logo_alt: "Логотип JOSM",
  see_all: "Посмотреть все отчёты",
  wrong_id: "Неверный идентификатор отчёта",
  description: "<0>Kontur </0> создаёт несколько отчётов, которые помогают проверять качество OpenStreetMap. Они содержат ссылки на области на <4>osm.org</4> и ссылки для открытия их в редакторе JOSM с включённым удалённым управлением."
};
const about = {};
const loading_episodes = "Загрузка эпизодов";
const zoom_to_world = "Отдалиться ко всему миру";
const cookie_banner = {
  header: "Мы ценим вашу конфиденциальность",
  body: "Мы используем исключительно необходимые файлы cookie для предоставления персонализированных услуг, а также дополнительные файлы cookie для улучшения {{appName}} и вашего опыта. Вы можете управлять настройками cookie или отозвать согласие на их использование в любое время.\nДополнительную информацию можно найти в нашей [Политике конфиденциальности](about/privacy).",
  decline_all: "Отклонить необязательные файлы cookie",
  accept_all: "Принять необязательные файлы cookie"
};
const live_sensor = {
  start: "Начать запись данных с сенсоров",
  finish: "Остановить запись данных с сенсоров",
  finishMessage: "Запись завершена",
  startMessage: "Запись началась",
  noSensorsError: "Ваше устройство не имеет необходимые сенсоры"
};
const layer_features_panel = {
  empty: "Здесь будут отображены объекты слоёв в выделенной области",
  noFeatureSelected: "Не выбрано ни одного объекта слоя",
  chooseFeature: "Выберите объект слоя",
  listInfo: "Список отфильтрован по выделенной области и отсортирован по номеру проекта",
  error_loading: "Не удалось загрузить данные об объектах слоя. Попробуйте снова.",
  no_features: "В выделенной области не найдено ни одного объекта."
};
const reference_area = {
  save_as_reference_area: "Сохранить как эталонную область",
  error_couldnt_save: "К сожалению, не удалось сохранить вашу эталонную область. Попробуйте снова.",
  selected_area_saved_as_reference_area: "Выбранная область сохранена как эталонная область в вашем профиле"
};
const ru_common = {
  km,
  m,
  to,
  or,
  maps,
  logout,
  save,
  cancel,
  mcda,
  ok,
  create,
  disasters,
  loading,
  loading_events,
  legend,
  vertical_direction,
  horizontal_direction,
  legend_presentation,
  layers,
  bivariate,
  toolbar,
  locate_me,
  layer_actions,
  focus_geometry_layer,
  feed,
  deselect,
  spinner_text,
  updated,
  started,
  no_data_received,
  wrong_data_received,
  error,
  sort_icon,
  configs,
  errors,
  event_list,
  categories,
  groups,
  modes,
  advanced_analytics_data_list,
  profile,
  multivariate,
  search,
  episode,
  create_layer,
  analytics_panel,
  advanced_analytics_panel,
  advanced_analytics_empty,
  current_event,
  llm_analytics,
  draw_tools,
  boundary_selector,
  geometry_uploader,
  focus_geometry,
  reference_area_layer,
  drawings,
  sidebar,
  login,
  currency,
  subscription,
  reports,
  about,
  loading_episodes,
  zoom_to_world,
  cookie_banner,
  live_sensor,
  layer_features_panel,
  reference_area
};
const I18N_FALLBACK_LANGUAGE = "en";
const languageResources = {
  en: { common: en_common },
  es: { common: es_common },
  ar: { common: ar_common },
  ko: { common: ko_common },
  id: { common: id_common },
  de: { common: de_common },
  uk: { common: uk_common },
  be: { common: be_common },
  ru: { common: ru_common }
};
instance.use(Browser).use(initReactI18next).init({
  fallbackLng: I18N_FALLBACK_LANGUAGE,
  debug: false,
  defaultNS: "common",
  interpolation: {
    escapeValue: false
  },
  contextSeparator: ":",
  pluralSeparator: ":",
  resources: {
    ...languageResources
  }
});
const TranslationService = {
  t: (key, options) => {
    const translation = instance.t(key, options);
    if (typeof translation === "string") return translation;
    if ((options == null ? void 0 : options.returnObjects) && typeof translation === "object") {
      return translation;
    }
    console.error(`Not supported translation result for key: ${key}`);
    return key;
  },
  getSupportedLanguage: (preferredLanguages, fallbackLanguage) => {
    for (const langCode of preferredLanguages) {
      try {
        const language2 = new Intl.Locale(langCode).language;
        if (language2 in languageResources) {
          return language2;
        }
      } catch {
        console.error("Couldn't parse language code:", langCode);
      }
    }
    if (!(fallbackLanguage in languageResources)) {
      console.error(`Provided fallback language (${fallbackLanguage}) isn't supported`);
    }
    return fallbackLanguage;
  },
  instance
};
function getAsset(asset, abortController) {
  const endpoint = `/apps/${configRepo.get().id}/assets`;
  return apiClient.get(`${endpoint}/${asset}`, void 0, {
    headers: { "user-language": TranslationService.instance.language },
    signal: void 0
  });
}
const PagesDocumentElementRenderers = {
  css: CssElement,
  md: MarkdownElement
};
function fetchPagesDocument(doc) {
  return Promise.all(
    doc.map(async (element) => {
      if (element.url) {
        try {
          const res = await getAsset(element.url);
          return { ...element, data: res };
        } catch (error2) {
          console.error(`Failed to load asset from ${element.url}:`, error2);
        }
      }
      return { ...element, data: element.data || "" };
    })
  );
}
function CssElement({ data }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: data });
}
function MarkdownElement({ data }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "app-pages-element-markdown", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MarkdownContent, { content: data }) });
}
function PagesDocument({
  doc,
  wrapperComponent: Wrapper = Article,
  id
}) {
  const data = usePromise$1(fetchPagesDocument, [doc]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Wrapper, { id: `app-pages-docid-${id}`, children: data.map((element, index2) => {
    const Renderer = PagesDocumentElementRenderers[element.type];
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Renderer, { ...element }, index2);
  }) });
}
console.info("test app id", configRepo.get().id);
const PagesDocument_fixture = {
  "PagesDocument with custom css": /* @__PURE__ */ jsxRuntimeExports.jsx(
    PagesDocument,
    {
      id: "",
      doc: [
        {
          type: "md",
          data: `
#Kontur Atlas
Atlas is your GPS for big decisions. It's a tool that helps you use maps and data to figure out a wide range of things, from where to open a new store to exploring environmental sustainability.
`
        },
        {
          type: "css",
          data: `
h1 { background-color: #f2f2f2; }
p { background-color: #BF6C3F; }
`
        }
      ]
    }
  ),
  "Links test": /* @__PURE__ */ jsxRuntimeExports.jsx(
    PagesDocument,
    {
      id: "",
      doc: [
        {
          type: "md",
          data: `
[Link](https://example.com)

Controller using this email: [hello@kontur.io](mailto:hello@kontur.io) or contact address.

Controller using this email: <hello@kontur.io> or contact address.

hello@kontur.io

kancelaria@uodo.gov.pl

ng: <kancelaria@uodo.gov.pl>

http://www.youronlinechoices.com/

ng: <http://www.youronlinechoices.com/>
`
        }
      ]
    }
  ),
  "PagesDocument markdown sample": /* @__PURE__ */ jsxRuntimeExports.jsx(
    PagesDocument,
    {
      id: "",
      doc: [
        {
          type: "md",
          data: _md
        },
        {
          type: "css",
          data: _css
        }
      ]
    }
  )
};
const fixture0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PagesDocument_fixture
}, Symbol.toStringTag, { value: "Module" }));
function r(e) {
  var t2, f2, n2 = "";
  if ("string" == typeof e || "number" == typeof e) n2 += e;
  else if ("object" == typeof e) if (Array.isArray(e)) for (t2 = 0; t2 < e.length; t2++) e[t2] && (f2 = r(e[t2])) && (n2 && (n2 += " "), n2 += f2);
  else for (t2 in e) e[t2] && (n2 && (n2 += " "), n2 += t2);
  return n2;
}
function clsx() {
  for (var e, t2, f2 = 0, n2 = ""; f2 < arguments.length; ) (e = arguments[f2++]) && (t2 = r(e)) && (n2 && (n2 += " "), n2 += t2);
  return n2;
}
const Close16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.64645 2.64645C2.84171 2.45118 3.15829 2.45118 3.35355 2.64645L13.3536 12.6464C13.5488 12.8417 13.5488 13.1583 13.3536 13.3536C13.1583 13.5488 12.8417 13.5488 12.6464 13.3536L2.64645 3.35355C2.45118 3.15829 2.45118 2.84171 2.64645 2.64645Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M13.3536 2.64645C13.1583 2.45118 12.8417 2.45118 12.6464 2.64645L2.64645 12.6464C2.45118 12.8417 2.45118 13.1583 2.64645 13.3536C2.84171 13.5488 3.15829 13.5488 3.35355 13.3536L13.3536 3.35355C13.5488 3.15829 13.5488 2.84171 13.3536 2.64645Z", fill: "currentColor" })] });
Close16.displayName = "Close16";
const Memo$2 = reactExports.memo(Close16);
const People16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.9603 9.61389C12.0294 9.34652 12.3021 9.18573 12.5695 9.25477C13.1535 9.40556 13.6709 9.74603 14.0404 10.2227C14.4099 10.6994 14.6107 11.2854 14.6111 11.8885V13C14.6111 13.2761 14.3873 13.5 14.1111 13.5C13.835 13.5 13.6111 13.2761 13.6111 13V11.8893C13.6108 11.5077 13.4838 11.1369 13.25 10.8354C13.0163 10.5338 12.6889 10.3184 12.3195 10.223C12.0521 10.154 11.8913 9.88127 11.9603 9.61389Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M2.18618 9.96398C2.6967 9.45346 3.38911 9.16666 4.11108 9.16666H8.55553C9.27751 9.16666 9.96992 9.45346 10.4804 9.96398C10.9909 10.4745 11.2778 11.1669 11.2778 11.8889V13C11.2778 13.2761 11.0539 13.5 10.7778 13.5C10.5016 13.5 10.2778 13.2761 10.2778 13V11.8889C10.2778 11.4321 10.0963 10.9941 9.77332 10.6711C9.45034 10.3481 9.01229 10.1667 8.55553 10.1667H4.11108C3.65432 10.1667 3.21627 10.3481 2.89329 10.6711C2.57031 10.9941 2.38886 11.4321 2.38886 11.8889V13C2.38886 13.2761 2.165 13.5 1.88886 13.5C1.61272 13.5 1.38886 13.2761 1.38886 13V11.8889C1.38886 11.1669 1.67567 10.4745 2.18618 9.96398Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M9.73774 2.94818C9.80623 2.68067 10.0786 2.51934 10.3461 2.58783C10.9317 2.73776 11.4507 3.07831 11.8213 3.55579C12.192 4.03327 12.3931 4.62053 12.3931 5.22498C12.3931 5.82943 12.192 6.41669 11.8213 6.89417C11.4507 7.37166 10.9317 7.71221 10.3461 7.86213C10.0786 7.93063 9.80623 7.76929 9.73774 7.50178C9.66924 7.23427 9.83058 6.96188 10.0981 6.89338C10.4685 6.79853 10.7969 6.58308 11.0314 6.281C11.2659 5.97892 11.3931 5.60739 11.3931 5.22498C11.3931 4.84258 11.2659 4.47105 11.0314 4.16896C10.7969 3.86688 10.4685 3.65143 10.0981 3.55658C9.83058 3.48809 9.66924 3.2157 9.73774 2.94818Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.33331 3.5C5.38216 3.5 4.61109 4.27107 4.61109 5.22222C4.61109 6.17338 5.38216 6.94444 6.33331 6.94444C7.28447 6.94444 8.05554 6.17338 8.05554 5.22222C8.05554 4.27107 7.28447 3.5 6.33331 3.5ZM3.61109 5.22222C3.61109 3.71878 4.82987 2.5 6.33331 2.5C7.83676 2.5 9.05554 3.71878 9.05554 5.22222C9.05554 6.72566 7.83676 7.94444 6.33331 7.94444C4.82987 7.94444 3.61109 6.72566 3.61109 5.22222Z", fill: "currentColor" })] });
People16.displayName = "People16";
const Memo$1 = reactExports.memo(People16);
const Area16 = (props) => jsxRuntimeExports.jsxs("svg", { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", ...props, children: [jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M4.83334 3.49999H11.1667V4.49999H4.83334V3.49999ZM4.50001 4.83332V11.1667H3.50001V4.83332H4.50001ZM12.5 4.83332V11.1667H11.5V4.83332H12.5ZM4.83334 11.5H11.1667V12.5H4.83334V11.5Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.66667 11.6667V12.3333H4.33334V11.6667H3.66667ZM3.16667 10.6667C2.89053 10.6667 2.66667 10.8905 2.66667 11.1667V12.8333C2.66667 13.1095 2.89053 13.3333 3.16667 13.3333H4.83334C5.10948 13.3333 5.33334 13.1095 5.33334 12.8333V11.1667C5.33334 10.8905 5.10948 10.6667 4.83334 10.6667H3.16667Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M3.66667 3.66666V4.33332H4.33334V3.66666H3.66667ZM3.16667 2.66666C2.89053 2.66666 2.66667 2.89051 2.66667 3.16666V4.83332C2.66667 5.10947 2.89053 5.33332 3.16667 5.33332H4.83334C5.10948 5.33332 5.33334 5.10947 5.33334 4.83332V3.16666C5.33334 2.89051 5.10948 2.66666 4.83334 2.66666H3.16667Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.6667 3.66666V4.33332H12.3333V3.66666H11.6667ZM11.1667 2.66666C10.8905 2.66666 10.6667 2.89051 10.6667 3.16666V4.83332C10.6667 5.10947 10.8905 5.33332 11.1667 5.33332H12.8333C13.1095 5.33332 13.3333 5.10947 13.3333 4.83332V3.16666C13.3333 2.89051 13.1095 2.66666 12.8333 2.66666H11.1667Z", fill: "currentColor" }), jsxRuntimeExports.jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M11.6667 11.6667V12.3333H12.3333V11.6667H11.6667ZM11.1667 10.6667C10.8905 10.6667 10.6667 10.8905 10.6667 11.1667V12.8333C10.6667 13.1095 10.8905 13.3333 11.1667 13.3333H12.8333C13.1095 13.3333 13.3333 13.1095 13.3333 12.8333V11.1667C13.3333 10.8905 13.1095 10.6667 12.8333 10.6667H11.1667Z", fill: "currentColor" })] });
Area16.displayName = "Area16";
const Memo = reactExports.memo(Area16);
function Text({ children, type, className }) {
  return reactExports.isValidElement(children) ? reactExports.cloneElement(children, { className: `k-font-${type} ${children.props.className} ${className}` }) : jsxRuntimeExports.jsx("span", { className: `k-font-${type} ${className}`, children });
}
const button = "_button_1231j_1";
const buttonDark = "_buttonDark_1231j_58";
const buttonInner = "_buttonInner_1231j_75";
const tiny = "_tiny_1231j_80";
const withContent = "_withContent_1231j_81";
const small = "_small_1231j_92";
const medium = "_medium_1231j_96";
const large = "_large_1231j_108";
const withIcon = "_withIcon_1231j_114";
const buttonContent = "_buttonContent_1231j_52";
const iconBefore = "_iconBefore_1231j_155";
const iconAfter = "_iconAfter_1231j_156";
const primary = "_primary_1231j_163";
const active$2 = "_active_1231j_174";
const invert = "_invert_1231j_180";
const s$c = {
  button,
  buttonDark,
  buttonInner,
  tiny,
  withContent,
  small,
  medium,
  large,
  withIcon,
  buttonContent,
  iconBefore,
  iconAfter,
  primary,
  active: active$2,
  "invert-outline": "_invert-outline_1231j_180",
  invert
};
const Button = reactExports.forwardRef(({ children, className, active: active2, variant = "primary", size = "medium", dark = false, iconBefore: iconBefore2, iconAfter: iconAfter2, ...props }, ref) => {
  const hasContent = reactExports.Children.count(children) > 0;
  const hasIcon = iconBefore2 || iconAfter2;
  return jsxRuntimeExports.jsx("button", { ref, className: clsx(s$c.button, {
    [s$c.buttonDark]: dark
  }, s$c[variant], s$c[size], {
    [s$c.active]: active2,
    [s$c.withContent]: hasContent,
    [s$c.withIcon]: hasIcon
  }, className), ...props, children: jsxRuntimeExports.jsxs("div", { className: clsx(s$c.buttonInner), children: [iconBefore2 && jsxRuntimeExports.jsx("div", { className: s$c.iconBefore, children: iconBefore2 }), hasContent && jsxRuntimeExports.jsx("span", { className: s$c.buttonContent, children }), iconAfter2 && jsxRuntimeExports.jsx("div", { className: s$c.iconAfter, children: iconAfter2 })] }) });
});
Button.displayName = "Button";
const typeToClass = (type) => `k-font-${type}`;
const getClassName = (type, margins, className) => `${typeToClass(type)} ${margins ? "" : typeToClass("unset-margins")} ${className ?? ""} `;
function Heading({ children, type, tag, margins = true }) {
  if (reactExports.isValidElement(children)) {
    return reactExports.cloneElement(children, {
      className: getClassName(type, margins, children.props.className)
    });
  }
  return reactExports.createElement(tag ? tag : "h" + type.slice(-1), { className: getClassName(type, margins) }, children);
}
const min = Math.min;
const max = Math.max;
const round = Math.round;
const floor = Math.floor;
const createCoords = (v2) => ({
  x: v2,
  y: v2
});
const oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
const oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis2) {
  return axis2 === "x" ? "y" : "x";
}
function getAxisLength(axis2) {
  return axis2 === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x: x2,
    y: y2,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y2,
    left: x2,
    right: x2 + width,
    bottom: y2 + height,
    x: x2,
    y: y2
  };
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
const computePosition$1 = async (reference, floating, config2) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config2;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x: x2,
    y: y2
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i2 = 0; i2 < validMiddleware.length; i2++) {
    const {
      name,
      fn
    } = validMiddleware[i2];
    const {
      x: nextX,
      y: nextY,
      data,
      reset: reset2
    } = await fn({
      x: x2,
      y: y2,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x2 = nextX != null ? nextX : x2;
    y2 = nextY != null ? nextY : y2;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (reset2 && resetCount <= 50) {
      resetCount++;
      if (typeof reset2 === "object") {
        if (reset2.placement) {
          statefulPlacement = reset2.placement;
        }
        if (reset2.rects) {
          rects = reset2.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset2.rects;
        }
        ({
          x: x2,
          y: y2
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i2 = -1;
    }
  }
  return {
    x: x2,
    y: y2,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x: x2,
    y: y2,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x: x2,
    y: y2,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
const arrow$4 = (options) => ({
  name: "arrow",
  options,
  async fn(state) {
    const {
      x: x2,
      y: y2,
      placement,
      rects,
      platform: platform2,
      elements,
      middlewareData
    } = state;
    const {
      element,
      padding = 0
    } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x: x2,
      y: y2
    };
    const axis2 = getAlignmentAxis(placement);
    const length = getAxisLength(axis2);
    const arrowDimensions = await platform2.getDimensions(element);
    const isYAxis = axis2 === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff = rects.reference[length] + rects.reference[axis2] - coords[axis2] - rects.floating[length];
    const startDiff = coords[axis2] - rects.reference[axis2];
    const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
    if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
    const min$1 = minPadding;
    const max2 = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset2 = clamp(min$1, center, max2);
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
    return {
      [axis2]: coords[axis2] + alignmentOffset,
      data: {
        [axis2]: offset2,
        centerOffset: center - offset2 - alignmentOffset,
        ...shouldAddOffset && {
          alignmentOffset
        }
      },
      reset: shouldAddOffset
    };
  }
});
const flip$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$arrow, _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = evaluate(options, state);
      if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      const side = getSide(placement);
      const initialSideAxis = getSideAxis(initialPlacement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
      if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const sides = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[sides[0]], overflow[sides[1]]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d2) => d2.overflows[0] <= 0).sort((a2, b2) => a2.overflows[1] - b2.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$filter2;
              const placement2 = (_overflowsData$filter2 = overflowsData.filter((d2) => {
                if (hasFallbackAxisSideDirection) {
                  const currentSideAxis = getSideAxis(d2.placement);
                  return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  currentSideAxis === "y";
                }
                return true;
              }).map((d2) => [d2.placement, d2.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a2, b2) => a2[1] - b2[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
const offset$1 = function(options) {
  if (options === void 0) {
    options = 0;
  }
  return {
    name: "offset",
    options,
    async fn(state) {
      var _middlewareData$offse, _middlewareData$arrow;
      const {
        x: x2,
        y: y2,
        placement,
        middlewareData
      } = state;
      const diffCoords = await convertValueToCoords(state, options);
      if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
        return {};
      }
      return {
        x: x2 + diffCoords.x,
        y: y2 + diffCoords.y,
        data: {
          ...diffCoords,
          placement
        }
      };
    }
  };
};
const shift$1 = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x: x2,
        y: y2,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x3,
              y: y3
            } = _ref;
            return {
              x: x3,
              y: y3
            };
          }
        },
        ...detectOverflowOptions
      } = evaluate(options, state);
      const coords = {
        x: x2,
        y: y2
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const crossAxis = getSideAxis(getSide(placement));
      const mainAxis = getOppositeAxis(crossAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min2 = mainAxisCoord + overflow[minSide];
        const max2 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = clamp(min2, mainAxisCoord, max2);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min2 = crossAxisCoord + overflow[minSide];
        const max2 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = clamp(min2, crossAxisCoord, max2);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x2,
          y: limitedCoords.y - y2,
          enabled: {
            [mainAxis]: checkMainAxis,
            [crossAxis]: checkCrossAxis
          }
        }
      };
    }
  };
};
function hasWindow() {
  return typeof window !== "undefined";
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow$1(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow$1(value).Node;
}
function isElement$1(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow$1(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow$1(value).HTMLElement;
}
function isShadowRoot$1(value) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow$1(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isTopLayer(element) {
  return [":popover-open", ":modal"].some((selector) => {
    try {
      return element.matches(selector);
    } catch (e) {
      return false;
    }
  });
}
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css2 = isElement$1(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
  return css2.transform !== "none" || css2.perspective !== "none" || (css2.containerType ? css2.containerType !== "normal" : false) || !webkit && (css2.backdropFilter ? css2.backdropFilter !== "none" : false) || !webkit && (css2.filter ? css2.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value) => (css2.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css2.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle$1(element) {
  return getWindow$1(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement$1(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot$1(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot$1(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow$1(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
function getCssDimensions(element) {
  const css2 = getComputedStyle$1(element);
  let width = parseFloat(css2.width) || 0;
  let height = parseFloat(css2.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement$1(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $: $2
  } = getCssDimensions(domElement);
  let x2 = ($2 ? round(rect.width) : rect.width) / width;
  let y2 = ($2 ? round(rect.height) : rect.height) / height;
  if (!x2 || !Number.isFinite(x2)) {
    x2 = 1;
  }
  if (!y2 || !Number.isFinite(y2)) {
    y2 = 1;
  }
  return {
    x: x2,
    y: y2
  };
}
const noOffsets = /* @__PURE__ */ createCoords(0);
function getVisualOffsets(element) {
  const win = getWindow$1(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow$1(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement$1(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x2 = (clientRect.left + visualOffsets.x) / scale.x;
  let y2 = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow$1(domElement);
    const offsetWin = offsetParent && isElement$1(offsetParent) ? getWindow$1(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css2 = getComputedStyle$1(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css2.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css2.paddingTop)) * iframeScale.y;
      x2 *= iframeScale.x;
      y2 *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x2 += left;
      y2 += top;
      currentWin = getWindow$1(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x: x2,
    y: y2
  });
}
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
  if (ignoreScrollbarX === void 0) {
    ignoreScrollbarX = false;
  }
  const htmlRect = documentElement.getBoundingClientRect();
  const x2 = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 : (
    // RTL <body> scrollbar.
    getWindowScrollBarX(documentElement, htmlRect)
  ));
  const y2 = htmlRect.top + scroll.scrollTop;
  return {
    x: x2,
    y: y2
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x2 = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y2 = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x2 += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x: x2,
    y: y2
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow$1(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x2 = 0;
  let y2 = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x2 = visualViewport.offsetLeft;
      y2 = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x2,
    y: y2
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x2 = left * scale.x;
  const y2 = top * scale.y;
  return {
    width,
    height,
    x: x2,
    y: y2
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement$1(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement$1(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement$1(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement$1(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x2 = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y2 = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x: x2,
    y: y2,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle$1(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow$1(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement$1(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}
const getElementRects = async function(data) {
  const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
  const getDimensionsFn = this.getDimensions;
  const floatingDimensions = await getDimensionsFn(data.floating);
  return {
    reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
    floating: {
      x: 0,
      y: 0,
      width: floatingDimensions.width,
      height: floatingDimensions.height
    }
  };
};
function isRTL(element) {
  return getComputedStyle$1(element).direction === "rtl";
}
const platform = {
  convertOffsetParentRelativeRectToViewportRelativeRect,
  getDocumentElement,
  getClippingRect,
  getOffsetParent,
  getElementRects,
  getClientRects,
  getDimensions,
  getScale,
  isElement: isElement$1,
  isRTL
};
function observeMove(element, onMove) {
  let io = null;
  let timeoutId2;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId2);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const {
      left,
      top,
      width,
      height
    } = element.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId2 = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (e) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update);
      ancestorResize && ancestor.removeEventListener("resize", update);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
const offset = offset$1;
const shift = shift$1;
const flip = flip$1;
const arrow$3 = arrow$4;
const computePosition = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition$1(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};
const arrow$2 = (options) => {
  const {
    element,
    padding
  } = options;
  function isRef(value) {
    return Object.prototype.hasOwnProperty.call(value, "current");
  }
  return {
    name: "arrow",
    options,
    fn(args) {
      if (isRef(element)) {
        if (element.current != null) {
          return arrow$3({
            element: element.current,
            padding
          }).fn(args);
        }
        return {};
      } else if (element) {
        return arrow$3({
          element,
          padding
        }).fn(args);
      }
      return {};
    }
  };
};
var index$1 = typeof document !== "undefined" ? reactExports.useLayoutEffect : reactExports.useEffect;
function deepEqual(a2, b2) {
  if (a2 === b2) {
    return true;
  }
  if (typeof a2 !== typeof b2) {
    return false;
  }
  if (typeof a2 === "function" && a2.toString() === b2.toString()) {
    return true;
  }
  let length, i2, keys;
  if (a2 && b2 && typeof a2 == "object") {
    if (Array.isArray(a2)) {
      length = a2.length;
      if (length != b2.length) return false;
      for (i2 = length; i2-- !== 0; ) {
        if (!deepEqual(a2[i2], b2[i2])) {
          return false;
        }
      }
      return true;
    }
    keys = Object.keys(a2);
    length = keys.length;
    if (length !== Object.keys(b2).length) {
      return false;
    }
    for (i2 = length; i2-- !== 0; ) {
      if (!Object.prototype.hasOwnProperty.call(b2, keys[i2])) {
        return false;
      }
    }
    for (i2 = length; i2-- !== 0; ) {
      const key = keys[i2];
      if (key === "_owner" && a2.$$typeof) {
        continue;
      }
      if (!deepEqual(a2[key], b2[key])) {
        return false;
      }
    }
    return true;
  }
  return a2 !== a2 && b2 !== b2;
}
function useLatestRef$1(value) {
  const ref = reactExports.useRef(value);
  index$1(() => {
    ref.current = value;
  });
  return ref;
}
function useFloating$1(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2,
    whileElementsMounted,
    open
  } = options;
  const [data, setData] = reactExports.useState({
    x: null,
    y: null,
    strategy,
    placement,
    middlewareData: {},
    isPositioned: false
  });
  const [latestMiddleware, setLatestMiddleware] = reactExports.useState(middleware);
  if (!deepEqual(latestMiddleware, middleware)) {
    setLatestMiddleware(middleware);
  }
  const referenceRef = reactExports.useRef(null);
  const floatingRef = reactExports.useRef(null);
  const dataRef = reactExports.useRef(data);
  const whileElementsMountedRef = useLatestRef$1(whileElementsMounted);
  const platformRef = useLatestRef$1(platform2);
  const [reference, _setReference] = reactExports.useState(null);
  const [floating, _setFloating] = reactExports.useState(null);
  const setReference = reactExports.useCallback((node) => {
    if (referenceRef.current !== node) {
      referenceRef.current = node;
      _setReference(node);
    }
  }, []);
  const setFloating = reactExports.useCallback((node) => {
    if (floatingRef.current !== node) {
      floatingRef.current = node;
      _setFloating(node);
    }
  }, []);
  const update = reactExports.useCallback(() => {
    if (!referenceRef.current || !floatingRef.current) {
      return;
    }
    const config2 = {
      placement,
      strategy,
      middleware: latestMiddleware
    };
    if (platformRef.current) {
      config2.platform = platformRef.current;
    }
    computePosition(referenceRef.current, floatingRef.current, config2).then((data2) => {
      const fullData = {
        ...data2,
        isPositioned: true
      };
      if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
        dataRef.current = fullData;
        reactDomExports.flushSync(() => {
          setData(fullData);
        });
      }
    });
  }, [latestMiddleware, placement, strategy, platformRef]);
  index$1(() => {
    if (open === false && dataRef.current.isPositioned) {
      dataRef.current.isPositioned = false;
      setData((data2) => ({
        ...data2,
        isPositioned: false
      }));
    }
  }, [open]);
  const isMountedRef = reactExports.useRef(false);
  index$1(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  index$1(() => {
    if (reference && floating) {
      if (whileElementsMountedRef.current) {
        return whileElementsMountedRef.current(reference, floating, update);
      } else {
        update();
      }
    }
  }, [reference, floating, update, whileElementsMountedRef]);
  const refs = reactExports.useMemo(() => ({
    reference: referenceRef,
    floating: floatingRef,
    setReference,
    setFloating
  }), [setReference, setFloating]);
  const elements = reactExports.useMemo(() => ({
    reference,
    floating
  }), [reference, floating]);
  return reactExports.useMemo(() => ({
    ...data,
    update,
    refs,
    elements,
    reference: setReference,
    floating: setFloating
  }), [data, update, refs, elements, setReference, setFloating]);
}
const tooltipContainer = "_tooltipContainer_g6vht_4";
const hoverTooltip = "_hoverTooltip_g6vht_15";
const popup = "_popup_g6vht_18";
const contentBody = "_contentBody_g6vht_23";
const bodyBottom = "_bodyBottom_g6vht_36";
const unset = "_unset_g6vht_41";
const arrow$1 = "_arrow_g6vht_45";
const arrowInner = "_arrowInner_g6vht_74";
const tooltipContent$1 = "_tooltipContent_g6vht_81";
const closeIcon = "_closeIcon_g6vht_88";
const s$b = {
  tooltipContainer,
  hoverTooltip,
  popup,
  contentBody,
  bodyBottom,
  unset,
  arrow: arrow$1,
  "arrow-top": "_arrow-top_g6vht_58",
  "arrow-bottom": "_arrow-bottom_g6vht_62",
  "arrow-left": "_arrow-left_g6vht_66",
  "arrow-right": "_arrow-right_g6vht_70",
  arrowInner,
  tooltipContent: tooltipContent$1,
  closeIcon
};
function mapPlacement(deprecadedPlacement) {
  switch (deprecadedPlacement) {
    case "top-left":
      return "top-start";
    case "top-right":
      return "top-end";
    case "bottom-left":
      return "bottom-start";
    case "bottom-right":
      return "bottom-end";
  }
}
function calculatePlacement(deprecadedPlacement, placement, position) {
  if (deprecadedPlacement && placement)
    console.error("You should not use both placement and deprecadedPlacement props at the same time. Placement prop will be used.");
  if (placement)
    return placement;
  if (position) {
    if (typeof deprecadedPlacement === "function") {
      return mapPlacement(deprecadedPlacement(position));
    } else if (deprecadedPlacement)
      return mapPlacement(deprecadedPlacement);
  }
  return;
}
const defaultPlacement = "top";
function Tooltip$1({ children, position, triggerRef, transitionRef, placement: placementProp, getPlacement, classes, hoverBehavior = false, onOuterClick, onClose, open = true, offset: offsetValue = 7 }) {
  const onClickOuter = reactExports.useCallback((e) => {
    if (onOuterClick && hoverBehavior === true) {
      return;
    }
    if (onOuterClick) {
      onOuterClick(e);
      return;
    }
    onClose == null ? void 0 : onClose(e);
  }, [hoverBehavior, onOuterClick, onClose]);
  const arrowRef = reactExports.useRef(null);
  const placement = reactExports.useMemo(() => calculatePlacement(getPlacement, placementProp, position) || defaultPlacement, [getPlacement, placementProp, position]);
  const { refs, x: floatingX, y: floatingY, strategy, middlewareData: { arrow: { x: arrowX2, y: arrowY2 } = {} }, placement: finalPlacement } = useFloating$1({
    placement,
    open,
    whileElementsMounted: autoUpdate,
    middleware: [offset(offsetValue), flip(), shift({ padding: 5 }), arrow$2({ element: arrowRef })]
  });
  const positionVariables = reactExports.useMemo(() => ({
    "--tooltip-arrox-x-position": arrowX2 != null ? `${arrowX2}px` : "",
    "--tooltip-arrow-y-position": arrowY2 != null ? `${arrowY2}px` : "",
    "--tooltip-x-position": `${floatingX ?? 0}px`,
    "--tooltip-y-position": `${floatingY ?? 0}px`,
    "--tooltip-placement": strategy
  }), [arrowX2, arrowY2, floatingX, floatingY, strategy]);
  const arrowSide = reactExports.useMemo(() => {
    const side = finalPlacement.split("-")[0] || defaultPlacement;
    return `arrow-${side}`;
  }, [finalPlacement]);
  reactExports.useLayoutEffect(() => {
    if (triggerRef) {
      refs.setReference(triggerRef.current);
    } else if (position) {
      const { x: x2, y: y2 } = position;
      refs.setReference({
        getBoundingClientRect() {
          return { width: 0, height: 0, x: x2, y: y2, top: y2, left: x2, right: x2, bottom: y2 };
        }
      });
    }
  }, [position, refs, triggerRef]);
  if (position && triggerRef) {
    console.error("Both position and triggerRef are provided. Tooltip will be rendered with triggerRef");
  }
  if (!position && !triggerRef) {
    console.error("Tooltip will not be rendered because neither position nor triggerRef are provided");
    return null;
  }
  if (!open)
    return null;
  const onCloseProp = hoverBehavior ? void 0 : onClose;
  return jsxRuntimeExports.jsx("div", { ref: transitionRef, className: clsx(s$b.tooltipContainer, { [s$b.hoverTooltip]: hoverBehavior }), onClick: onClickOuter, style: positionVariables, children: jsxRuntimeExports.jsxs("div", { ref: refs.setFloating, className: s$b.tooltipContent, children: [jsxRuntimeExports.jsxs("div", { className: clsx(s$b.contentBody, clsx), children: [jsxRuntimeExports.jsxs("div", { children: [children, jsxRuntimeExports.jsx("div", { className: s$b.bodyBottom })] }), onCloseProp && jsxRuntimeExports.jsx("div", { className: s$b.closeIcon, onClick: onCloseProp, children: jsxRuntimeExports.jsx(Memo$2, {}) })] }), jsxRuntimeExports.jsx("div", { ref: arrowRef, className: clsx(s$b.arrow, s$b[arrowSide]), children: jsxRuntimeExports.jsx("div", { className: s$b.arrowInner }) })] }) });
}
/*!
* tabbable 6.2.0
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
var candidateSelectors = ["input:not([inert])", "select:not([inert])", "textarea:not([inert])", "a[href]:not([inert])", "button:not([inert])", "[tabindex]:not(slot):not([inert])", "audio[controls]:not([inert])", "video[controls]:not([inert])", '[contenteditable]:not([contenteditable="false"]):not([inert])', "details>summary:first-of-type:not([inert])", "details:not([inert])"];
var candidateSelector = /* @__PURE__ */ candidateSelectors.join(",");
var NoElement = typeof Element === "undefined";
var matches = NoElement ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
var getRootNode = !NoElement && Element.prototype.getRootNode ? function(element) {
  var _element$getRootNode;
  return element === null || element === void 0 ? void 0 : (_element$getRootNode = element.getRootNode) === null || _element$getRootNode === void 0 ? void 0 : _element$getRootNode.call(element);
} : function(element) {
  return element === null || element === void 0 ? void 0 : element.ownerDocument;
};
var isInert = function isInert2(node, lookUp) {
  var _node$getAttribute;
  if (lookUp === void 0) {
    lookUp = true;
  }
  var inertAtt = node === null || node === void 0 ? void 0 : (_node$getAttribute = node.getAttribute) === null || _node$getAttribute === void 0 ? void 0 : _node$getAttribute.call(node, "inert");
  var inert = inertAtt === "" || inertAtt === "true";
  var result = inert || lookUp && node && isInert2(node.parentNode);
  return result;
};
var isContentEditable = function isContentEditable2(node) {
  var _node$getAttribute2;
  var attValue = node === null || node === void 0 ? void 0 : (_node$getAttribute2 = node.getAttribute) === null || _node$getAttribute2 === void 0 ? void 0 : _node$getAttribute2.call(node, "contenteditable");
  return attValue === "" || attValue === "true";
};
var getCandidates = function getCandidates2(el, includeContainer, filter) {
  if (isInert(el)) {
    return [];
  }
  var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));
  if (includeContainer && matches.call(el, candidateSelector)) {
    candidates.unshift(el);
  }
  candidates = candidates.filter(filter);
  return candidates;
};
var getCandidatesIteratively = function getCandidatesIteratively2(elements, includeContainer, options) {
  var candidates = [];
  var elementsToCheck = Array.from(elements);
  while (elementsToCheck.length) {
    var element = elementsToCheck.shift();
    if (isInert(element, false)) {
      continue;
    }
    if (element.tagName === "SLOT") {
      var assigned = element.assignedElements();
      var content = assigned.length ? assigned : element.children;
      var nestedCandidates = getCandidatesIteratively2(content, true, options);
      if (options.flatten) {
        candidates.push.apply(candidates, nestedCandidates);
      } else {
        candidates.push({
          scopeParent: element,
          candidates: nestedCandidates
        });
      }
    } else {
      var validCandidate = matches.call(element, candidateSelector);
      if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
        candidates.push(element);
      }
      var shadowRoot = element.shadowRoot || // check for an undisclosed shadow
      typeof options.getShadowRoot === "function" && options.getShadowRoot(element);
      var validShadowRoot = !isInert(shadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element));
      if (shadowRoot && validShadowRoot) {
        var _nestedCandidates = getCandidatesIteratively2(shadowRoot === true ? element.children : shadowRoot.children, true, options);
        if (options.flatten) {
          candidates.push.apply(candidates, _nestedCandidates);
        } else {
          candidates.push({
            scopeParent: element,
            candidates: _nestedCandidates
          });
        }
      } else {
        elementsToCheck.unshift.apply(elementsToCheck, element.children);
      }
    }
  }
  return candidates;
};
var hasTabIndex = function hasTabIndex2(node) {
  return !isNaN(parseInt(node.getAttribute("tabindex"), 10));
};
var getTabIndex = function getTabIndex2(node) {
  if (!node) {
    throw new Error("No node provided");
  }
  if (node.tabIndex < 0) {
    if ((/^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node)) && !hasTabIndex(node)) {
      return 0;
    }
  }
  return node.tabIndex;
};
var getSortOrderTabIndex = function getSortOrderTabIndex2(node, isScope) {
  var tabIndex = getTabIndex(node);
  if (tabIndex < 0 && isScope && !hasTabIndex(node)) {
    return 0;
  }
  return tabIndex;
};
var sortOrderedTabbables = function sortOrderedTabbables2(a2, b2) {
  return a2.tabIndex === b2.tabIndex ? a2.documentOrder - b2.documentOrder : a2.tabIndex - b2.tabIndex;
};
var isInput = function isInput2(node) {
  return node.tagName === "INPUT";
};
var isHiddenInput = function isHiddenInput2(node) {
  return isInput(node) && node.type === "hidden";
};
var isDetailsWithSummary = function isDetailsWithSummary2(node) {
  var r2 = node.tagName === "DETAILS" && Array.prototype.slice.apply(node.children).some(function(child) {
    return child.tagName === "SUMMARY";
  });
  return r2;
};
var getCheckedRadio = function getCheckedRadio2(nodes, form) {
  for (var i2 = 0; i2 < nodes.length; i2++) {
    if (nodes[i2].checked && nodes[i2].form === form) {
      return nodes[i2];
    }
  }
};
var isTabbableRadio = function isTabbableRadio2(node) {
  if (!node.name) {
    return true;
  }
  var radioScope = node.form || getRootNode(node);
  var queryRadios = function queryRadios2(name) {
    return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
  };
  var radioSet;
  if (typeof window !== "undefined" && typeof window.CSS !== "undefined" && typeof window.CSS.escape === "function") {
    radioSet = queryRadios(window.CSS.escape(node.name));
  } else {
    try {
      radioSet = queryRadios(node.name);
    } catch (err) {
      console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", err.message);
      return false;
    }
  }
  var checked = getCheckedRadio(radioSet, node.form);
  return !checked || checked === node;
};
var isRadio = function isRadio2(node) {
  return isInput(node) && node.type === "radio";
};
var isNonTabbableRadio = function isNonTabbableRadio2(node) {
  return isRadio(node) && !isTabbableRadio(node);
};
var isNodeAttached = function isNodeAttached2(node) {
  var _nodeRoot;
  var nodeRoot = node && getRootNode(node);
  var nodeRootHost = (_nodeRoot = nodeRoot) === null || _nodeRoot === void 0 ? void 0 : _nodeRoot.host;
  var attached = false;
  if (nodeRoot && nodeRoot !== node) {
    var _nodeRootHost, _nodeRootHost$ownerDo, _node$ownerDocument;
    attached = !!((_nodeRootHost = nodeRootHost) !== null && _nodeRootHost !== void 0 && (_nodeRootHost$ownerDo = _nodeRootHost.ownerDocument) !== null && _nodeRootHost$ownerDo !== void 0 && _nodeRootHost$ownerDo.contains(nodeRootHost) || node !== null && node !== void 0 && (_node$ownerDocument = node.ownerDocument) !== null && _node$ownerDocument !== void 0 && _node$ownerDocument.contains(node));
    while (!attached && nodeRootHost) {
      var _nodeRoot2, _nodeRootHost2, _nodeRootHost2$ownerD;
      nodeRoot = getRootNode(nodeRootHost);
      nodeRootHost = (_nodeRoot2 = nodeRoot) === null || _nodeRoot2 === void 0 ? void 0 : _nodeRoot2.host;
      attached = !!((_nodeRootHost2 = nodeRootHost) !== null && _nodeRootHost2 !== void 0 && (_nodeRootHost2$ownerD = _nodeRootHost2.ownerDocument) !== null && _nodeRootHost2$ownerD !== void 0 && _nodeRootHost2$ownerD.contains(nodeRootHost));
    }
  }
  return attached;
};
var isZeroArea = function isZeroArea2(node) {
  var _node$getBoundingClie = node.getBoundingClientRect(), width = _node$getBoundingClie.width, height = _node$getBoundingClie.height;
  return width === 0 && height === 0;
};
var isHidden = function isHidden2(node, _ref) {
  var displayCheck = _ref.displayCheck, getShadowRoot = _ref.getShadowRoot;
  if (getComputedStyle(node).visibility === "hidden") {
    return true;
  }
  var isDirectSummary = matches.call(node, "details>summary:first-of-type");
  var nodeUnderDetails = isDirectSummary ? node.parentElement : node;
  if (matches.call(nodeUnderDetails, "details:not([open]) *")) {
    return true;
  }
  if (!displayCheck || displayCheck === "full" || displayCheck === "legacy-full") {
    if (typeof getShadowRoot === "function") {
      var originalNode = node;
      while (node) {
        var parentElement = node.parentElement;
        var rootNode = getRootNode(node);
        if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true) {
          return isZeroArea(node);
        } else if (node.assignedSlot) {
          node = node.assignedSlot;
        } else if (!parentElement && rootNode !== node.ownerDocument) {
          node = rootNode.host;
        } else {
          node = parentElement;
        }
      }
      node = originalNode;
    }
    if (isNodeAttached(node)) {
      return !node.getClientRects().length;
    }
    if (displayCheck !== "legacy-full") {
      return true;
    }
  } else if (displayCheck === "non-zero-area") {
    return isZeroArea(node);
  }
  return false;
};
var isDisabledFromFieldset = function isDisabledFromFieldset2(node) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    var parentNode = node.parentElement;
    while (parentNode) {
      if (parentNode.tagName === "FIELDSET" && parentNode.disabled) {
        for (var i2 = 0; i2 < parentNode.children.length; i2++) {
          var child = parentNode.children.item(i2);
          if (child.tagName === "LEGEND") {
            return matches.call(parentNode, "fieldset[disabled] *") ? true : !child.contains(node);
          }
        }
        return true;
      }
      parentNode = parentNode.parentElement;
    }
  }
  return false;
};
var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable2(options, node) {
  if (node.disabled || // we must do an inert look up to filter out any elements inside an inert ancestor
  //  because we're limited in the type of selectors we can use in JSDom (see related
  //  note related to `candidateSelectors`)
  isInert(node) || isHiddenInput(node) || isHidden(node, options) || // For a details element with a summary, the summary element gets the focus
  isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
    return false;
  }
  return true;
};
var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable2(options, node) {
  if (isNonTabbableRadio(node) || getTabIndex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
    return false;
  }
  return true;
};
var isValidShadowRootTabbable = function isValidShadowRootTabbable2(shadowHostNode) {
  var tabIndex = parseInt(shadowHostNode.getAttribute("tabindex"), 10);
  if (isNaN(tabIndex) || tabIndex >= 0) {
    return true;
  }
  return false;
};
var sortByOrder = function sortByOrder2(candidates) {
  var regularTabbables = [];
  var orderedTabbables = [];
  candidates.forEach(function(item, i2) {
    var isScope = !!item.scopeParent;
    var element = isScope ? item.scopeParent : item;
    var candidateTabindex = getSortOrderTabIndex(element, isScope);
    var elements = isScope ? sortByOrder2(item.candidates) : element;
    if (candidateTabindex === 0) {
      isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
    } else {
      orderedTabbables.push({
        documentOrder: i2,
        tabIndex: candidateTabindex,
        item,
        isScope,
        content: elements
      });
    }
  });
  return orderedTabbables.sort(sortOrderedTabbables).reduce(function(acc, sortable) {
    sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
    return acc;
  }, []).concat(regularTabbables);
};
var tabbable = function tabbable2(container, options) {
  options = options || {};
  var candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer, {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isValidShadowRootTabbable
    });
  } else {
    candidates = getCandidates(container, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
  }
  return sortByOrder(candidates);
};
function _extends$3() {
  _extends$3 = Object.assign || function(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$3.apply(this, arguments);
}
var index = typeof document !== "undefined" ? reactExports.useLayoutEffect : reactExports.useEffect;
let serverHandoffComplete = false;
let count = 0;
const genId = () => "floating-ui-" + count++;
function useFloatingId() {
  const [id, setId] = reactExports.useState(() => serverHandoffComplete ? genId() : void 0);
  index(() => {
    if (id == null) {
      setId(genId());
    }
  }, []);
  reactExports.useEffect(() => {
    if (!serverHandoffComplete) {
      serverHandoffComplete = true;
    }
  }, []);
  return id;
}
const useReactId = React$1[/* @__PURE__ */ "useId".toString()];
const useId = useReactId || useFloatingId;
const FloatingArrow = /* @__PURE__ */ reactExports.forwardRef(function FloatingArrow2(_ref, ref) {
  var _rest$style;
  let {
    context: {
      placement,
      elements: {
        floating
      },
      middlewareData: {
        arrow: arrow2
      }
    },
    width = 14,
    height = 7,
    tipRadius = 0,
    strokeWidth = 0,
    staticOffset,
    stroke,
    d: d2,
    ...rest
  } = _ref;
  strokeWidth *= 2;
  const halfStrokeWidth = strokeWidth / 2;
  const svgX = width / 2 * (tipRadius / -8 + 1);
  const svgY = height / 2 * tipRadius / 4;
  const [side, alignment] = placement.split("-");
  const isRTL2 = floating ? platform.isRTL(floating) : false;
  const isCustomShape = !!d2;
  const isVerticalSide = side === "top" || side === "bottom";
  const yOffsetProp = staticOffset && alignment === "end" ? "bottom" : "top";
  let xOffsetProp = staticOffset && alignment === "end" ? "right" : "left";
  if (staticOffset && isRTL2) {
    xOffsetProp = alignment === "end" ? "left" : "right";
  }
  const arrowOffsetY = isCustomShape ? 0 : halfStrokeWidth;
  const arrowX2 = (arrow2 == null ? void 0 : arrow2.x) != null ? staticOffset || arrow2.x : "";
  const arrowY2 = (arrow2 == null ? void 0 : arrow2.y) != null ? staticOffset || arrow2.y + arrowOffsetY : "";
  const dValue = d2 || "M0,0" + (" H" + width) + (" L" + (width - svgX) + "," + (height - svgY)) + (" Q" + width / 2 + "," + height + " " + svgX + "," + (height - svgY)) + " Z";
  const rotation = {
    top: isCustomShape ? "rotate(180deg)" : "",
    left: isCustomShape ? "rotate(90deg)" : "rotate(-90deg)",
    bottom: isCustomShape ? "" : "rotate(180deg)",
    right: isCustomShape ? "rotate(-90deg)" : "rotate(90deg)"
  }[side];
  const clipPathId = useId();
  return /* @__PURE__ */ reactExports.createElement("svg", _extends$3({}, rest, {
    // @ts-ignore
    suppressHydrationWarning: true,
    "aria-hidden": true,
    ref,
    width: isCustomShape ? width : width + strokeWidth,
    height: width,
    viewBox: "0 0 " + width + " " + (height > width ? height : width),
    style: {
      ...rest.style,
      position: "absolute",
      pointerEvents: "none",
      [xOffsetProp]: arrowX2,
      [yOffsetProp]: arrowY2,
      [side]: isVerticalSide || isCustomShape ? "100%" : "calc(100% - " + strokeWidth / 2 + "px)",
      transform: "" + rotation + ((_rest$style = rest.style) != null && _rest$style.transform ? " " + rest.style.transform : "")
    }
  }), strokeWidth > 0 && /* @__PURE__ */ reactExports.createElement("path", {
    clipPath: "url(#" + clipPathId + ")",
    fill: "none",
    stroke,
    strokeWidth: strokeWidth + (d2 ? 0 : 1),
    d: dValue
  }), /* @__PURE__ */ reactExports.createElement("path", {
    stroke: strokeWidth && !d2 ? rest.fill : "none",
    d: dValue
  }), /* @__PURE__ */ reactExports.createElement("clipPath", {
    id: clipPathId
  }, /* @__PURE__ */ reactExports.createElement("rect", {
    x: -halfStrokeWidth,
    y: halfStrokeWidth * (isCustomShape ? -1 : 1),
    width: width + strokeWidth,
    height: width
  })));
});
function createPubSub() {
  const map = /* @__PURE__ */ new Map();
  return {
    emit(event2, data) {
      var _map$get;
      (_map$get = map.get(event2)) == null ? void 0 : _map$get.forEach((handler) => handler(data));
    },
    on(event2, listener) {
      map.set(event2, [...map.get(event2) || [], listener]);
    },
    off(event2, listener) {
      map.set(event2, (map.get(event2) || []).filter((l2) => l2 !== listener));
    }
  };
}
const FloatingNodeContext = /* @__PURE__ */ reactExports.createContext(null);
const FloatingTreeContext = /* @__PURE__ */ reactExports.createContext(null);
const useFloatingParentNodeId = () => {
  var _React$useContext;
  return ((_React$useContext = reactExports.useContext(FloatingNodeContext)) == null ? void 0 : _React$useContext.id) || null;
};
const useFloatingTree = () => reactExports.useContext(FloatingTreeContext);
function getDocument(node) {
  return (node == null ? void 0 : node.ownerDocument) || document;
}
function getWindow(value) {
  return getDocument(value).defaultView || window;
}
function isElement(value) {
  return value ? value instanceof getWindow(value).Element : false;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  const OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function isSafari() {
  return /apple/i.test(navigator.vendor);
}
function isMouseLikePointerType(pointerType, strict) {
  const values = ["mouse", "pen"];
  {
    values.push("", void 0);
  }
  return values.includes(pointerType);
}
function useLatestRef(value) {
  const ref = reactExports.useRef(value);
  index(() => {
    ref.current = value;
  });
  return ref;
}
const safePolygonIdentifier = "data-floating-ui-safe-polygon";
function getDelay(value, prop, pointerType) {
  if (pointerType && !isMouseLikePointerType(pointerType)) {
    return 0;
  }
  if (typeof value === "number") {
    return value;
  }
  return value == null ? void 0 : value[prop];
}
const useHover = function(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    onOpenChange,
    dataRef,
    events,
    elements: {
      domReference,
      floating
    },
    refs
  } = context;
  const {
    enabled = true,
    delay = 0,
    handleClose = null,
    mouseOnly = false,
    restMs = 0,
    move = true
  } = props;
  const tree = useFloatingTree();
  const parentId = useFloatingParentNodeId();
  const handleCloseRef = useLatestRef(handleClose);
  const delayRef = useLatestRef(delay);
  const pointerTypeRef = reactExports.useRef();
  const timeoutRef = reactExports.useRef();
  const handlerRef = reactExports.useRef();
  const restTimeoutRef = reactExports.useRef();
  const blockMouseMoveRef = reactExports.useRef(true);
  const performedPointerEventsMutationRef = reactExports.useRef(false);
  const unbindMouseMoveRef = reactExports.useRef(() => {
  });
  const isHoverOpen = reactExports.useCallback(() => {
    var _dataRef$current$open;
    const type = (_dataRef$current$open = dataRef.current.openEvent) == null ? void 0 : _dataRef$current$open.type;
    return (type == null ? void 0 : type.includes("mouse")) && type !== "mousedown";
  }, [dataRef]);
  reactExports.useEffect(() => {
    if (!enabled) {
      return;
    }
    function onDismiss() {
      clearTimeout(timeoutRef.current);
      clearTimeout(restTimeoutRef.current);
      blockMouseMoveRef.current = true;
    }
    events.on("dismiss", onDismiss);
    return () => {
      events.off("dismiss", onDismiss);
    };
  }, [enabled, events]);
  reactExports.useEffect(() => {
    if (!enabled || !handleCloseRef.current || !open) {
      return;
    }
    function onLeave() {
      if (isHoverOpen()) {
        onOpenChange(false);
      }
    }
    const html = getDocument(floating).documentElement;
    html.addEventListener("mouseleave", onLeave);
    return () => {
      html.removeEventListener("mouseleave", onLeave);
    };
  }, [floating, open, onOpenChange, enabled, handleCloseRef, dataRef, isHoverOpen]);
  const closeWithDelay = reactExports.useCallback(function(runElseBranch) {
    if (runElseBranch === void 0) {
      runElseBranch = true;
    }
    const closeDelay = getDelay(delayRef.current, "close", pointerTypeRef.current);
    if (closeDelay && !handlerRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => onOpenChange(false), closeDelay);
    } else if (runElseBranch) {
      clearTimeout(timeoutRef.current);
      onOpenChange(false);
    }
  }, [delayRef, onOpenChange]);
  const cleanupMouseMoveHandler = reactExports.useCallback(() => {
    unbindMouseMoveRef.current();
    handlerRef.current = void 0;
  }, []);
  const clearPointerEvents = reactExports.useCallback(() => {
    if (performedPointerEventsMutationRef.current) {
      const body = getDocument(refs.floating.current).body;
      body.style.pointerEvents = "";
      body.removeAttribute(safePolygonIdentifier);
      performedPointerEventsMutationRef.current = false;
    }
  }, [refs]);
  reactExports.useEffect(() => {
    if (!enabled) {
      return;
    }
    function isClickLikeOpenEvent() {
      return dataRef.current.openEvent ? ["click", "mousedown"].includes(dataRef.current.openEvent.type) : false;
    }
    function onMouseEnter(event2) {
      clearTimeout(timeoutRef.current);
      blockMouseMoveRef.current = false;
      if (mouseOnly && !isMouseLikePointerType(pointerTypeRef.current) || restMs > 0 && getDelay(delayRef.current, "open") === 0) {
        return;
      }
      dataRef.current.openEvent = event2;
      const openDelay = getDelay(delayRef.current, "open", pointerTypeRef.current);
      if (openDelay) {
        timeoutRef.current = setTimeout(() => {
          onOpenChange(true);
        }, openDelay);
      } else {
        onOpenChange(true);
      }
    }
    function onMouseLeave(event2) {
      if (isClickLikeOpenEvent()) {
        return;
      }
      unbindMouseMoveRef.current();
      const doc = getDocument(floating);
      clearTimeout(restTimeoutRef.current);
      if (handleCloseRef.current) {
        if (!open) {
          clearTimeout(timeoutRef.current);
        }
        handlerRef.current = handleCloseRef.current({
          ...context,
          tree,
          x: event2.clientX,
          y: event2.clientY,
          onClose() {
            clearPointerEvents();
            cleanupMouseMoveHandler();
            closeWithDelay();
          }
        });
        const handler = handlerRef.current;
        doc.addEventListener("mousemove", handler);
        unbindMouseMoveRef.current = () => {
          doc.removeEventListener("mousemove", handler);
        };
        return;
      }
      closeWithDelay();
    }
    function onScrollMouseLeave(event2) {
      if (isClickLikeOpenEvent()) {
        return;
      }
      handleCloseRef.current == null ? void 0 : handleCloseRef.current({
        ...context,
        tree,
        x: event2.clientX,
        y: event2.clientY,
        onClose() {
          clearPointerEvents();
          cleanupMouseMoveHandler();
          closeWithDelay();
        }
      })(event2);
    }
    if (isElement(domReference)) {
      const ref = domReference;
      open && ref.addEventListener("mouseleave", onScrollMouseLeave);
      floating == null ? void 0 : floating.addEventListener("mouseleave", onScrollMouseLeave);
      move && ref.addEventListener("mousemove", onMouseEnter, {
        once: true
      });
      ref.addEventListener("mouseenter", onMouseEnter);
      ref.addEventListener("mouseleave", onMouseLeave);
      return () => {
        open && ref.removeEventListener("mouseleave", onScrollMouseLeave);
        floating == null ? void 0 : floating.removeEventListener("mouseleave", onScrollMouseLeave);
        move && ref.removeEventListener("mousemove", onMouseEnter);
        ref.removeEventListener("mouseenter", onMouseEnter);
        ref.removeEventListener("mouseleave", onMouseLeave);
      };
    }
  }, [domReference, floating, enabled, context, mouseOnly, restMs, move, closeWithDelay, cleanupMouseMoveHandler, clearPointerEvents, onOpenChange, open, tree, delayRef, handleCloseRef, dataRef]);
  index(() => {
    var _handleCloseRef$curre;
    if (!enabled) {
      return;
    }
    if (open && (_handleCloseRef$curre = handleCloseRef.current) != null && _handleCloseRef$curre.__options.blockPointerEvents && isHoverOpen()) {
      const body = getDocument(floating).body;
      body.setAttribute(safePolygonIdentifier, "");
      body.style.pointerEvents = "none";
      performedPointerEventsMutationRef.current = true;
      if (isElement(domReference) && floating) {
        var _tree$nodesRef$curren, _tree$nodesRef$curren2;
        const ref = domReference;
        const parentFloating = tree == null ? void 0 : (_tree$nodesRef$curren = tree.nodesRef.current.find((node) => node.id === parentId)) == null ? void 0 : (_tree$nodesRef$curren2 = _tree$nodesRef$curren.context) == null ? void 0 : _tree$nodesRef$curren2.elements.floating;
        if (parentFloating) {
          parentFloating.style.pointerEvents = "";
        }
        ref.style.pointerEvents = "auto";
        floating.style.pointerEvents = "auto";
        return () => {
          ref.style.pointerEvents = "";
          floating.style.pointerEvents = "";
        };
      }
    }
  }, [enabled, open, parentId, floating, domReference, tree, handleCloseRef, dataRef, isHoverOpen]);
  index(() => {
    if (!open) {
      pointerTypeRef.current = void 0;
      cleanupMouseMoveHandler();
      clearPointerEvents();
    }
  }, [open, cleanupMouseMoveHandler, clearPointerEvents]);
  reactExports.useEffect(() => {
    return () => {
      cleanupMouseMoveHandler();
      clearTimeout(timeoutRef.current);
      clearTimeout(restTimeoutRef.current);
      clearPointerEvents();
    };
  }, [enabled, cleanupMouseMoveHandler, clearPointerEvents]);
  return reactExports.useMemo(() => {
    if (!enabled) {
      return {};
    }
    function setPointerRef(event2) {
      pointerTypeRef.current = event2.pointerType;
    }
    return {
      reference: {
        onPointerDown: setPointerRef,
        onPointerEnter: setPointerRef,
        onMouseMove() {
          if (open || restMs === 0) {
            return;
          }
          clearTimeout(restTimeoutRef.current);
          restTimeoutRef.current = setTimeout(() => {
            if (!blockMouseMoveRef.current) {
              onOpenChange(true);
            }
          }, restMs);
        }
      },
      floating: {
        onMouseEnter() {
          clearTimeout(timeoutRef.current);
        },
        onMouseLeave() {
          events.emit("dismiss", {
            type: "mouseLeave",
            data: {
              returnFocus: false
            }
          });
          closeWithDelay(false);
        }
      }
    };
  }, [events, enabled, restMs, open, onOpenChange, closeWithDelay]);
};
function activeElement(doc) {
  let activeElement2 = doc.activeElement;
  while (((_activeElement = activeElement2) == null ? void 0 : (_activeElement$shadow = _activeElement.shadowRoot) == null ? void 0 : _activeElement$shadow.activeElement) != null) {
    var _activeElement, _activeElement$shadow;
    activeElement2 = activeElement2.shadowRoot.activeElement;
  }
  return activeElement2;
}
function contains(parent, child) {
  if (!parent || !child) {
    return false;
  }
  const rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    do {
      if (next && parent === next) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}
const getTabbableOptions = () => ({
  getShadowRoot: true,
  displayCheck: (
    // JSDOM does not support the `tabbable` library. To solve this we can
    // check if `ResizeObserver` is a real function (not polyfilled), which
    // determines if the current environment is JSDOM-like.
    typeof ResizeObserver === "function" && ResizeObserver.toString().includes("[native code]") ? "full" : "none"
  )
});
function getTabbableIn(container, direction) {
  const allTabbable = tabbable(container, getTabbableOptions());
  if (direction === "prev") {
    allTabbable.reverse();
  }
  const activeIndex = allTabbable.indexOf(activeElement(getDocument(container)));
  const nextTabbableElements = allTabbable.slice(activeIndex + 1);
  return nextTabbableElements[0];
}
function getNextTabbable() {
  return getTabbableIn(document.body, "next");
}
function getPreviousTabbable() {
  return getTabbableIn(document.body, "prev");
}
function isOutsideEvent(event2, container) {
  const containerElement = container || event2.currentTarget;
  const relatedTarget = event2.relatedTarget;
  return !relatedTarget || !contains(containerElement, relatedTarget);
}
function disableFocusInside(container) {
  const tabbableElements = tabbable(container, getTabbableOptions());
  tabbableElements.forEach((element) => {
    element.dataset.tabindex = element.getAttribute("tabindex") || "";
    element.setAttribute("tabindex", "-1");
  });
}
function enableFocusInside(container) {
  const elements = container.querySelectorAll("[data-tabindex]");
  elements.forEach((element) => {
    const tabindex = element.dataset.tabindex;
    delete element.dataset.tabindex;
    if (tabindex) {
      element.setAttribute("tabindex", tabindex);
    } else {
      element.removeAttribute("tabindex");
    }
  });
}
const HIDDEN_STYLES = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "fixed",
  whiteSpace: "nowrap",
  width: "1px",
  top: 0,
  left: 0
};
let timeoutId;
function setActiveElementOnTab(event2) {
  if (event2.key === "Tab") {
    event2.target;
    clearTimeout(timeoutId);
  }
}
const FocusGuard = /* @__PURE__ */ reactExports.forwardRef(function FocusGuard2(props, ref) {
  const [role, setRole] = reactExports.useState();
  index(() => {
    if (isSafari()) {
      setRole("button");
    }
    document.addEventListener("keydown", setActiveElementOnTab);
    return () => {
      document.removeEventListener("keydown", setActiveElementOnTab);
    };
  }, []);
  return /* @__PURE__ */ reactExports.createElement("span", _extends$3({}, props, {
    ref,
    tabIndex: 0,
    role,
    "aria-hidden": role ? void 0 : true,
    "data-floating-ui-focus-guard": "",
    style: HIDDEN_STYLES
  }));
});
const PortalContext = /* @__PURE__ */ reactExports.createContext(null);
const useFloatingPortalNode = function(_temp) {
  let {
    id,
    enabled = true
  } = _temp === void 0 ? {} : _temp;
  const [portalEl, setPortalEl] = reactExports.useState(null);
  const uniqueId = useId();
  const portalContext = usePortalContext();
  index(() => {
    if (!enabled) {
      return;
    }
    const rootNode = id ? document.getElementById(id) : null;
    if (rootNode) {
      rootNode.setAttribute("data-floating-ui-portal", "");
      setPortalEl(rootNode);
    } else {
      const newPortalEl = document.createElement("div");
      if (id !== "") {
        newPortalEl.id = id || uniqueId;
      }
      newPortalEl.setAttribute("data-floating-ui-portal", "");
      setPortalEl(newPortalEl);
      const container = (portalContext == null ? void 0 : portalContext.portalNode) || document.body;
      container.appendChild(newPortalEl);
      return () => {
        container.removeChild(newPortalEl);
      };
    }
  }, [id, portalContext, uniqueId, enabled]);
  return portalEl;
};
const FloatingPortal = (_ref) => {
  let {
    children,
    id,
    root = null,
    preserveTabOrder = true
  } = _ref;
  const portalNode = useFloatingPortalNode({
    id,
    enabled: !root
  });
  const [focusManagerState, setFocusManagerState] = reactExports.useState(null);
  const beforeOutsideRef = reactExports.useRef(null);
  const afterOutsideRef = reactExports.useRef(null);
  const beforeInsideRef = reactExports.useRef(null);
  const afterInsideRef = reactExports.useRef(null);
  const shouldRenderGuards = (
    // The FocusManager and therefore floating element are currently open/
    // rendered.
    !!focusManagerState && // Guards are only for non-modal focus management.
    !focusManagerState.modal && !!(root || portalNode) && preserveTabOrder
  );
  reactExports.useEffect(() => {
    if (!portalNode || !preserveTabOrder || focusManagerState != null && focusManagerState.modal) {
      return;
    }
    function onFocus(event2) {
      if (portalNode && isOutsideEvent(event2)) {
        const focusing = event2.type === "focusin";
        const manageFocus = focusing ? enableFocusInside : disableFocusInside;
        manageFocus(portalNode);
      }
    }
    portalNode.addEventListener("focusin", onFocus, true);
    portalNode.addEventListener("focusout", onFocus, true);
    return () => {
      portalNode.removeEventListener("focusin", onFocus, true);
      portalNode.removeEventListener("focusout", onFocus, true);
    };
  }, [portalNode, preserveTabOrder, focusManagerState == null ? void 0 : focusManagerState.modal]);
  return /* @__PURE__ */ reactExports.createElement(PortalContext.Provider, {
    value: reactExports.useMemo(() => ({
      preserveTabOrder,
      beforeOutsideRef,
      afterOutsideRef,
      beforeInsideRef,
      afterInsideRef,
      portalNode,
      setFocusManagerState
    }), [preserveTabOrder, portalNode])
  }, shouldRenderGuards && portalNode && /* @__PURE__ */ reactExports.createElement(FocusGuard, {
    "data-type": "outside",
    ref: beforeOutsideRef,
    onFocus: (event2) => {
      if (isOutsideEvent(event2, portalNode)) {
        var _beforeInsideRef$curr;
        (_beforeInsideRef$curr = beforeInsideRef.current) == null ? void 0 : _beforeInsideRef$curr.focus();
      } else {
        const prevTabbable = getPreviousTabbable() || (focusManagerState == null ? void 0 : focusManagerState.refs.domReference.current);
        prevTabbable == null ? void 0 : prevTabbable.focus();
      }
    }
  }), shouldRenderGuards && portalNode && /* @__PURE__ */ reactExports.createElement("span", {
    "aria-owns": portalNode.id,
    style: HIDDEN_STYLES
  }), root ? /* @__PURE__ */ reactDomExports.createPortal(children, root) : portalNode ? /* @__PURE__ */ reactDomExports.createPortal(children, portalNode) : null, shouldRenderGuards && portalNode && /* @__PURE__ */ reactExports.createElement(FocusGuard, {
    "data-type": "outside",
    ref: afterOutsideRef,
    onFocus: (event2) => {
      if (isOutsideEvent(event2, portalNode)) {
        var _afterInsideRef$curre;
        (_afterInsideRef$curre = afterInsideRef.current) == null ? void 0 : _afterInsideRef$curre.focus();
      } else {
        const nextTabbable = getNextTabbable() || (focusManagerState == null ? void 0 : focusManagerState.refs.domReference.current);
        nextTabbable == null ? void 0 : nextTabbable.focus();
        (focusManagerState == null ? void 0 : focusManagerState.closeOnFocusOut) && (focusManagerState == null ? void 0 : focusManagerState.onOpenChange(false));
      }
    }
  }));
};
const usePortalContext = () => reactExports.useContext(PortalContext);
const useInsertionEffect = React$1[/* @__PURE__ */ "useInsertionEffect".toString()];
const useSafeInsertionEffect = useInsertionEffect || ((fn) => fn());
function useEvent(callback) {
  const ref = reactExports.useRef(() => {
  });
  useSafeInsertionEffect(() => {
    ref.current = callback;
  });
  return reactExports.useCallback(function() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return ref.current == null ? void 0 : ref.current(...args);
  }, []);
}
function useMergeRefs(refs) {
  return reactExports.useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }
    return (value) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(value);
        } else if (ref != null) {
          ref.current = value;
        }
      });
    };
  }, refs);
}
const useRole = function(context, props) {
  if (props === void 0) {
    props = {};
  }
  const {
    open,
    floatingId
  } = context;
  const {
    enabled = true,
    role = "dialog"
  } = props;
  const referenceId = useId();
  return reactExports.useMemo(() => {
    const floatingProps = {
      id: floatingId,
      role
    };
    if (!enabled) {
      return {};
    }
    if (role === "tooltip") {
      return {
        reference: {
          "aria-describedby": open ? floatingId : void 0
        },
        floating: floatingProps
      };
    }
    return {
      reference: {
        "aria-expanded": open ? "true" : "false",
        "aria-haspopup": role === "alertdialog" ? "dialog" : role,
        "aria-controls": open ? floatingId : void 0,
        ...role === "listbox" && {
          role: "combobox"
        },
        ...role === "menu" && {
          id: referenceId
        }
      },
      floating: {
        ...floatingProps,
        ...role === "menu" && {
          "aria-labelledby": referenceId
        }
      }
    };
  }, [enabled, role, open, floatingId, referenceId]);
};
function useFloating(options) {
  if (options === void 0) {
    options = {};
  }
  const {
    open = false,
    onOpenChange: unstable_onOpenChange,
    nodeId
  } = options;
  const position = useFloating$1(options);
  const tree = useFloatingTree();
  const domReferenceRef = reactExports.useRef(null);
  const dataRef = reactExports.useRef({});
  const events = reactExports.useState(() => createPubSub())[0];
  const floatingId = useId();
  const [domReference, setDomReference] = reactExports.useState(null);
  const setPositionReference = reactExports.useCallback((node) => {
    const positionReference = isElement(node) ? {
      getBoundingClientRect: () => node.getBoundingClientRect(),
      contextElement: node
    } : node;
    position.refs.setReference(positionReference);
  }, [position.refs]);
  const setReference = reactExports.useCallback((node) => {
    if (isElement(node) || node === null) {
      domReferenceRef.current = node;
      setDomReference(node);
    }
    if (isElement(position.refs.reference.current) || position.refs.reference.current === null || // Don't allow setting virtual elements using the old technique back to
    // `null` to support `positionReference` + an unstable `reference`
    // callback ref.
    node !== null && !isElement(node)) {
      position.refs.setReference(node);
    }
  }, [position.refs]);
  const refs = reactExports.useMemo(() => ({
    ...position.refs,
    setReference,
    setPositionReference,
    domReference: domReferenceRef
  }), [position.refs, setReference, setPositionReference]);
  const elements = reactExports.useMemo(() => ({
    ...position.elements,
    domReference
  }), [position.elements, domReference]);
  const onOpenChange = useEvent(unstable_onOpenChange);
  const context = reactExports.useMemo(() => ({
    ...position,
    refs,
    elements,
    dataRef,
    nodeId,
    floatingId,
    events,
    open,
    onOpenChange
  }), [position, nodeId, floatingId, events, open, onOpenChange, refs, elements]);
  index(() => {
    const node = tree == null ? void 0 : tree.nodesRef.current.find((node2) => node2.id === nodeId);
    if (node) {
      node.context = context;
    }
  });
  return reactExports.useMemo(() => ({
    ...position,
    context,
    refs,
    elements,
    reference: setReference,
    positionReference: setPositionReference
  }), [position, refs, elements, context, setReference, setPositionReference]);
}
function mergeProps(userProps, propsList, elementKey) {
  const map = /* @__PURE__ */ new Map();
  return {
    ...elementKey === "floating" && {
      tabIndex: -1
    },
    ...userProps,
    ...propsList.map((value) => value ? value[elementKey] : null).concat(userProps).reduce((acc, props) => {
      if (!props) {
        return acc;
      }
      Object.entries(props).forEach((_ref) => {
        let [key, value] = _ref;
        if (key.indexOf("on") === 0) {
          if (!map.has(key)) {
            map.set(key, []);
          }
          if (typeof value === "function") {
            var _map$get;
            (_map$get = map.get(key)) == null ? void 0 : _map$get.push(value);
            acc[key] = function() {
              var _map$get2;
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }
              (_map$get2 = map.get(key)) == null ? void 0 : _map$get2.forEach((fn) => fn(...args));
            };
          }
        } else {
          acc[key] = value;
        }
      });
      return acc;
    }, {})
  };
}
const useInteractions = function(propsList) {
  if (propsList === void 0) {
    propsList = [];
  }
  const deps = propsList;
  const getReferenceProps = reactExports.useCallback(
    (userProps) => mergeProps(userProps, propsList, "reference"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
  const getFloatingProps = reactExports.useCallback(
    (userProps) => mergeProps(userProps, propsList, "floating"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
  const getItemProps = reactExports.useCallback(
    (userProps) => mergeProps(userProps, propsList, "item"),
    // Granularly check for `item` changes, because the `getItemProps` getter
    // should be as referentially stable as possible since it may be passed as
    // a prop to many components. All `item` key values must therefore be
    // memoized.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    propsList.map((key) => key == null ? void 0 : key.item)
  );
  return reactExports.useMemo(() => ({
    getReferenceProps,
    getFloatingProps,
    getItemProps
  }), [getReferenceProps, getFloatingProps, getItemProps]);
};
const legendTitle = "_legendTitle_sgaz8_1";
const grid = "_grid_sgaz8_6";
const cell = "_cell_sgaz8_11";
const colorCell = "_colorCell_sgaz8_17";
const yStepsCell = "_yStepsCell_sgaz8_26";
const xStepsCell = "_xStepsCell_sgaz8_45";
const xStepsCellNoLabel = "_xStepsCellNoLabel_sgaz8_46";
const arrowX = "_arrowX_sgaz8_70";
const arrowY = "_arrowY_sgaz8_71";
const axisLabelX = "_axisLabelX_sgaz8_88";
const axisLabelY = "_axisLabelY_sgaz8_89";
const arrowHeadX = "_arrowHeadX_sgaz8_107";
const arrowHeadY = "_arrowHeadY_sgaz8_108";
const arrowHeadY_angle0 = "_arrowHeadY_angle0_sgaz8_123";
const styles = {
  legendTitle,
  grid,
  cell,
  colorCell,
  yStepsCell,
  xStepsCell,
  xStepsCellNoLabel,
  arrowX,
  arrowY,
  axisLabelX,
  axisLabelY,
  arrowHeadX,
  arrowHeadY,
  arrowHeadY_angle0
};
function createTreads() {
  const treads = {};
  return {
    increment: (treadId) => {
      if (typeof treads[treadId] === "number") {
        treads[treadId] += 1;
      } else {
        treads[treadId] = 0;
      }
      return treads[treadId];
    }
  };
}
function fillTemplate(template, data) {
  const order2 = [];
  const treads = createTreads();
  template.forEach((row, y2) => {
    row.split(" ").forEach((cell2, x2) => {
      const position = treads.increment(cell2);
      const dataCell = data[cell2] && data[cell2][position];
      if (dataCell) {
        order2.push({ ...dataCell, _position: { x: x2, y: y2 } });
      }
    });
  });
  return order2;
}
function safeReverse(arr) {
  return [...arr].reverse();
}
const getCellPositionStyle = (col, row) => ({
  gridColumn: `${col + 1} / ${col + 2}`,
  gridRow: `${row + 1} / ${row + 2}`
});
const ArrowHead = ({ className, type }) => jsxRuntimeExports.jsx("div", { className, children: type === "horizontal" ? jsxRuntimeExports.jsx("svg", { width: "6", height: "12", viewBox: "0 0 6 12", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsxRuntimeExports.jsx("path", { d: "M6,6L0,0l0,2.4L3.6,6L0,9.6L0,12L6,6z", fill: "currentColor" }) }) : jsxRuntimeExports.jsx("svg", { width: "12", height: "6", viewBox: "0 0 12 6", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: jsxRuntimeExports.jsx("path", { d: "M6,0L0,6l2.4,0L6,2.4L9.6,6L12,6L6,0z", fill: "currentColor" }) }) });
function Legend({ cells: cells2, size, axis: axis2, title, showAxisLabels = false, showSteps = true, showArrowHeads = true, onCellPointerOver, onCellPointerLeave, renderXAxisLabel, renderYAxisLabel }) {
  const TEMPLATE = reactExports.useMemo(() => [
    `y ${new Array(size + 1).fill(".").join(" ")}`,
    ...new Array(size).fill(`y ${new Array(size).fill("c").join(" ")} .`),
    `. ${new Array(size + 1).fill("x").join(" ")}`
  ], [size]);
  const gridCells = fillTemplate(TEMPLATE, {
    x: showSteps ? axis2.x.steps.map((step) => ({
      label: step.label || step.value.toFixed(1),
      className: styles.xStepsCell
    })) : axis2.x.steps.map((step) => ({
      label: "",
      className: styles.xStepsCellNoLabel
    })),
    y: showSteps ? safeReverse(axis2.y.steps).map((step) => ({
      label: step.label || step.value.toFixed(1),
      className: styles.yStepsCell
    })) : safeReverse(axis2.y.steps).map((step) => ({
      label: "",
      className: styles.yStepsCellNoLabel
    })),
    c: cells2.map((cell2, i2) => ({
      label: jsxRuntimeExports.jsx("span", { children: cell2.label }),
      className: clsx(styles.cell, styles.colorCell),
      style: { backgroundColor: cell2.color },
      ...onCellPointerOver && { onPointerOver: (e) => onCellPointerOver(e, cell2, i2) },
      ...onCellPointerLeave && { onPointerLeave: (e) => onCellPointerLeave(e, cell2, i2) }
    }))
  });
  const xAxisLabel = () => renderXAxisLabel ? renderXAxisLabel(axis2.x, styles.axisLabelX) : jsxRuntimeExports.jsx("div", { className: styles.axisLabelX, children: axis2.x.label });
  const yAxisLabel = () => renderYAxisLabel ? renderYAxisLabel(axis2.y, styles.axisLabelY) : jsxRuntimeExports.jsx("div", { className: styles.axisLabelY, children: axis2.y.label });
  return jsxRuntimeExports.jsxs("div", { children: [title && jsxRuntimeExports.jsx("div", { className: styles.legendTitle, children: title }), jsxRuntimeExports.jsxs("div", { className: styles.grid, style: {
    gridTemplateColumns: `repeat(${size + 2}, auto)`,
    gridTemplateRows: `repeat(${size + 2}, auto)`
  }, children: [showAxisLabels && axis2.x.label ? xAxisLabel() : null, showAxisLabels && axis2.y.label ? yAxisLabel() : null, jsxRuntimeExports.jsx("div", { className: styles.arrowX, children: showArrowHeads && jsxRuntimeExports.jsx(ArrowHead, { type: "horizontal", className: styles.arrowHeadX }) }), jsxRuntimeExports.jsx("div", { className: styles.arrowY, children: showArrowHeads && jsxRuntimeExports.jsx(ArrowHead, { type: "vertical", className: clsx({ [styles.arrowHeadY]: true, [styles.arrowHeadY_angle0]: !showAxisLabels }) }) }), gridCells.map((cell2) => jsxRuntimeExports.jsx("div", { style: Object.assign(getCellPositionStyle(cell2._position.x, cell2._position.y), cell2.style), className: clsx(cell2.className, styles.cell), onPointerOver: cell2.onPointerOver, onPointerLeave: cell2.onPointerLeave, children: cell2.label }, `${cell2._position.x}|${cell2._position.y}`))] })] });
}
const PaymentPlanCardFooter = reactExports.memo(function PaymentPlanCardFooter2({
  planConfig,
  isUserAuthorized,
  currentSubscription,
  billingOption
}) {
  if (billingOption == null ? void 0 : billingOption.pricePerYear) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "caption", children: TranslationService.t("subscription.price_summary", {
      pricePerYear: billingOption.pricePerYear.toLocaleString("en-US")
    }) });
  }
  return null;
});
const priceWrap = "_priceWrap_11z70_1";
const dollarSign = "_dollarSign_11z70_7";
const amount = "_amount_11z70_15";
const perMonth$1 = "_perMonth_11z70_21";
const s$a = {
  priceWrap,
  dollarSign,
  amount,
  perMonth: perMonth$1
};
function Price({ amount: amount2, className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: clsx(s$a.priceWrap, className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$a.dollarSign, children: "$" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$a.amount, children: amount2.toLocaleString("en-US") }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: s$a.perMonth, children: [
      TranslationService.t("currency.usd"),
      " / mo*"
    ] })
  ] });
}
const planCard = "_planCard_q8sg6_1";
const custom = "_custom_q8sg6_32";
const premium = "_premium_q8sg6_40";
const planType = "_planType_q8sg6_68";
const initialPrice = "_initialPrice_q8sg6_88";
const price = "_price_q8sg6_94";
const hidden = "_hidden_q8sg6_98";
const perMonth = "_perMonth_q8sg6_102";
const customPlanName = "_customPlanName_q8sg6_108";
const planDescription = "_planDescription_q8sg6_115";
const buttonWrapper = "_buttonWrapper_q8sg6_124";
const subscribeButtonsWrapper = "_subscribeButtonsWrapper_q8sg6_136";
const cancelButton = "_cancelButton_q8sg6_150";
const footerWrapper = "_footerWrapper_q8sg6_155";
const linkAsButton = "_linkAsButton_q8sg6_166";
const paymentPlanButton = "_paymentPlanButton_q8sg6_191";
const s$9 = {
  planCard,
  custom,
  premium,
  planType,
  initialPrice,
  price,
  hidden,
  perMonth,
  customPlanName,
  planDescription,
  buttonWrapper,
  subscribeButtonsWrapper,
  cancelButton,
  footerWrapper,
  linkAsButton,
  paymentPlanButton
};
const pricingWrap = "_pricingWrap_wgpmi_1";
const pricingPlans = "_pricingPlans_wgpmi_7";
const togglerSwitch = "_togglerSwitch_wgpmi_14";
const withOffLabel = "_withOffLabel_wgpmi_20";
const togglerLabel = "_togglerLabel_wgpmi_25";
const active$1 = "_active_wgpmi_31";
const note = "_note_wgpmi_36";
const plans = "_plans_wgpmi_46";
const ss = {
  pricingWrap,
  pricingPlans,
  togglerSwitch,
  withOffLabel,
  togglerLabel,
  active: active$1,
  note,
  plans
};
const config$1 = {
  billingMethodsDetails: [
    {
      id: "paypal",
      clientId: "AWJQJnM0O2nDEUgmMe9827bk73hjJdo3f4tPK9vwKvBVwFnDk1UGzk_Y2yeh5huiStwwdJVRmdOYWmhv"
    }
  ],
  billingCyclesDetails: [
    {
      id: "month",
      name: "Monthly",
      note: null
    },
    {
      id: "year",
      name: "Annually",
      note: "Save 5%"
    }
  ],
  plans: [
    {
      id: "kontur_atlas_edu",
      name: "Educational",
      style: "basic",
      billingCycles: [
        {
          id: "month",
          initialPricePerMonth: null,
          pricePerMonth: 100,
          pricePerYear: null,
          billingMethods: [
            {
              id: "paypal",
              billingPlanId: "P-8GA97186HP797325NM2B7D7Y"
            }
          ]
        },
        {
          id: "year",
          initialPricePerMonth: 100,
          pricePerMonth: 95,
          pricePerYear: 1140,
          billingMethods: [
            {
              id: "paypal",
              billingPlanId: "P-02L9453417504204DM2B7FDQ"
            }
          ]
        }
      ]
    },
    {
      id: "kontur_atlas_pro",
      name: "Professional",
      style: "premium",
      billingCycles: [
        {
          id: "month",
          initialPricePerMonth: null,
          pricePerMonth: 1e3,
          pricePerYear: null,
          billingMethods: [
            {
              id: "paypal",
              billingPlanId: "P-47286102F9496000PM2B7FXA"
            }
          ]
        },
        {
          id: "year",
          initialPricePerMonth: 1e3,
          pricePerMonth: 950,
          pricePerYear: 11400,
          billingMethods: [
            {
              id: "paypal",
              billingPlanId: "P-9TD56337G94931803M2B7GTI"
            }
          ]
        }
      ]
    },
    {
      id: "kontur_atlas_custom",
      name: "Custom",
      style: "custom"
    }
  ]
};
const _plans = "# Educational\n\nFor students, hobbyists, and anyone testing the entry-level option before upgrading\n\n###### **edu**\n\n- Multi-criteria decision analyses\n- AI analytics\n- Favorite area of interest\n- Download analyses\n\n---\n\n# Professional\n\nFor GIS data analysts and managers who work with GIS on a daily basis\n\n###### **pro**\n\n- Multi-criteria decision analyses\n- AI analytics\n- Favorite area of interest\n- Download analyses\n- Customer support\n- Custom requests\n- Upload custom indicators for analytics\n\n---\n\n# Custom\n\n# Enterprise\n\nFor GIS data analysts and managers who work with GIS on a daily basis\nContact sales, book a demo or write to us at <info@kontur.io> for custom pricing and features\n\n###### **ent**\n\n- Multiple seats\n- Custom workflows\n- Custom features\n- Custom design\n- Training and onboarding\n- Support\n";
const css = `
.premium > .${s$9.planName}::before {
  content: '★';
  font-size: larger;
  padding-right: 4px;
}

.${s$9.planName} {
  font-family: var(--font-family);
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
}

.${ss.pricingWrap} {
  & ul {
    list-style-type: none;
    padding-left: 0;
    & li::before {
      content: "✔";
      display: inline-block;
      margin-right: var(--double-unit);
      color: var(--strong-color);
    }
  }
}
`;
const Plans_fixture = {
  Plans: /* @__PURE__ */ jsxRuntimeExports.jsx(Plans, { markdown: _plans, styling: css, isUserAuthorized: false })
};
function Plans({ styling = "", markdown: markdown2 = _plans, isUserAuthorized = false }) {
  const [currentBillingCycleId] = useFixtureSelect("buttonType", {
    options: ["month", "year"]
  });
  const currentSubscription = {
    id: "1",
    billingPlanId: "1",
    billingSubscriptionId: "1"
  };
  const compiled = Ze(markdown2, {
    overrides: {
      a: MarkdownLink,
      img: MarkdownMedia
    },
    wrapper: null
  });
  console.warn(compiled);
  const structured = splitIntoSections(compiled);
  console.warn(structured);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: ss.pricingWrap, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: styling }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: ss.pricingPlans, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: ss.plans, children: config$1.plans.map((plan, index2) => {
      var _a, _b, _c;
      const planContent = structured[index2];
      const planName = (_a = planContent.shift()) == null ? void 0 : _a.props.children[0];
      const highlightsBlock = planContent.pop();
      planContent.pop();
      const isCustom = !plan.billingCycles;
      const styleClass = plan.style;
      const billingOption = (_b = plan.billingCycles) == null ? void 0 : _b.find(
        (option) => option.id === currentBillingCycleId
      );
      const actionsBlock = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: s$9.buttonWrapper, children: [
        !isUserAuthorized && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: clsx(s$9.paymentPlanButton, styleClass), children: "Sign in to subscribe" }),
        isUserAuthorized && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "[PAYPAL BUTTONS INJECTED HERE]" })
      ] });
      const priceBlock = !isCustom && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        billingOption && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: clsx(s$9.initialPrice, {
              [s$9.hidden]: billingOption.id === "month"
            }),
            children: `$${(_c = billingOption == null ? void 0 : billingOption.initialPricePerMonth) == null ? void 0 : _c.toLocaleString("en-US")} USD`
          }
        ),
        billingOption && /* @__PURE__ */ jsxRuntimeExports.jsx(Price, { className: s$9.price, amount: billingOption.pricePerMonth })
      ] });
      const footerBlock = !isCustom && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$9.footerWrapper, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        PaymentPlanCardFooter,
        {
          planConfig: plan,
          isUserAuthorized,
          currentSubscription,
          billingOption
        }
      ) });
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: clsx(s$9.planCard, styleClass), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$9.planName, children: planName }),
        priceBlock,
        planContent,
        actionsBlock,
        highlightsBlock,
        footerBlock
      ] }, plan.id);
    }) }) })
  ] });
}
const fixture1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Plans_fixture
}, Symbol.toStringTag, { value: "Module" }));
const linkWidthWrap = "_linkWidthWrap_qkwt3_1";
const truncate = "_truncate_qkwt3_3";
const tail = "_tail_qkwt3_4";
const link = "_link_qkwt3_1";
const s$8 = {
  linkWidthWrap,
  truncate,
  tail,
  link
};
const splitTail = (str, tailSize) => {
  const tail2 = str.slice(tailSize * -1);
  const body = str.slice(0, Math.max(0, str.length - tailSize));
  return [body, tail2];
};
const LinkRenderer = reactExports.memo(function(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: props.href, target: "_blank", rel: "noreferrer", onClick: stopPropagation, children: props.children });
});
function ShortLinkRenderer({
  children: linksArr,
  maxWidth = 190,
  truncateAmount = 12,
  href
}) {
  const passedLink = (linksArr == null ? void 0 : linksArr[0]) ?? href;
  const [leftPart, rightPart] = splitTail(passedLink, truncateAmount);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$8.linkWidthWrap, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$8.linkOverflowWrap, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      className: s$8.link,
      target: "_blank",
      rel: "noreferrer",
      "data-truncate": rightPart,
      href,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: s$8.truncate, style: { maxWidth: maxWidth || "unset" }, children: leftPart }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: s$8.tail, children: rightPart })
      ]
    }
  ) }) });
}
function stopPropagation(e) {
  e.stopPropagation();
}
LinkRenderer.displayName = "LinkRenderer";
const LinkRenderer_fixture = /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
  "LinkRenderer: ",
  /* @__PURE__ */ jsxRuntimeExports.jsx(LinkRenderer, { href: "https://kontur.io", children: "kontur.io" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
  "ShortLinkRenderer short:",
  /* @__PURE__ */ jsxRuntimeExports.jsx(ShortLinkRenderer, { href: "https://kontur.io", children: ["kontur.io"] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
  "ShortLinkRenderer gdacs:",
  /* @__PURE__ */ jsxRuntimeExports.jsx(ShortLinkRenderer, { href: "https://www.gdacs.org/report.aspx?eventid=1102779&episodeid=6&eventtype=FL", children: ["gdacs.org/report.aspx?eventtype=EQ&eventid=1441158"] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
  "ShortLinkRenderer long:",
  /* @__PURE__ */ jsxRuntimeExports.jsx(ShortLinkRenderer, { href: "https://disaster.ninja/active/?layers=kontur_lines%2CactiveContributors%2CeventShape%2ChotProjects_outlines%2Cpopulation_density%2Cfocused-geometry", children: [
    "https://disaster.ninja/active/?layers=kontur_lines%2CactiveContributors%2CeventShape%2ChotProjects_outlines%2Cpopulation_density%2Cfocused-geometry"
  ] })
] });
const fixture2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: LinkRenderer_fixture
}, Symbol.toStringTag, { value: "Module" }));
/**
 * @remix-run/router v1.21.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$2.apply(this, arguments);
}
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
const PopStateEventType = "popstate";
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createBrowserLocation(window2, globalHistory) {
    let {
      pathname,
      search: search2,
      hash
    } = window2.location;
    return createLocation(
      "",
      {
        pathname,
        search: search2,
        hash
      },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createBrowserHref(window2, to2) {
    return typeof to2 === "string" ? to2 : createPath(to2);
  }
  return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
function getHistoryState(location, index2) {
  return {
    usr: location.state,
    key: location.key,
    idx: index2
  };
}
function createLocation(current, to2, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location = _extends$2({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to2 === "string" ? parsePath(to2) : to2, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to2 && to2.key || key || createKey()
  });
  return location;
}
function createPath(_ref) {
  let {
    pathname = "/",
    search: search2 = "",
    hash = ""
  } = _ref;
  if (search2 && search2 !== "?") pathname += search2.charAt(0) === "?" ? search2 : "?" + search2;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path2) {
  let parsedPath = {};
  if (path2) {
    let hashIndex = path2.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path2.substr(hashIndex);
      path2 = path2.substr(0, hashIndex);
    }
    let searchIndex = path2.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path2.substr(searchIndex);
      path2 = path2.substr(0, searchIndex);
    }
    if (path2) {
      parsedPath.pathname = path2;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window: window2 = document.defaultView,
    v5Compat = false
  } = options;
  let globalHistory = window2.history;
  let action2 = Action.Pop;
  let listener = null;
  let index2 = getIndex();
  if (index2 == null) {
    index2 = 0;
    globalHistory.replaceState(_extends$2({}, globalHistory.state, {
      idx: index2
    }), "");
  }
  function getIndex() {
    let state = globalHistory.state || {
      idx: null
    };
    return state.idx;
  }
  function handlePop() {
    action2 = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index2;
    index2 = nextIndex;
    if (listener) {
      listener({
        action: action2,
        location: history.location,
        delta
      });
    }
  }
  function push(to2, state) {
    action2 = Action.Push;
    let location = createLocation(history.location, to2, state);
    index2 = getIndex() + 1;
    let historyState = getHistoryState(location, index2);
    let url = history.createHref(location);
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error2) {
      if (error2 instanceof DOMException && error2.name === "DataCloneError") {
        throw error2;
      }
      window2.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({
        action: action2,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to2, state) {
    action2 = Action.Replace;
    let location = createLocation(history.location, to2, state);
    index2 = getIndex();
    let historyState = getHistoryState(location, index2);
    let url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({
        action: action2,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to2) {
    let base = window2.location.origin !== "null" ? window2.location.origin : window2.location.href;
    let href = typeof to2 === "string" ? to2 : createPath(to2);
    href = href.replace(/ $/, "%20");
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action2;
    },
    get location() {
      return getLocation(window2, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window2.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window2.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to2) {
      return createHref(window2, to2);
    },
    createURL,
    encodeLocation(to2) {
      let url = createURL(to2);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace,
    go(n2) {
      return globalHistory.go(n2);
    }
  };
  return history;
}
var ResultType;
(function(ResultType2) {
  ResultType2["data"] = "data";
  ResultType2["deferred"] = "deferred";
  ResultType2["redirect"] = "redirect";
  ResultType2["error"] = "error";
})(ResultType || (ResultType = {}));
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
const validMutationMethodsArr = ["post", "put", "patch", "delete"];
new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
new Set(validRequestMethodsArr);
/**
 * React Router v6.28.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i2 = 1; i2 < arguments.length; i2++) {
      var source = arguments[i2];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}
const NavigationContext = /* @__PURE__ */ reactExports.createContext(null);
const LocationContext = /* @__PURE__ */ reactExports.createContext(null);
function useInRouterContext() {
  return reactExports.useContext(LocationContext) != null;
}
const alreadyWarned = {};
function warnOnce(key, message) {
  if (!alreadyWarned[message]) {
    alreadyWarned[message] = true;
    console.warn(message);
  }
}
const logDeprecation = (flag, msg, link2) => warnOnce(flag, "⚠️ React Router Future Flag Warning: " + msg + ". " + ("You can use the `" + flag + "` future flag to opt-in early. ") + ("For more information, see " + link2 + "."));
function logV6DeprecationWarnings(renderFuture, routerFuture) {
  if (!(renderFuture != null && renderFuture.v7_startTransition)) {
    logDeprecation("v7_startTransition", "React Router will begin wrapping state updates in `React.startTransition` in v7", "https://reactrouter.com/v6/upgrading/future#v7_starttransition");
  }
  if (!(renderFuture != null && renderFuture.v7_relativeSplatPath) && !routerFuture) {
    logDeprecation("v7_relativeSplatPath", "Relative route resolution within Splat routes is changing in v7", "https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath");
  }
}
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator: navigator2,
    static: staticProp = false,
    future
  } = _ref5;
  !!useInRouterContext() ? invariant(false) : void 0;
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = reactExports.useMemo(() => ({
    basename,
    navigator: navigator2,
    static: staticProp,
    future: _extends$1({
      v7_relativeSplatPath: false
    }, future)
  }), [basename, future, navigator2, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search: search2 = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = reactExports.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search: search2,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search2, hash, state, key, navigationType]);
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
    children,
    value: locationContext
  }));
}
new Promise(() => {
});
/**
 * React Router DOM v6.28.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
const REACT_ROUTER_VERSION = "6";
try {
  window.__reactRouterVersion = REACT_ROUTER_VERSION;
} catch (e) {
}
const START_TRANSITION = "startTransition";
const startTransitionImpl = React$1[START_TRANSITION];
function BrowserRouter(_ref4) {
  let {
    basename,
    children,
    future,
    window: window2
  } = _ref4;
  let historyRef = reactExports.useRef();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({
      window: window2,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = reactExports.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = reactExports.useCallback((newState) => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  reactExports.useLayoutEffect(() => history.listen(setState), [history, setState]);
  reactExports.useEffect(() => logV6DeprecationWarnings(future), [future]);
  return /* @__PURE__ */ reactExports.createElement(Router, {
    basename,
    children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future
  });
}
var DataRouterHook;
(function(DataRouterHook2) {
  DataRouterHook2["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook2["UseSubmit"] = "useSubmit";
  DataRouterHook2["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook2["UseFetcher"] = "useFetcher";
  DataRouterHook2["useViewTransitionState"] = "useViewTransitionState";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function(DataRouterStateHook2) {
  DataRouterStateHook2["UseFetcher"] = "useFetcher";
  DataRouterStateHook2["UseFetchers"] = "useFetchers";
  DataRouterStateHook2["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
var c = React.createContext(defaultStore), o = function(n2) {
  return n2();
};
function a(n2, t2) {
  return function() {
    var r2 = t2.apply(void 0, [].slice.call(arguments));
    r2 && o(function() {
      n2.dispatch(r2);
    });
  };
}
function f(n2, t2) {
  void 0 === t2 && (t2 = []);
  var r2 = React.useContext(c);
  return React.useCallback(a(r2, n2), t2.concat(r2));
}
function s$7(n2, o2, i2) {
  var f2 = n2;
  i2 = [];
  var s2 = React.useContext(c);
  i2 = i2.concat([n2, s2]);
  var l2 = React.useState(function() {
    return getState(n2, s2);
  }), v2 = l2[0], m2 = l2[1], p2 = React.useRef(v2);
  p2.current = v2 = getState(n2, s2);
  var b2 = React.useMemo(function() {
    return Object.entries(f2).reduce(function(n3, t2) {
      var r2 = t2[0], u2 = t2[1];
      return isActionCreator(u2) && (n3[r2] = a(s2, u2)), n3;
    }, {});
  }, i2);
  return React.useEffect(function() {
    return s2.subscribe(n2, function(n3) {
      return Object.is(n3, p2.current) || m2(p2.current = n3);
    });
  }, i2), React.useDebugValue(v2), [v2, b2];
}
const currentTooltipAtom = createAtom(
  {
    setCurrentTooltip: (tooltipData) => tooltipData,
    resetCurrentTooltip: () => null,
    turnOffById: (id) => id
  },
  ({ onAction }, state = null) => {
    onAction("setCurrentTooltip", (tooltipData) => state = tooltipData);
    onAction("resetCurrentTooltip", () => state = null);
    onAction("turnOffById", (id) => {
      if ((state == null ? void 0 : state.initiatorId) === id) state = null;
    });
    return state;
  },
  "[Shared state] currentTooltipAtom"
);
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n2) {
    for (var e = 1; e < arguments.length; e++) {
      var t2 = arguments[e];
      for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n2[r2] = t2[r2]);
    }
    return n2;
  }, _extends.apply(null, arguments);
}
function _objectWithoutPropertiesLoose(r2, e) {
  if (null == r2) return {};
  var t2 = {};
  for (var n2 in r2) if ({}.hasOwnProperty.call(r2, n2)) {
    if (e.includes(n2)) continue;
    t2[n2] = r2[n2];
  }
  return t2;
}
function _setPrototypeOf(t2, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t3, e2) {
    return t3.__proto__ = e2, t3;
  }, _setPrototypeOf(t2, e);
}
function _inheritsLoose(t2, o2) {
  t2.prototype = Object.create(o2.prototype), t2.prototype.constructor = t2, _setPrototypeOf(t2, o2);
}
function hasClass(element, className) {
  if (element.classList) return !!className && element.classList.contains(className);
  return (" " + (element.className.baseVal || element.className) + " ").indexOf(" " + className + " ") !== -1;
}
function addClass(element, className) {
  if (element.classList) element.classList.add(className);
  else if (!hasClass(element, className)) if (typeof element.className === "string") element.className = element.className + " " + className;
  else element.setAttribute("class", (element.className && element.className.baseVal || "") + " " + className);
}
function replaceClassName(origClass, classToRemove) {
  return origClass.replace(new RegExp("(^|\\s)" + classToRemove + "(?:\\s|$)", "g"), "$1").replace(/\s+/g, " ").replace(/^\s*|\s*$/g, "");
}
function removeClass$1(element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else if (typeof element.className === "string") {
    element.className = replaceClassName(element.className, className);
  } else {
    element.setAttribute("class", replaceClassName(element.className && element.className.baseVal || "", className));
  }
}
const config = {
  disabled: false
};
const TransitionGroupContext = React.createContext(null);
var forceReflow = function forceReflow2(node) {
  return node.scrollTop;
};
var UNMOUNTED = "unmounted";
var EXITED = "exited";
var ENTERING = "entering";
var ENTERED = "entered";
var EXITING = "exiting";
var Transition = /* @__PURE__ */ function(_React$Component) {
  _inheritsLoose(Transition2, _React$Component);
  function Transition2(props, context) {
    var _this;
    _this = _React$Component.call(this, props, context) || this;
    var parentGroup = context;
    var appear = parentGroup && !parentGroup.isMounting ? props.enter : props.appear;
    var initialStatus;
    _this.appearStatus = null;
    if (props.in) {
      if (appear) {
        initialStatus = EXITED;
        _this.appearStatus = ENTERING;
      } else {
        initialStatus = ENTERED;
      }
    } else {
      if (props.unmountOnExit || props.mountOnEnter) {
        initialStatus = UNMOUNTED;
      } else {
        initialStatus = EXITED;
      }
    }
    _this.state = {
      status: initialStatus
    };
    _this.nextCallback = null;
    return _this;
  }
  Transition2.getDerivedStateFromProps = function getDerivedStateFromProps(_ref, prevState) {
    var nextIn = _ref.in;
    if (nextIn && prevState.status === UNMOUNTED) {
      return {
        status: EXITED
      };
    }
    return null;
  };
  var _proto = Transition2.prototype;
  _proto.componentDidMount = function componentDidMount() {
    this.updateStatus(true, this.appearStatus);
  };
  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var nextStatus = null;
    if (prevProps !== this.props) {
      var status = this.state.status;
      if (this.props.in) {
        if (status !== ENTERING && status !== ENTERED) {
          nextStatus = ENTERING;
        }
      } else {
        if (status === ENTERING || status === ENTERED) {
          nextStatus = EXITING;
        }
      }
    }
    this.updateStatus(false, nextStatus);
  };
  _proto.componentWillUnmount = function componentWillUnmount() {
    this.cancelNextCallback();
  };
  _proto.getTimeouts = function getTimeouts() {
    var timeout2 = this.props.timeout;
    var exit, enter, appear;
    exit = enter = appear = timeout2;
    if (timeout2 != null && typeof timeout2 !== "number") {
      exit = timeout2.exit;
      enter = timeout2.enter;
      appear = timeout2.appear !== void 0 ? timeout2.appear : enter;
    }
    return {
      exit,
      enter,
      appear
    };
  };
  _proto.updateStatus = function updateStatus(mounting, nextStatus) {
    if (mounting === void 0) {
      mounting = false;
    }
    if (nextStatus !== null) {
      this.cancelNextCallback();
      if (nextStatus === ENTERING) {
        if (this.props.unmountOnExit || this.props.mountOnEnter) {
          var node = this.props.nodeRef ? this.props.nodeRef.current : ReactDOM.findDOMNode(this);
          if (node) forceReflow(node);
        }
        this.performEnter(mounting);
      } else {
        this.performExit();
      }
    } else if (this.props.unmountOnExit && this.state.status === EXITED) {
      this.setState({
        status: UNMOUNTED
      });
    }
  };
  _proto.performEnter = function performEnter(mounting) {
    var _this2 = this;
    var enter = this.props.enter;
    var appearing = this.context ? this.context.isMounting : mounting;
    var _ref2 = this.props.nodeRef ? [appearing] : [ReactDOM.findDOMNode(this), appearing], maybeNode = _ref2[0], maybeAppearing = _ref2[1];
    var timeouts = this.getTimeouts();
    var enterTimeout = appearing ? timeouts.appear : timeouts.enter;
    if (!mounting && !enter || config.disabled) {
      this.safeSetState({
        status: ENTERED
      }, function() {
        _this2.props.onEntered(maybeNode);
      });
      return;
    }
    this.props.onEnter(maybeNode, maybeAppearing);
    this.safeSetState({
      status: ENTERING
    }, function() {
      _this2.props.onEntering(maybeNode, maybeAppearing);
      _this2.onTransitionEnd(enterTimeout, function() {
        _this2.safeSetState({
          status: ENTERED
        }, function() {
          _this2.props.onEntered(maybeNode, maybeAppearing);
        });
      });
    });
  };
  _proto.performExit = function performExit() {
    var _this3 = this;
    var exit = this.props.exit;
    var timeouts = this.getTimeouts();
    var maybeNode = this.props.nodeRef ? void 0 : ReactDOM.findDOMNode(this);
    if (!exit || config.disabled) {
      this.safeSetState({
        status: EXITED
      }, function() {
        _this3.props.onExited(maybeNode);
      });
      return;
    }
    this.props.onExit(maybeNode);
    this.safeSetState({
      status: EXITING
    }, function() {
      _this3.props.onExiting(maybeNode);
      _this3.onTransitionEnd(timeouts.exit, function() {
        _this3.safeSetState({
          status: EXITED
        }, function() {
          _this3.props.onExited(maybeNode);
        });
      });
    });
  };
  _proto.cancelNextCallback = function cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel();
      this.nextCallback = null;
    }
  };
  _proto.safeSetState = function safeSetState(nextState, callback) {
    callback = this.setNextCallback(callback);
    this.setState(nextState, callback);
  };
  _proto.setNextCallback = function setNextCallback(callback) {
    var _this4 = this;
    var active2 = true;
    this.nextCallback = function(event2) {
      if (active2) {
        active2 = false;
        _this4.nextCallback = null;
        callback(event2);
      }
    };
    this.nextCallback.cancel = function() {
      active2 = false;
    };
    return this.nextCallback;
  };
  _proto.onTransitionEnd = function onTransitionEnd(timeout2, handler) {
    this.setNextCallback(handler);
    var node = this.props.nodeRef ? this.props.nodeRef.current : ReactDOM.findDOMNode(this);
    var doesNotHaveTimeoutOrListener = timeout2 == null && !this.props.addEndListener;
    if (!node || doesNotHaveTimeoutOrListener) {
      setTimeout(this.nextCallback, 0);
      return;
    }
    if (this.props.addEndListener) {
      var _ref3 = this.props.nodeRef ? [this.nextCallback] : [node, this.nextCallback], maybeNode = _ref3[0], maybeNextCallback = _ref3[1];
      this.props.addEndListener(maybeNode, maybeNextCallback);
    }
    if (timeout2 != null) {
      setTimeout(this.nextCallback, timeout2);
    }
  };
  _proto.render = function render() {
    var status = this.state.status;
    if (status === UNMOUNTED) {
      return null;
    }
    var _this$props = this.props, children = _this$props.children;
    _this$props.in;
    _this$props.mountOnEnter;
    _this$props.unmountOnExit;
    _this$props.appear;
    _this$props.enter;
    _this$props.exit;
    _this$props.timeout;
    _this$props.addEndListener;
    _this$props.onEnter;
    _this$props.onEntering;
    _this$props.onEntered;
    _this$props.onExit;
    _this$props.onExiting;
    _this$props.onExited;
    _this$props.nodeRef;
    var childProps = _objectWithoutPropertiesLoose(_this$props, ["children", "in", "mountOnEnter", "unmountOnExit", "appear", "enter", "exit", "timeout", "addEndListener", "onEnter", "onEntering", "onEntered", "onExit", "onExiting", "onExited", "nodeRef"]);
    return (
      // allows for nested Transitions
      /* @__PURE__ */ React.createElement(TransitionGroupContext.Provider, {
        value: null
      }, typeof children === "function" ? children(status, childProps) : React.cloneElement(React.Children.only(children), childProps))
    );
  };
  return Transition2;
}(React.Component);
Transition.contextType = TransitionGroupContext;
Transition.propTypes = {};
function noop() {
}
Transition.defaultProps = {
  in: false,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
  enter: true,
  exit: true,
  onEnter: noop,
  onEntering: noop,
  onEntered: noop,
  onExit: noop,
  onExiting: noop,
  onExited: noop
};
Transition.UNMOUNTED = UNMOUNTED;
Transition.EXITED = EXITED;
Transition.ENTERING = ENTERING;
Transition.ENTERED = ENTERED;
Transition.EXITING = EXITING;
var _addClass = function addClass$1(node, classes) {
  return node && classes && classes.split(" ").forEach(function(c2) {
    return addClass(node, c2);
  });
};
var removeClass = function removeClass2(node, classes) {
  return node && classes && classes.split(" ").forEach(function(c2) {
    return removeClass$1(node, c2);
  });
};
var CSSTransition = /* @__PURE__ */ function(_React$Component) {
  _inheritsLoose(CSSTransition2, _React$Component);
  function CSSTransition2() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.appliedClasses = {
      appear: {},
      enter: {},
      exit: {}
    };
    _this.onEnter = function(maybeNode, maybeAppearing) {
      var _this$resolveArgument = _this.resolveArguments(maybeNode, maybeAppearing), node = _this$resolveArgument[0], appearing = _this$resolveArgument[1];
      _this.removeClasses(node, "exit");
      _this.addClass(node, appearing ? "appear" : "enter", "base");
      if (_this.props.onEnter) {
        _this.props.onEnter(maybeNode, maybeAppearing);
      }
    };
    _this.onEntering = function(maybeNode, maybeAppearing) {
      var _this$resolveArgument2 = _this.resolveArguments(maybeNode, maybeAppearing), node = _this$resolveArgument2[0], appearing = _this$resolveArgument2[1];
      var type = appearing ? "appear" : "enter";
      _this.addClass(node, type, "active");
      if (_this.props.onEntering) {
        _this.props.onEntering(maybeNode, maybeAppearing);
      }
    };
    _this.onEntered = function(maybeNode, maybeAppearing) {
      var _this$resolveArgument3 = _this.resolveArguments(maybeNode, maybeAppearing), node = _this$resolveArgument3[0], appearing = _this$resolveArgument3[1];
      var type = appearing ? "appear" : "enter";
      _this.removeClasses(node, type);
      _this.addClass(node, type, "done");
      if (_this.props.onEntered) {
        _this.props.onEntered(maybeNode, maybeAppearing);
      }
    };
    _this.onExit = function(maybeNode) {
      var _this$resolveArgument4 = _this.resolveArguments(maybeNode), node = _this$resolveArgument4[0];
      _this.removeClasses(node, "appear");
      _this.removeClasses(node, "enter");
      _this.addClass(node, "exit", "base");
      if (_this.props.onExit) {
        _this.props.onExit(maybeNode);
      }
    };
    _this.onExiting = function(maybeNode) {
      var _this$resolveArgument5 = _this.resolveArguments(maybeNode), node = _this$resolveArgument5[0];
      _this.addClass(node, "exit", "active");
      if (_this.props.onExiting) {
        _this.props.onExiting(maybeNode);
      }
    };
    _this.onExited = function(maybeNode) {
      var _this$resolveArgument6 = _this.resolveArguments(maybeNode), node = _this$resolveArgument6[0];
      _this.removeClasses(node, "exit");
      _this.addClass(node, "exit", "done");
      if (_this.props.onExited) {
        _this.props.onExited(maybeNode);
      }
    };
    _this.resolveArguments = function(maybeNode, maybeAppearing) {
      return _this.props.nodeRef ? [_this.props.nodeRef.current, maybeNode] : [maybeNode, maybeAppearing];
    };
    _this.getClassNames = function(type) {
      var classNames = _this.props.classNames;
      var isStringClassNames = typeof classNames === "string";
      var prefix = isStringClassNames && classNames ? classNames + "-" : "";
      var baseClassName = isStringClassNames ? "" + prefix + type : classNames[type];
      var activeClassName = isStringClassNames ? baseClassName + "-active" : classNames[type + "Active"];
      var doneClassName = isStringClassNames ? baseClassName + "-done" : classNames[type + "Done"];
      return {
        baseClassName,
        activeClassName,
        doneClassName
      };
    };
    return _this;
  }
  var _proto = CSSTransition2.prototype;
  _proto.addClass = function addClass2(node, type, phase) {
    var className = this.getClassNames(type)[phase + "ClassName"];
    var _this$getClassNames = this.getClassNames("enter"), doneClassName = _this$getClassNames.doneClassName;
    if (type === "appear" && phase === "done" && doneClassName) {
      className += " " + doneClassName;
    }
    if (phase === "active") {
      if (node) forceReflow(node);
    }
    if (className) {
      this.appliedClasses[type][phase] = className;
      _addClass(node, className);
    }
  };
  _proto.removeClasses = function removeClasses(node, type) {
    var _this$appliedClasses$ = this.appliedClasses[type], baseClassName = _this$appliedClasses$.base, activeClassName = _this$appliedClasses$.active, doneClassName = _this$appliedClasses$.done;
    this.appliedClasses[type] = {};
    if (baseClassName) {
      removeClass(node, baseClassName);
    }
    if (activeClassName) {
      removeClass(node, activeClassName);
    }
    if (doneClassName) {
      removeClass(node, doneClassName);
    }
  };
  _proto.render = function render() {
    var _this$props = this.props;
    _this$props.classNames;
    var props = _objectWithoutPropertiesLoose(_this$props, ["classNames"]);
    return /* @__PURE__ */ React.createElement(Transition, _extends({}, props, {
      onEnter: this.onEnter,
      onEntered: this.onEntered,
      onEntering: this.onEntering,
      onExit: this.onExit,
      onExiting: this.onExiting,
      onExited: this.onExited
    }));
  };
  return CSSTransition2;
}(React.Component);
CSSTransition.defaultProps = {
  classNames: ""
};
CSSTransition.propTypes = {};
const fadeEnter = "_fadeEnter_1fjeq_1";
const fadeEnterActive = "_fadeEnterActive_1fjeq_5";
const fadeExit = "_fadeExit_1fjeq_10";
const fadeExitActive = "_fadeExitActive_1fjeq_14";
const s$6 = {
  fadeEnter,
  fadeEnterActive,
  fadeExit,
  fadeExitActive
};
const fadeClassNames = {
  enter: s$6.fadeEnter,
  enterActive: s$6.fadeEnterActive,
  exit: s$6.fadeExit,
  exitActive: s$6.fadeExitActive
};
const CSSTransitionWrapper = ({
  children,
  ...props
}) => {
  const nodeRef = reactExports.useRef(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CSSTransition, { ...props, nodeRef, children: children(nodeRef) });
};
function parseLinksAsTags(text) {
  if (!text) return "";
  let parsed = text;
  const regex = /(.?.?https|.?.?http)(:\/\/)([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/gm;
  const matchIterable = text.matchAll(regex);
  let offset2 = 0;
  [...matchIterable].forEach((matchEntity) => {
    const [match, protocol, , domain, path2] = matchEntity;
    const matchIndex = matchEntity.index ?? 0;
    const matchLength = match.length;
    if (match.startsWith("](") || match.indexOf("[http") > -1) return;
    const linkStartIndex = match.indexOf("http");
    const fullLink = match.substring(linkStartIndex);
    const beforeLink = match.substring(0, linkStartIndex);
    const noW3domain = domain.replace("www.", "");
    const mdLinkWithPrefix = `${beforeLink}[${noW3domain}${path2 ?? ""}](${fullLink})`;
    const finalText = spliceString(parsed)(
      matchIndex + offset2,
      matchLength,
      mdLinkWithPrefix
    );
    offset2 += mdLinkWithPrefix.length - matchLength;
    parsed = finalText;
  });
  return parsed;
}
function spliceString(string) {
  return function(index2, count2, add) {
    if (index2 < 0) {
      index2 += string.length;
      if (index2 < 0) index2 = 0;
    }
    return string.slice(0, index2) + (add || "") + string.slice(index2 + count2);
  };
}
const currentLocationAtom = createAtom(
  {
    set: (location) => location
  },
  ({ onAction }, state = globalThis.location) => {
    onAction("set", (location) => state = location);
    return state;
  },
  "currentLocationAtom"
);
const closeOnLocationChangeAtom = createAtom(
  {
    currentLocationAtom
  },
  ({ onChange: onChange2, schedule, getUnlistedState }) => {
    onChange2("currentLocationAtom", (curr, prev) => {
      const tooltip = getUnlistedState(currentTooltipAtom);
      if (curr.pathname !== (prev == null ? void 0 : prev.pathname) && (tooltip == null ? void 0 : tooltip.position)) {
        schedule((dispatch) => {
          dispatch(currentTooltipAtom.resetCurrentTooltip());
        });
      }
    });
  },
  "closeOnLocationChangeAtom"
);
const markdown$1 = "_markdown_4vdv7_1";
const s$5 = {
  markdown: markdown$1
};
function PopupTooltip() {
  const [tooltip, { resetCurrentTooltip }] = s$7(currentTooltipAtom);
  s$7(closeOnLocationChangeAtom);
  const closeHandler = reactExports.useCallback(
    (e) => {
      var _a;
      resetCurrentTooltip();
      (_a = tooltip == null ? void 0 : tooltip.onClose) == null ? void 0 : _a.call(tooltip, e, resetCurrentTooltip);
    },
    [resetCurrentTooltip, tooltip]
  );
  const outerClickHandler = reactExports.useCallback(
    (e) => {
      var _a;
      (_a = tooltip == null ? void 0 : tooltip.onOuterClick) == null ? void 0 : _a.call(tooltip, e, resetCurrentTooltip);
    },
    [resetCurrentTooltip, tooltip]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CSSTransitionWrapper, { in: Boolean(tooltip), timeout: 300, classNames: fadeClassNames, children: (transitionRef) => /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: tooltip && /* @__PURE__ */ jsxRuntimeExports.jsx(
    Tooltip$1,
    {
      transitionRef,
      position: tooltip.position,
      hoverBehavior: tooltip.hoverBehavior,
      getPlacement: tooltip.position.predefinedPosition,
      classes: tooltip.popupClasses,
      onClose: closeHandler,
      onOuterClick: outerClickHandler,
      children: typeof tooltip.popup === "string" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Markdown,
        {
          options: { overrides: { a: LinkRenderer } },
          className: s$5.markdown,
          children: parseLinksAsTags(tooltip.popup)
        }
      ) : tooltip.popup
    }
  ) }) });
}
const BIVARIATE_LEGEND_SIZE = 3;
const CORNER_POINTS_INDEXES = [
  0,
  BIVARIATE_LEGEND_SIZE - 1,
  BIVARIATE_LEGEND_SIZE * BIVARIATE_LEGEND_SIZE - BIVARIATE_LEGEND_SIZE,
  BIVARIATE_LEGEND_SIZE * BIVARIATE_LEGEND_SIZE - 1
];
const LOW = `↓${TranslationService.t("bivariate.legend.low")}`;
const HIGH = `↑${TranslationService.t("bivariate.legend.high")}`;
TranslationService.t("bivariate.legend.medium");
const isBottomSide = (index2) => {
  const bottomRowStartIndex = BIVARIATE_LEGEND_SIZE * BIVARIATE_LEGEND_SIZE - BIVARIATE_LEGEND_SIZE;
  return Array.from(
    Array(BIVARIATE_LEGEND_SIZE),
    (_2, i2) => bottomRowStartIndex + i2
  ).includes(index2);
};
const isLeftSide = (index2) => Array.from(Array(BIVARIATE_LEGEND_SIZE), (_2, i2) => i2 * BIVARIATE_LEGEND_SIZE).includes(
  index2
);
const PopupTooltipWrapper = reactExports.memo(
  ({
    children,
    tooltipText,
    renderTooltip,
    tooltipId,
    hoverBehavior = true,
    popupClasses
  }) => {
    const setTooltip = f(currentTooltipAtom.setCurrentTooltip);
    const resetTooltip = f(currentTooltipAtom.resetCurrentTooltip);
    const renderTextTooltip = (e) => {
      if (tooltipText) {
        setTooltip({
          popupClasses,
          popup: tooltipText,
          position: { x: e.clientX, y: e.clientY },
          onOuterClick(e2, close) {
            close();
          },
          initiatorId: tooltipId,
          hoverBehavior
        });
      }
    };
    const showTooltip = (e, ...args) => {
      if (!renderTooltip) {
        renderTextTooltip(e);
      } else {
        renderTooltip(e, setTooltip, ...args);
      }
    };
    const hideTooltip = () => {
      resetTooltip();
    };
    return children({
      showTooltip,
      hideTooltip
    });
  }
);
PopupTooltipWrapper.displayName = "PopupTooltipWrapper";
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const toCapitalizedList = (arr) => arr.map(capitalize).join(", ");
const formatSentimentDirection = (input) => Array.isArray(input) ? toCapitalizedList(input) : capitalize(input);
const tooltipRoot = "_tooltipRoot_zjmcz_1";
const tooltipRow = "_tooltipRow_zjmcz_11";
const sentimentDirection = "_sentimentDirection_zjmcz_17";
const sentimentLabel = "_sentimentLabel_zjmcz_21";
const sentimentInfo = "_sentimentInfo_zjmcz_25";
const indicator$1 = "_indicator_zjmcz_29";
const s$4 = {
  tooltipRoot,
  tooltipRow,
  sentimentDirection,
  sentimentLabel,
  sentimentInfo,
  indicator: indicator$1
};
const CornerTooltipWrapper = ({ children, hints }) => {
  const renderTooltip = (e, setTooltip, _cell, i2) => {
    if (hints && CORNER_POINTS_INDEXES.includes(i2)) {
      setTooltip({
        popup: /* @__PURE__ */ jsxRuntimeExports.jsx(BivariateLegendCornerTooltip, { cellIndex: i2, hints }),
        position: { x: e.clientX, y: e.clientY },
        hoverBehavior: true
      });
    }
  };
  return reactExports.isValidElement(children) ? /* @__PURE__ */ jsxRuntimeExports.jsx(PopupTooltipWrapper, { renderTooltip, children: ({ showTooltip, hideTooltip }) => reactExports.cloneElement(children, {
    // @ts-expect-error - react version update should fix that
    onCellPointerOver: showTooltip,
    onCellPointerLeave: hideTooltip
  }) }) : null;
};
const BivariateLegendCornerTooltip = ({
  hints,
  cellIndex
}) => {
  var _a, _b, _c, _d, _e2, _f;
  if (!hints) return null;
  const rows = [
    {
      label: (_a = hints.x) == null ? void 0 : _a.label,
      direction: (_c = (_b = hints.x) == null ? void 0 : _b.direction) == null ? void 0 : _c[isBottomSide(cellIndex) ? 0 : 1],
      indicator: isBottomSide(cellIndex) ? LOW : HIGH
    },
    {
      label: (_d = hints.y) == null ? void 0 : _d.label,
      direction: (_f = (_e2 = hints.y) == null ? void 0 : _e2.direction) == null ? void 0 : _f[isLeftSide(cellIndex) ? 0 : 1],
      indicator: isLeftSide(cellIndex) ? LOW : HIGH
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: clsx(s$4.tooltipRoot), children: rows.map(({ label, direction, indicator: indicator2 }, i2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: clsx(s$4.tooltipRow), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx(s$4.indicator), children: indicator2 }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: clsx(s$4.sentimentInfo), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: clsx(s$4.sentimentLabel), children: [
        label,
        " "
      ] }),
      direction && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: clsx(s$4.sentimentDirection), children: formatSentimentDirection(direction) })
    ] })
  ] }, i2)) });
};
const meta = {
  hints: {
    x: {
      label: "Average NDVI, JUN 2019",
      direction: [["bad"], ["good"]]
    },
    y: {
      label: "Multi-hazard exposure PDC GRVA",
      direction: [["unimportant"], ["bad", "important"]]
    }
  }
};
const axis = {
  x: {
    label: "Multi-hazard exposure PDC GRVA to 1",
    steps: [
      {
        label: "",
        value: 0
      },
      {
        label: "",
        value: 0.48
      },
      {
        label: "",
        value: 0.62
      },
      {
        label: "",
        value: 1
      }
    ],
    quality: 0.997101882904748,
    quotient: ["mhe_index", "one"]
  },
  y: {
    label: "Average NDVI, JUN 2019 to 1",
    steps: [
      {
        label: "",
        value: -1
      },
      {
        label: "",
        value: 0.3625118070036407
      },
      {
        label: "",
        value: 0.6441754083082613
      },
      {
        label: "",
        value: 1
      }
    ],
    quality: 0.9410965072118505,
    quotient: ["avg_ndvi", "one"]
  }
};
const cells = [
  {
    label: "C1",
    color: "rgba(90,200,127,0.5)"
  },
  {
    label: "C2",
    color: "rgba(179,165,130,0.5)"
  },
  {
    label: "C3",
    color: "rgba(153,153,153,0.5)"
  },
  {
    label: "B1",
    color: "rgba(169,218,122,0.5)"
  },
  {
    label: "B2",
    color: "rgba(195,163,111,0.5)"
  },
  {
    label: "B3",
    color: "rgba(204,103,116,0.5)"
  },
  {
    label: "A1",
    color: "rgba(232,232,157,0.5)"
  },
  {
    label: "A2",
    color: "rgba(216,159,88,0.5)"
  },
  {
    label: "A3",
    color: "rgba(228,26,28,0.5)"
  }
];
function BivariateLegendFixture() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(BrowserRouter, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopupTooltip, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CornerTooltipWrapper, { meta, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Legend,
      {
        showAxisLabels: true,
        size: BIVARIATE_LEGEND_SIZE,
        axis,
        cells
      }
    ) })
  ] });
}
const fixture3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BivariateLegendFixture
}, Symbol.toStringTag, { value: "Module" }));
function createContext(rootName, defaultContext) {
  const Ctx = React.createContext(defaultContext);
  function Provider(props) {
    const { children, ...context } = props;
    const value = React.useMemo(() => context, Object.values(context));
    return jsxRuntimeExports.jsx(Ctx.Provider, { value, children });
  }
  function useContext(childName) {
    const context = React.useContext(Ctx);
    if (context) {
      return context;
    }
    throw Error(`${childName} must be rendered inside of a ${rootName} component.`);
  }
  Ctx.displayName = `${rootName}Context`;
  Provider.displayName = `${rootName}Provider`;
  return [Provider, useContext];
}
const [TooltipProvider, useTooltipContext] = createContext("Tooltip");
const TooltipTrigger = reactExports.forwardRef(function TooltipTrigger2({ children, asChild = false, ...props }, propRef) {
  const { context } = useTooltipContext("Tooltip");
  const childrenRef = (children == null ? void 0 : children.ref) ?? null;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);
  reactExports.useLayoutEffect(() => {
    if (propRef) {
      context.refs.setReference(propRef == null ? void 0 : propRef.current);
    }
  }, []);
  if (propRef)
    return null;
  if (asChild && reactExports.isValidElement(children)) {
    return reactExports.cloneElement(children, context.getReferenceProps({
      ref,
      ...props,
      ...children.props
    }));
  }
  return jsxRuntimeExports.jsx("div", { ref, ...context.getReferenceProps(props), children });
});
const tooltipContent = "_tooltipContent_17m80_3";
const bigger = "_bigger_17m80_14";
const arrow = "_arrow_17m80_26";
const s$3 = {
  tooltipContent,
  bigger,
  "default": "_default_17m80_20",
  arrow
};
const TooltipContent = reactExports.forwardRef(function TooltipContent2(props, propRef) {
  const { context, arrowRef, size } = useTooltipContext("Tooltip");
  const ref = useMergeRefs([context.refs.setFloating, propRef]);
  const { children, ...rest } = props;
  return jsxRuntimeExports.jsx(FloatingPortal, { children: context.open && jsxRuntimeExports.jsxs("div", { className: clsx(s$3.tooltipContent, s$3[size ?? "default"]), ref, style: {
    position: context.strategy,
    top: context.y ?? 0,
    left: context.x ?? 0,
    visibility: context.x == null ? "hidden" : "visible"
  }, ...context.getFloatingProps(rest), children: [children, jsxRuntimeExports.jsx(FloatingArrow, { ref: arrowRef, context: context.context, className: s$3.arrow, stroke: "transparent", strokeWidth: 2, height: 8, width: 16 })] }) });
});
const ARROW_HEIGHT = 8;
function useTooltip({ initialOpen = false, placement = "bottom", offset: offsetValue = 0, open: controlledOpen, onOpenChange: setControlledOpen } = {}, arrowRef) {
  const [uncontrolledOpen, setUncontrolledOpen] = reactExports.useState(initialOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;
  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetValue + ARROW_HEIGHT),
      flip({ fallbackAxisSideDirection: "start" }),
      shift({ padding: 5 }),
      arrow$2({ element: arrowRef })
    ]
  });
  const context = data.context;
  const hover = useHover(context);
  const role = useRole(context, { role: "tooltip" });
  const interactions = useInteractions([hover, role]);
  return reactExports.useMemo(() => ({
    open,
    setOpen,
    ...interactions,
    ...data
  }), [open, setOpen, interactions, data]);
}
function Tooltip({ children, ...options }) {
  const arrowRef = reactExports.useRef(null);
  const context = useTooltip(options, arrowRef);
  return jsxRuntimeExports.jsx(TooltipProvider, { context, arrowRef, size: options.size, children });
}
const indicator = "_indicator_16fpk_1";
const indicatorCell = "_indicatorCell_16fpk_9";
const s$2 = {
  indicator,
  indicatorCell
};
const COLORS = ["#FFDF35", "#FFB800", "#FF8A00", "#FF3D00", "#EA2A00"];
const severityToText = (severity) => {
  switch (severity) {
    case "UNKNOWN":
      return TranslationService.t("event_list.severity_unknown");
    case "TERMINATION":
      return TranslationService.t("event_list.severity_termination");
    case "MINOR":
      return TranslationService.t("event_list.severity_minor");
    case "MODERATE":
      return TranslationService.t("event_list.severity_moderate");
    case "SEVERE":
      return TranslationService.t("event_list.severity_severe");
    case "EXTREME":
      return TranslationService.t("event_list.severity_extreme");
  }
};
function SeverityIndicatorGenerator({ severity }) {
  const pivot = {
    UNKNOWN: 0,
    TERMINATION: 1,
    MINOR: 2,
    MODERATE: 3,
    SEVERE: 4,
    EXTREME: 5
  }[severity];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$2.indicator, children: Array.from(new Array(5)).map((_2, i2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: s$2.indicatorCell,
        style: {
          backgroundColor: i2 < pivot ? COLORS[i2] : "var(--faint-weak)"
        }
      },
      i2
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: severityToText(severity) })
  ] });
}
const SeverityIndicator = reactExports.memo(SeverityIndicatorGenerator);
const analytics = "_analytics_mgn54_1";
const analyticsBadge = "_analyticsBadge_mgn54_8";
const s$1 = {
  analytics,
  analyticsBadge
};
const Sub = ({ children }) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: ".7em", verticalAlign: "super", lineHeight: 0 }, children });
const formatNumber = new Intl.NumberFormat().format;
function Statistic({ tooltip, value, icon }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { placement: "bottom", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: s$1.analyticsBadge, children: [
      icon && icon,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: s$1.analyticsValue, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "caption", children: value }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: tooltip })
  ] });
}
function Analytics({
  settledArea,
  affectedPeople,
  loss
}) {
  const statistics = reactExports.useMemo(() => {
    const result = [];
    if (affectedPeople === 0)
      result.push({
        tooltip: TranslationService.t("event_list.analytics.affected_people.tooltip"),
        value: TranslationService.t("event_list.analytics.affected_people.value"),
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Memo$1, {})
      });
    if (typeof affectedPeople === "number")
      result.push({
        tooltip: TranslationService.t("event_list.analytics.affected_people.tooltip"),
        value: formatNumber(affectedPeople),
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Memo$1, {})
      });
    if (typeof settledArea === "number")
      result.push({
        tooltip: TranslationService.t("event_list.analytics.settled_area_tooltip"),
        value: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          formatNumber(settledArea),
          " km",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sub, { children: "2" })
        ] }),
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Memo, {})
      });
    if (typeof loss === "number")
      result.push({
        tooltip: TranslationService.t("event_list.analytics.loss_tooltip"),
        value: `$${formatNumber(loss)} estimated loss`
      });
    return result;
  }, [settledArea, affectedPeople]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s$1.analytics, children: statistics.map((props) => /* @__PURE__ */ jsxRuntimeExports.jsx(Statistic, { ...props }, nanoid(5))) });
}
const eventCard = "_eventCard_19kvm_1";
const active = "_active_19kvm_13";
const head = "_head_19kvm_23";
const footer = "_footer_19kvm_32";
const timeInfo = "_timeInfo_19kvm_40";
const linkContainer = "_linkContainer_19kvm_45";
const markdown = "_markdown_19kvm_52";
const s = {
  eventCard,
  active,
  head,
  footer,
  timeInfo,
  linkContainer,
  markdown
};
const language = TranslationService.instance.language || "default";
const dateFormatter = new Intl.DateTimeFormat(language, {
  hour: "numeric",
  minute: "numeric",
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZoneName: "short"
}).format;
function formatTime(date) {
  return date ? dateFormatter(new Date(date)) : "";
}
function EventCard({
  event: event2,
  isActive,
  onClick,
  alternativeActionControl,
  externalUrls,
  showDescription
}) {
  const formattedUpdatedAt = reactExports.useMemo(
    () => formatTime(event2.updatedAt),
    [event2.updatedAt]
  );
  const formattedStartedAt = reactExports.useMemo(
    () => formatTime(event2.startedAt),
    [event2.startedAt]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      className: clsx(s.eventCard, { [s.active]: isActive }),
      onClick: () => onClick == null ? void 0 : onClick(event2.eventId),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: s.head, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heading, { type: "heading-05", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: event2.eventName }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityIndicator, { severity: event2.severity })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s.location, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "caption", children: event2.location }) }),
        showDescription && event2.description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s.description, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "caption", children: event2.description }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Analytics,
          {
            settledArea: event2.settledArea,
            affectedPeople: event2.affectedPopulation,
            loss: event2.loss
          }
        ),
        isActive && (externalUrls == null ? void 0 : externalUrls.length) ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: s.linkContainer, children: externalUrls.map((link2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Markdown,
          {
            options: {
              overrides: { a: ShortLinkRenderer, p: (props) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ...props }) }
            },
            className: s.markdown,
            children: parseLinksAsTags(link2)
          },
          nanoid(4)
        )) }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: s.footer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: s.timeInfo, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "caption", children: `${TranslationService.t("started")} ${formattedStartedAt}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Text, { type: "caption", children: `${TranslationService.t("updated")} ${formattedUpdatedAt}` })
          ] }),
          alternativeActionControl
        ] })
      ]
    }
  );
}
const event = {
  eventId: "085aa3fc-7f3a-42d3-9acc-db04215e20bf",
  eventName: "Earthquake",
  eventType: "EARTHQUAKE",
  description: "On 8/9/2024 10:57:37 AM, an earthquake occurred in Japan potentially affecting 39.4 million in 100km. The earthquake had Magnitude 5M, Depth:24.876km.",
  location: "Japan",
  severity: "MODERATE",
  affectedPopulation: 38777564,
  settledArea: 14975.532431108208,
  osmGaps: 0,
  startedAt: "2024-07-10T05:11:21.231Z",
  updatedAt: "2024-08-10T05:11:21.231Z",
  externalUrls: [
    "https://www.gdacs.org/report.aspx?eventtype=EQ&eventid=1441158",
    "https://www.gdacs.org/report.aspx?eventid=1441158&episodeid=1587245&eventtype=EQ"
  ],
  bbox: [138.236, 34.495, 140.446, 36.297],
  // centroid: [139.34125, 35.412],
  episodeCount: 1
};
const EventCard_fixture = {
  EventCardFixture() {
    return [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        EventCard,
        {
          event,
          externalUrls: event.externalUrls,
          isActive: true,
          showDescription: true,
          alternativeActionControl: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Alternative action control" })
        },
        1
      )
    ];
  }
};
const fixture4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: EventCard_fixture
}, Symbol.toStringTag, { value: "Module" }));
const rendererConfig = {
  "playgroundUrl": "http://127.0.0.1:5000",
  "containerQuerySelector": null
};
const fixtures = {
  "src/core/pages/PagesDocument.fixture.tsx": { module: fixture0 },
  "src/features/subscriptions/Plans.fixture.tsx": { module: fixture1 },
  "src/components/LinkRenderer/LinkRenderer.fixture.tsx": { module: fixture2 },
  "src/components/BivariateLegend/BivariateLegend.fixture.tsx": { module: fixture3 },
  "src/features/events_list/components/EventCard/EventCard.fixture.tsx": { module: fixture4 }
};
const decorators = {};
const moduleWrappers = {
  lazy: false,
  fixtures,
  decorators
};
export {
  moduleWrappers,
  rendererConfig
};
