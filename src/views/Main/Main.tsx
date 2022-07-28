import { Suspense, useEffect, useRef } from 'react';
import { lazily } from 'react-lazily';
import { useHistory } from 'react-router';
import { Row } from '~components/Layout/Layout';
import config from '~core/app_config';
import { DrawToolsToolbox } from '~core/draw_tools/components/DrawToolsToolbox/DrawToolsToolbox';
import { AppFeature } from '~core/auth/types';
import { initBivariateColorManagerIcon } from '~features/bivariate_color_manager';
import { initReportsIcon } from '~features/reports';
import s from './Main.module.css';
import type { UserDataModel } from '~core/auth';

const { EditFeaturesOrLayerPanel } = lazily(
  () =>
    import(
      '~features/create_layer/components/EditFeaturesOrLayerPanel/EditFeaturesOrLayerPanel'
    ),
);

const { Logo } = lazily(() => import('@konturio/ui-kit'));

const { ConnectedMap } = lazily(
  () => import('~components/ConnectedMap/ConnectedMap'),
);

const { SideBar } = lazily(() => import('~features/side_bar'));

const { EventList } = lazily(() => import('~features/events_list'));

const { AnalyticsPanel } = lazily(() => import('~features/analytics_panel'));

const { AdvancedAnalyticsPanel } = lazily(
  () => import('~features/advanced_analytics_panel'),
);

const { Legend } = lazily(() => import('~features/legend_panel'));

const { MapLayersList } = lazily(() => import('~features/layers_panel'));

const { BivariatePanel } = lazily(
  () => import('~features/bivariate_manager/components'),
);

type MainViewProps = {
  userModel?: UserDataModel | null;
};
export function MainView({ userModel }: MainViewProps) {
  const history = useHistory();
  const iconsContainerRef = useRef<HTMLDivElement | null>(null);

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
      import('~features/focused_geometry_layer').then(
        ({ initFocusedGeometryLayer }) => initFocusedGeometryLayer(),
      );
    }
    if (userModel?.hasFeature(AppFeature.REPORTS)) {
      initReportsIcon(history);
    }

    if (userModel?.hasFeature(AppFeature.BIVARIATE_COLOR_MANAGER)) {
      initBivariateColorManagerIcon(history);
    }
    if (userModel?.hasFeature(AppFeature.OSM_EDIT_LINK)) {
      import('~features/osm_edit_link/').then(({ initOsmEditLink }) =>
        initOsmEditLink(),
      );
    }
    // TODO add feature flag to replace 'draw_tools' to 'focused_geometry_editor'
    if (
      userModel?.hasFeature(AppFeature.DRAW_TOOLS) ||
      userModel?.hasFeature(AppFeature.FOCUSED_GEOMETRY_EDITOR)
    ) {
      import('~features/focused_geometry_editor/').then(
        ({ initFocusedGeometry }) => initFocusedGeometry(),
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
    <>
      <Row>
        <Suspense fallback={null}>
          {userModel?.hasFeature(AppFeature.SIDE_BAR) && <SideBar />}
          {userModel?.hasFeature(AppFeature.EVENTS_LIST) &&
            userModel?.feeds && <EventList />}
          {userModel?.hasFeature(AppFeature.ANALYTICS_PANEL) && (
            <AnalyticsPanel />
          )}
          {userModel?.hasFeature(AppFeature.ADVANCED_ANALYTICS_PANEL) && (
            <AdvancedAnalyticsPanel />
          )}
        </Suspense>
        <div className={s.root} style={{ flex: 1, position: 'relative' }}>
          <Suspense fallback={null}>
            <ConnectedMap
              options={{
                logoPosition: 'top-right',
              }}
              style={config.mapBaseStyle || ''}
              accessToken={config.mapAccessToken || ''}
              className={s.Map}
            />
          </Suspense>
          <div className={s.logo}>
            <Logo height={24} palette={'contrast'} />
          </div>
          <Suspense fallback={null}>
            <div className={s.floating}>
              <div
                className={s.rightButtonsContainer}
                ref={iconsContainerRef}
              ></div>
              {userModel?.hasFeature(AppFeature.LEGEND_PANEL) && (
                <Legend iconsContainerRef={iconsContainerRef} />
              )}
              {userModel?.hasFeature(AppFeature.CREATE_LAYER) && (
                <EditFeaturesOrLayerPanel />
              )}
              {userModel?.hasFeature(AppFeature.MAP_LAYERS_PANEL) && (
                <MapLayersList iconsContainerRef={iconsContainerRef} />
              )}
              {userModel?.hasFeature(AppFeature.BIVARIATE_MANAGER) && (
                <BivariatePanel iconsContainerRef={iconsContainerRef} />
              )}
            </div>
          </Suspense>
          <DrawToolsToolbox />
        </div>
      </Row>
    </>
  );
}
