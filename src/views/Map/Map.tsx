import { Suspense, useEffect } from 'react';
import { useAtom } from '@reatom/react-v2';
import { lazily } from 'react-lazily';
import clsx from 'clsx';
import { featureFlagsAtom, FeatureFlag } from '~core/shared_state';
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
import { ToolbarPanel } from '~features/toolbar/components/ToolbarPanel/ToolbarPanel';
import s from './Map.module.css';
import { Layout } from './Layouts/Layout';
import type { ReactElement } from 'react';

let EditFeaturesOrLayerPanel: () => ReactElement | null = () => null;

const { Logo } = lazily(() => import('@konturio/ui-kit'));

const { ConnectedMap } = lazily(() => import('~components/ConnectedMap/ConnectedMap'));

const { EventList: EventListPanel } = lazily(() => import('~features/events_list'));

const { BivariatePanel } = lazily(() => import('~features/bivariate_manager/components'));

const { EventEpisodes } = lazily(() => import('~features/event_episodes'));

export function MapPage() {
  const [featureFlags] = useAtom(featureFlagsAtom);

  useEffect(() => {
    import('~core/draw_tools').then(({ drawTools }) => drawTools.init());

    /* Lazy load module */
    if (featureFlags[FeatureFlag.CURRENT_EVENT]) {
      import('~features/current_event').then(({ initCurrentEvent }) =>
        initCurrentEvent(),
      );
    }
    if (featureFlags[FeatureFlag.GEOMETRY_UPLOADER]) {
      import('~features/geometry_uploader').then(({ initFileUploader }) =>
        initFileUploader(),
      );
    }
    if (featureFlags[FeatureFlag.MAP_RULER]) {
      import('~features/map_ruler').then(({ initMapRuler }) => initMapRuler());
    }
    if (featureFlags[FeatureFlag.BOUNDARY_SELECTOR]) {
      import('~features/boundary_selector').then(({ initBoundarySelector }) =>
        initBoundarySelector(),
      );
    }
    if (featureFlags[FeatureFlag.MCDA]) {
      import('~features/mcda').then(({ initMCDA }) => initMCDA());
    }
    if (featureFlags[FeatureFlag.LAYERS_IN_AREA]) {
      import('~features/layers_in_area').then(({ initLayersInArea }) =>
        initLayersInArea(),
      );
    }
    if (featureFlags[FeatureFlag.FOCUSED_GEOMETRY_LAYER]) {
      import('~features/focused_geometry_layer').then(({ initFocusedGeometryLayer }) =>
        initFocusedGeometryLayer(),
      );
    }

    if (featureFlags[FeatureFlag.OSM_EDIT_LINK]) {
      import('~features/osm_edit_link/').then(({ initOsmEditLink }) => initOsmEditLink());
    }
    // TODO add feature flag to replace 'draw_tools' to 'focused_geometry_editor'
    if (
      featureFlags[FeatureFlag.DRAW_TOOLS] ||
      featureFlags[FeatureFlag.FOCUSED_GEOMETRY_EDITOR]
    ) {
      import('~widgets/FocusedGeometryEditor').then(({ initFocusedGeometry }) =>
        initFocusedGeometry(),
      );
    }
    if (featureFlags[FeatureFlag.CREATE_LAYER]) {
      import('~features/create_layer/').then(({ initEditableLayer }) =>
        initEditableLayer(),
      );
      EditFeaturesOrLayerPanel = lazily(
        () =>
          import(
            '~features/create_layer/components/EditFeaturesOrLayerPanel/EditFeaturesOrLayerPanel'
          ),
      ).EditFeaturesOrLayerPanel;
    }
    if (featureFlags[FeatureFlag.LOCATE_ME]) {
      import('~features/locate_me').then(({ initLocateMe }) => {
        initLocateMe();
      });
    }
    if (featureFlags[FeatureFlag.LIVE_SENSOR]) {
      import('~features/live_sensor').then(({ initSensor }) => {
        initSensor();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureFlags]);

  return (
    <div className={s.mainView}>
      <div className={s.mapWrap}>
        <Suspense fallback={null}>
          <ConnectedMap className={s.Map} />
        </Suspense>
      </div>
      {Object.keys(featureFlags).length > 0 && (
        <Layout
          analytics={<Analytics featureFlags={featureFlags} />}
          // if EVENTS_LIST is enabled, we always have default feed
          disasters={featureFlags[FeatureFlag.EVENTS_LIST] && <EventListPanel />}
          layersAndLegends={<LayersAndLegends featureFlags={featureFlags} />}
          matrix={featureFlags[FeatureFlag.BIVARIATE_MANAGER] && <BivariatePanel />}
          timeline={featureFlags[FeatureFlag.EPISODES_TIMELINE] && <EventEpisodes />}
          toolbar={featureFlags[FeatureFlag.TOOLBAR] && <Toolbar />}
          layerFeaturesPanel={
            featureFlags[FeatureFlag.LAYER_FEATURES_PANEL] && <LayerFeaturesPanel />
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
          editPanel={<EditFeaturesOrLayerPanel />}
        />
      )}
    </div>
  );
}

const Toolbar = () => {
  const getPanelClasses = () => ({ ...panelClasses, headerTitle: s.toolbarHeaderTitle });
  return (
    <ToolbarPanel
      id="toolbar"
      key="toolbar"
      fullState={toolbar()}
      shortState={shortToolbar()}
      panelIcon={toolbar().panelIcon}
      header={toolbar().header}
      getPanelClasses={getPanelClasses}
    />
  );
};

const Analytics = ({ featureFlags }: { featureFlags: Record<string, boolean> }) => {
  const analyticsPanelState = analyticsPanel();
  const advancedAnalyticsPanelState = advancedAnalyticsPanel();
  const [fullState, shortState] = [
    featureFlags[FeatureFlag.ADVANCED_ANALYTICS_PANEL]
      ? advancedAnalyticsPanelState
      : null,
    featureFlags[FeatureFlag.ANALYTICS_PANEL] ? analyticsPanelState : null,
  ];
  return (
    <FullAndShortStatesPanelWidget
      fullState={fullState}
      shortState={shortState}
      initialState={featureFlags[FeatureFlag.ANALYTICS_PANEL] ? 'short' : null}
      key="analytics"
      id="analytics"
      panelIcon={analyticsPanelState.panelIcon}
      header={analyticsPanelState.header}
    />
  );
};

const LayersAndLegends = ({
  featureFlags,
}: {
  featureFlags: Record<string, boolean>;
}) => {
  const [fullState, shortState] = [
    featureFlags[FeatureFlag.MAP_LAYERS_PANEL] ? layersPanel() : null,
    featureFlags[FeatureFlag.LEGEND_PANEL] ? legendPanel() : null,
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
