import { Suspense, useCallback, useEffect, useState } from 'react';
import { lazily } from 'react-lazily';
import { useHistory } from 'react-router';
import clsx from 'clsx';
import { DrawToolsToolbox } from '~core/draw_tools/components/DrawToolsToolbox/DrawToolsToolbox';
import { AppFeature } from '~core/auth/types';
import { initBivariateColorManagerIcon } from '~features/bivariate_color_manager';
import { EpisodesTimelinePanel } from '~features/event_episodes/components/EpisodesTimelinePanel/EpisodesTimelinePanel';
import s from './Main.module.css';
import type { UserDataModel } from '~core/auth';
import type { MutableRefObject } from 'react';

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

type MainViewProps = {
  userModel?: UserDataModel | null;
};
export function MainView({ userModel }: MainViewProps) {
  const history = useHistory();

  useEffect(() => {
    import('~core/draw_tools').then(({ initDrawTools }) => initDrawTools());

    /* Lazy load module */
    if (userModel?.hasFeature(AppFeature.CURRENT_EVENT)) {
      import('~features/current_event').then(({ initCurrentEvent }) =>
        initCurrentEvent(),
      );
    }
    if (userModel?.hasFeature(AppFeature.GEOMETRY_UPLOADER)) {
      import('~features/geometry_uploader').then(({ initFileUploader }) =>
        initFileUploader(),
      );
    }
    if (userModel?.hasFeature(AppFeature.MAP_RULER)) {
      import('~features/map_ruler').then(({ initMapRuler }) => initMapRuler());
    }
    if (userModel?.hasFeature(AppFeature.BOUNDARY_SELECTOR)) {
      import('~features/boundary_selector').then(({ initBoundarySelector }) =>
        initBoundarySelector(),
      );
    }
    if (userModel?.hasFeature(AppFeature.LAYERS_IN_AREA)) {
      import('~features/layers_in_area').then(({ initLayersInArea }) =>
        initLayersInArea(),
      );
    }
    if (userModel?.hasFeature(AppFeature.FOCUSED_GEOMETRY_LAYER)) {
      import('~features/focused_geometry_layer').then(({ initFocusedGeometryLayer }) =>
        initFocusedGeometryLayer(),
      );
    }

    if (userModel?.hasFeature(AppFeature.BIVARIATE_COLOR_MANAGER)) {
      initBivariateColorManagerIcon(history);
    }
    if (userModel?.hasFeature(AppFeature.OSM_EDIT_LINK)) {
      import('~features/osm_edit_link/').then(({ initOsmEditLink }) => initOsmEditLink());
    }
    // TODO add feature flag to replace 'draw_tools' to 'focused_geometry_editor'
    if (
      userModel?.hasFeature(AppFeature.DRAW_TOOLS) ||
      userModel?.hasFeature(AppFeature.FOCUSED_GEOMETRY_EDITOR)
    ) {
      import('~features/focused_geometry_editor/').then(({ initFocusedGeometry }) =>
        initFocusedGeometry(),
      );
    }
    if (userModel?.hasFeature(AppFeature.CREATE_LAYER)) {
      import('~features/create_layer/').then(({ initEditableLayer }) =>
        initEditableLayer(),
      );
    }
    if (userModel?.hasFeature(AppFeature.INTERCOM)) {
      import('~features/intercom').then(({ initIntercom }) => {
        initIntercom();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userModel]);

  return (
    <div className={s.mainView}>
      <div className={s.mapWrap}>
        <Suspense fallback={null}>
          <ConnectedMap className={s.Map} />
        </Suspense>
      </div>

      <div className={s.contentWrap}>
        <div className={s.mobileColumnsOffset} />
        {/* 1st column */}

        <Suspense fallback={null}>
          <div className={s.analyticsColumn}>
            {userModel?.hasFeature(AppFeature.ANALYTICS_PANEL) && <AnalyticsPanel />}
            {userModel?.hasFeature(AppFeature.EVENTS_LIST) && userModel?.feeds && (
              <EventListPanel />
            )}
          </div>
        </Suspense>

        {/* 2nd column */}

        <Suspense fallback={null}>
          <div className={s.advancedAnalyticsColumn}>
            {userModel?.hasFeature(AppFeature.ADVANCED_ANALYTICS_PANEL) && (
              <AdvancedAnalyticsPanel />
            )}
          </div>
        </Suspense>

        {/* "Map" column */}

        <Suspense fallback={null}>
          <div className={s.mapColumn}>
            <DrawToolsToolbox />

            <div className={s.bottomMapContainer}>
              <div className={clsx(s.toolbarContainer, s.clickThrough)}>
                <Toolbar />
              </div>
              <div className={clsx(s.timelineContainer, s.clickThrough)}>
                {/* TO REMOVE <EpisodesTimelinePanel /> */}
                {userModel?.hasFeature(AppFeature.EPISODES_TIMELINE) && <EventEpisodes />}
              </div>
            </div>
          </div>
        </Suspense>

        {/* 4th column */}

        <Suspense fallback={null}>
          <div className={s.layersColumn}>
            {userModel?.hasFeature(AppFeature.LEGEND_PANEL) && <Legend />}
            {userModel?.hasFeature(AppFeature.CREATE_LAYER) && (
              <EditFeaturesOrLayerPanel />
            )}
            {userModel?.hasFeature(AppFeature.MAP_LAYERS_PANEL) && <MapLayersList />}
            {userModel?.hasFeature(AppFeature.BIVARIATE_MANAGER) && <BivariatePanel />}
            <div className={s.intercomPlaceholder}></div>
          </div>
        </Suspense>

        {/* Footer */}

        <div className={clsx(s.footer, s.clickThrough)}>
          <div className={s.logo}>
            <Logo height={24} palette={'contrast'} />
          </div>
        </div>
      </div>
    </div>
  );
}
