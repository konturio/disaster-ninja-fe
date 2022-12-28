import { Suspense, useEffect } from 'react';
import { useAtom } from '@reatom/react';
import { lazily } from 'react-lazily';
import clsx from 'clsx';
import { DrawToolsToolbox } from '~core/draw_tools/components/DrawToolsToolbox/DrawToolsToolbox';
import { featureFlagsAtom, FeatureFlag } from '~core/shared_state';
import { legendPanel } from '~features/legend_panel';
import { layersPanel } from '~features/layers_panel';
import { LayersAndLegendsWidget } from '~widgets/LayersAndLegends';
import s from './Map.module.css';
import { Layout } from './Layouts/Layout';

const { EditFeaturesOrLayerPanel } = lazily(
  () =>
    import(
      '~features/create_layer/components/EditFeaturesOrLayerPanel/EditFeaturesOrLayerPanel'
    ),
);

const { Logo } = lazily(() => import('@konturio/ui-kit'));

const { ConnectedMap } = lazily(() => import('~components/ConnectedMap/ConnectedMap'));

const { EventList: EventListPanel } = lazily(() => import('~features/events_list'));

const { AnalyticsPanel } = lazily(() => import('~features/analytics_panel'));

const { AdvancedAnalyticsPanel } = lazily(
  () => import('~features/advanced_analytics_panel'),
);

const { Toolbar } = lazily(() => import('~features/toolbar'));

const { BivariatePanel } = lazily(() => import('~features/bivariate_manager/components'));

const { EventEpisodes } = lazily(() => import('~features/event_episodes'));

export function MapPage() {
  const [featureFlags] = useAtom(featureFlagsAtom);

  useEffect(() => {
    import('~core/draw_tools').then(({ initDrawTools }) => initDrawTools());

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
      import('~features/focused_geometry_editor/').then(({ initFocusedGeometry }) =>
        initFocusedGeometry(),
      );
    }
    if (featureFlags[FeatureFlag.CREATE_LAYER]) {
      import('~features/create_layer/').then(({ initEditableLayer }) =>
        initEditableLayer(),
      );
    }
    if (featureFlags[FeatureFlag.LOCATE_ME]) {
      import('~features/locate_me').then(({ initLocateMe }) => {
        initLocateMe();
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
      {featureFlags && (
        <Layout
          advancedAnalytics={
            featureFlags[FeatureFlag.ADVANCED_ANALYTICS_PANEL] && (
              <AdvancedAnalyticsPanel />
            )
          }
          analytics={featureFlags[FeatureFlag.ANALYTICS_PANEL] && <AnalyticsPanel />}
          // if EVENTS_LIST is enabled, we always have default feed
          disasters={featureFlags[FeatureFlag.EVENTS_LIST] && <EventListPanel />}
          layersAndLegends={
            <LayersAndLegendsWidget
              layersProps={
                featureFlags[FeatureFlag.MAP_LAYERS_PANEL] ? layersPanel : null
              }
              legendProps={featureFlags[FeatureFlag.LEGEND_PANEL] ? legendPanel : null}
            />
          }
          matrix={featureFlags[FeatureFlag.BIVARIATE_MANAGER] && <BivariatePanel />}
          timeline={featureFlags[FeatureFlag.EPISODES_TIMELINE] && <EventEpisodes />}
          toolbar={<Toolbar />}
          footer={
            <div className={clsx(s.footer, s.clickThrough)}>
              <div className={s.logo}>
                <Logo height={24} palette="contrast" />
              </div>
            </div>
          }
          editPanel={<EditFeaturesOrLayerPanel />}
          drawToolbox={<DrawToolsToolbox />}
        />
      )}
    </div>
  );
}
