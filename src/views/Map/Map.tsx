import { Suspense, useEffect } from 'react';
import { useAtom } from '@reatom/react';
import { lazily } from 'react-lazily';
import clsx from 'clsx';
import { DrawToolsToolbox } from '~core/draw_tools/components/DrawToolsToolbox/DrawToolsToolbox';
import core from '~core/index';
import { AppFeature } from '~core/app_features';
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

const { Legend } = lazily(() => import('~features/legend_panel'));

const { MapLayersList } = lazily(() => import('~features/layers_panel'));

const { Toolbar } = lazily(() => import('~features/toolbar'));

const { BivariatePanel } = lazily(() => import('~features/bivariate_manager/components'));

const { EventEpisodes } = lazily(() => import('~features/event_episodes'));

export function MapPage() {
  const [features] = useAtom(core.features.atom);

  useEffect(() => {
    import('~core/draw_tools').then(({ initDrawTools }) => initDrawTools());

    /* Lazy load module */
    if (features.has(AppFeature.CURRENT_EVENT)) {
      import('~features/current_event').then(({ initCurrentEvent }) =>
        initCurrentEvent(),
      );
    }

    if (features.has(AppFeature.GEOMETRY_UPLOADER)) {
      import('~features/geometry_uploader').then(({ initFileUploader }) =>
        initFileUploader(),
      );
    }

    if (features.has(AppFeature.MAP_RULER)) {
      import('~features/map_ruler').then(({ initMapRuler }) => initMapRuler());
    }

    if (features.has(AppFeature.BOUNDARY_SELECTOR)) {
      import('~features/boundary_selector').then(({ initBoundarySelector }) =>
        initBoundarySelector(),
      );
    }

    if (features.has(AppFeature.LAYERS_IN_AREA)) {
      import('~features/layers_in_area').then(({ initLayersInArea }) =>
        initLayersInArea(),
      );
    }

    if (features.has(AppFeature.FOCUSED_GEOMETRY_LAYER)) {
      import('~features/focused_geometry_layer').then(({ initFocusedGeometryLayer }) =>
        initFocusedGeometryLayer(),
      );
    }

    if (features.has(AppFeature.OSM_EDIT_LINK)) {
      import('~features/osm_edit_link/').then(({ initOsmEditLink }) => initOsmEditLink());
    }
    // TODO add feature flag to replace 'draw_tools' to 'focused_geometry_editor'
    if (
      features.has(AppFeature.DRAW_TOOLS) ||
      features.has(AppFeature.FOCUSED_GEOMETRY_EDITOR)
    ) {
      import('~features/focused_geometry_editor/').then(({ initFocusedGeometry }) =>
        initFocusedGeometry(),
      );
    }

    if (features.has(AppFeature.CREATE_LAYER)) {
      import('~features/create_layer/').then(({ initEditableLayer }) =>
        initEditableLayer(),
      );
    }

    if (features.has(AppFeature.LOCATE_ME)) {
      import('~features/locate_me').then(({ initLocateMe }) => {
        initLocateMe();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features]);

  return (
    <div className={s.mainView}>
      <div className={s.mapWrap}>
        <Suspense fallback={null}>
          <ConnectedMap className={s.Map} />
        </Suspense>
      </div>
      {features && (
        <Layout
          advancedAnalytics={
            features.has(AppFeature.ADVANCED_ANALYTICS_PANEL) && (
              <AdvancedAnalyticsPanel />
            )
          }
          analytics={features.has(AppFeature.ANALYTICS_PANEL) && <AnalyticsPanel />}
          disasters={features.has(AppFeature.EVENTS_LIST) && <EventListPanel />}
          layers={features.has(AppFeature.MAP_LAYERS_PANEL) && <MapLayersList />}
          legend={features.has(AppFeature.LEGEND_PANEL) && <Legend />}
          matrix={features.has(AppFeature.BIVARIATE_MANAGER) && <BivariatePanel />}
          timeline={features.has(AppFeature.EPISODES_TIMELINE) && <EventEpisodes />}
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
