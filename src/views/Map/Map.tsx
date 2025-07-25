import { Suspense, useEffect } from 'react';
import { lazily } from 'react-lazily';
import clsx from 'clsx';
import { Plus16 } from '@konturio/default-icons';
import { legendPanel } from '~features/legend_panel';
import { layersPanel } from '~features/layers_panel';
import { LayerFeaturesPanel } from '~features/layer_features_panel';
import { FullAndShortStatesPanelWidget } from '~widgets/FullAndShortStatesPanelWidget';
import { analyticsPanel } from '~features/analytics_panel';
import { advancedAnalyticsPanel } from '~features/advanced_analytics_panel';
import { IntercomBTN } from '~features/intercom/IntercomBTN';
import { ScaleControl } from '~components/ConnectedMap/ScaleControl/ScaleControl';
import { Copyrights } from '~components/Copyrights/Copyrights';
import { shortToolbar, toolbar } from '~features/toolbar';
import { panelClasses } from '~components/Panel';
import { configRepo } from '~core/config';
import { Search } from '~features/search';
import { AppFeature } from '~core/app/types';
import { PresentationLayout } from '~views/Map/Layouts/Presentation/Presentation';
import { KONTUR_DEBUG } from '~utils/debug';
import s from './Map.module.css';
import { Layout } from './Layouts/Layout';

const featureFlags = configRepo.get().features;
const presentationMode = configRepo.get().presentationMode;

const EditPanel = () => {
  const { EditFeaturesOrLayerPanel } = lazily(
    () =>
      import(
        '~features/create_layer/components/EditFeaturesOrLayerPanel/EditFeaturesOrLayerPanel'
      ),
  );
  return <EditFeaturesOrLayerPanel />;
};

const { Logo } = lazily(() => import('@konturio/ui-kit'));

const { ConnectedMap } = lazily(() => import('~components/ConnectedMap/ConnectedMap'));

const { EventList: EventListPanel } = lazily(() => import('~features/events_list'));

const { EventEpisodes } = lazily(() => import('~features/event_episodes'));

const { BreadcrumbsPanel } = lazily(
  () => import('~features/breadcrumbs/BreadcrumbsPanel'),
);

function FeaturesLoader() {
  useEffect(() => {
    import('~core/draw_tools').then(({ drawTools }) => drawTools.init());

    /* Lazy load module */
    if (featureFlags[AppFeature.CURRENT_EVENT]) {
      import('~features/current_event').then(({ initCurrentEvent }) =>
        initCurrentEvent(),
      );
    }
    if (featureFlags[AppFeature.GEOMETRY_UPLOADER]) {
      import('~features/geometry_uploader').then(({ initFileUploader }) =>
        initFileUploader(),
      );
    }
    if (featureFlags[AppFeature.MAP_RULER]) {
      import('~features/map_ruler').then(({ initMapRuler }) => initMapRuler());
    }
    if (featureFlags[AppFeature.BOUNDARY_SELECTOR]) {
      import('~features/boundary_selector').then(({ initBoundarySelector }) =>
        initBoundarySelector(),
      );
    }
    if (featureFlags[AppFeature.MCDA]) {
      import('~features/mcda').then(({ initMCDA }) => initMCDA());
    }
    if (featureFlags[AppFeature.MULTIVARIATE_ANALYSIS]) {
      import('~features/multivariate_layer').then(({ initMultivariateControl }) =>
        initMultivariateControl(),
      );
    }
    if (featureFlags[AppFeature.LAYERS_IN_AREA]) {
      import('~features/layers_in_area').then(({ initLayersInArea }) =>
        initLayersInArea(),
      );
    }
    if (featureFlags[AppFeature.FOCUSED_GEOMETRY_LAYER]) {
      import('~features/focused_geometry_layer').then(({ initFocusedGeometryLayer }) =>
        initFocusedGeometryLayer(),
      );
    }

    if (featureFlags[AppFeature.OSM_EDIT_LINK]) {
      import('~features/osm_edit_link/').then(({ initOsmEditLink }) => initOsmEditLink());
    }
    if (featureFlags[AppFeature.FOCUSED_GEOMETRY_EDITOR]) {
      import('~widgets/FocusedGeometryEditor').then(({ initFocusedGeometry }) =>
        initFocusedGeometry(),
      );
    }
    if (featureFlags[AppFeature.CREATE_LAYER]) {
      import('~features/create_layer/').then(({ initEditableLayer }) =>
        initEditableLayer(),
      );
    }
    if (featureFlags[AppFeature.LOCATE_ME]) {
      import('~features/locate_me').then(({ initLocateMe }) => {
        initLocateMe();
      });
    }
    if (featureFlags[AppFeature.LIVE_SENSOR]) {
      import('~features/live_sensor').then(({ initSensor }) => {
        initSensor();
      });
    }
    // TODO: remove user check once backend stops returning reference_area feature for unauthorized users
    if (featureFlags[AppFeature.REFERENCE_AREA] && configRepo.get().user) {
      import('~features/reference_area').then(({ initReferenceArea }) =>
        initReferenceArea(),
      );
    }
  }, []);

  return null;
}

export function MapPage() {
  return (
    <div className={clsx(s.mainView, presentationMode ? 'presentation-mode' : '')}>
      <div className={s.mapWrap}>
        <ConnectedMap className={s.Map} />
        {featureFlags[AppFeature.ADMIN_BOUNDARY_BREADCRUMBS] && (
          <Plus16 className={s.crosshair}></Plus16>
        )}
        <Suspense
          fallback={KONTUR_DEBUG ? <h2>Suspense MapPage FeaturesLoader...</h2> : null}
        >
          <FeaturesLoader />
        </Suspense>
      </div>
      <Suspense fallback={KONTUR_DEBUG ? <h2>Suspense MapPage Layout...</h2> : null}>
        {presentationMode ? (
          <PresentationLayout
            scaleAndLogo={
              <div className={clsx(s.footer, s.clickThrough)}>
                <div className={s.footerBackground}>
                  <ScaleControl />
                  <Logo height={24} palette="contrast" />
                </div>
              </div>
            }
          />
        ) : (
          <Layout
            searchBar={
              featureFlags[AppFeature.SEARCH_BAR] &&
              featureFlags[AppFeature.SEARCH_LOCATION] && (
                <Suspense fallback={null}>
                  <Search />
                </Suspense>
              )
            }
            analytics={
              <Suspense fallback={null}>
                <Analytics />
              </Suspense>
            }
            // if EVENTS_LIST is enabled, we always have default feed
            disasters={
              featureFlags[AppFeature.EVENTS_LIST] && (
                <Suspense fallback={null}>
                  <EventListPanel />
                </Suspense>
              )
            }
            layersAndLegends={
              <Suspense fallback={null}>
                <LayersAndLegends />
              </Suspense>
            }
            matrix={<></>}
            timeline={
              featureFlags[AppFeature.EPISODES_TIMELINE] && (
                <Suspense fallback={null}>
                  <EventEpisodes />
                </Suspense>
              )
            }
            breadcrumbs={
              featureFlags[AppFeature.ADMIN_BOUNDARY_BREADCRUMBS] && (
                <Suspense fallback={null}>
                  <BreadcrumbsPanel />
                </Suspense>
              )
            }
            toolbar={
              featureFlags[AppFeature.TOOLBAR] && (
                <Suspense fallback={null}>
                  <Toolbar />
                </Suspense>
              )
            }
            layerFeaturesPanel={
              featureFlags[AppFeature.LAYER_FEATURES_PANEL] && (
                <Suspense fallback={null}>
                  <LayerFeaturesPanel />
                </Suspense>
              )
            }
            footer={
              <div className={clsx(s.footer, s.clickThrough)}>
                <div className={s.footerBackground}>
                  <ScaleControl />
                  <Copyrights />
                  <Logo height={24} palette="contrast" />
                </div>
                <IntercomBTN />
              </div>
            }
            editPanel={
              featureFlags[AppFeature.CREATE_LAYER] && (
                <Suspense fallback={null}>{EditPanel()}</Suspense>
              )
            }
          />
        )}
      </Suspense>
    </div>
  );
}

const Toolbar = () => {
  const getPanelClasses = () => ({ ...panelClasses });
  return (
    <div style={{ display: 'flex' }}>
      <FullAndShortStatesPanelWidget
        fullState={toolbar()}
        shortState={shortToolbar()}
        key="toolbar"
        id="toolbar"
        panelIcon={toolbar().panelIcon}
        header={toolbar().header}
        getPanelClasses={getPanelClasses}
      />
    </div>
  );
};

const Analytics = () => {
  const isAnalyticsOn = !!featureFlags[AppFeature.ANALYTICS_PANEL];
  const isAdvancedAnalyticsPanelOn = !!featureFlags[AppFeature.ADVANCED_ANALYTICS_PANEL];
  const isLLMAnalyticsOn = !!featureFlags[AppFeature.LLM_ANALYTICS];
  const analyticsPanelState =
    isAnalyticsOn || isLLMAnalyticsOn
      ? analyticsPanel(isAnalyticsOn, isLLMAnalyticsOn)
      : null;
  const advancedAnalyticsPanelState = isAdvancedAnalyticsPanelOn
    ? advancedAnalyticsPanel()
    : null;
  const fullState = advancedAnalyticsPanelState;
  const shortState = analyticsPanelState;

  return (
    <FullAndShortStatesPanelWidget
      fullState={fullState}
      shortState={shortState}
      initialState={featureFlags[AppFeature.ANALYTICS_PANEL] ? 'short' : null}
      key="analytics"
      id="analytics"
      panelIcon={analyticsPanelState?.panelIcon}
      header={analyticsPanelState?.header}
    />
  );
};

const LayersAndLegends = () => {
  const [fullState, shortState] = [
    featureFlags[AppFeature.MAP_LAYERS_PANEL] ? layersPanel() : null,
    featureFlags[AppFeature.LEGEND_PANEL] ? legendPanel() : null,
  ];
  return (
    <FullAndShortStatesPanelWidget
      fullState={fullState}
      shortState={shortState}
      key="layers_and_legends"
      id="layers_and_legends"
    />
  );
};
