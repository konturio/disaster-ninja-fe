import { Suspense, useEffect, useRef } from 'react';
import { lazily } from 'react-lazily';
import { useHistory } from 'react-router';
import { Row } from '~components/Layout/Layout';
import config from '~core/app_config';
import { DrawToolsToolbox } from '~core/draw_tools/components/DrawToolsToolbox/DrawToolsToolbox';
import { AppFeature } from '~core/auth/types';
import { lazyFeatureLoad } from '~utils/metrics/lazyFeatureLoad';
import { initializeFeature } from '~utils/metrics/initFeature';
import s from './Main.module.css';
import type { UserDataModel } from '~core/auth';

const EditFeaturesOrLayerPanel = lazyFeatureLoad(
  () => import('~features/create_layer'),
);

const { Logo } = lazily(() => import('@konturio/ui-kit'));

const { ConnectedMap } = lazily(
  () => import('~components/ConnectedMap/ConnectedMap'),
);

const SideBar = lazyFeatureLoad(() => import('~features/side_bar'));

const EventList = lazyFeatureLoad(() => import('~features/events_list'));

const AnalyticsPanel = lazyFeatureLoad(
  () => import('~features/analytics_panel'),
);

const AdvancedAnalyticsPanel = lazyFeatureLoad(
  () => import('~features/advanced_analytics_panel'),
);

const PopupTooltip = lazyFeatureLoad(() => import('~features/tooltip'));

type MainViewProps = {
  userModel?: UserDataModel | null;
};
export function MainView({ userModel }: MainViewProps) {
  const history = useHistory();
  const iconsContainerRef = useRef<HTMLDivElement | null>(null);

  const Legend = lazyFeatureLoad(() => import('~features/legend_panel'), {
    iconsContainerRef,
  });
  const MapLayersList = lazyFeatureLoad(
    () => import('~features/layers_panel'),
    { iconsContainerRef },
  );

  const BivariatePanel = lazyFeatureLoad(
    () => import('~features/bivariate_manager/components'),
    { iconsContainerRef },
  );

  useEffect(() => {
    import('~core/draw_tools').then(({ initDrawTools }) => initDrawTools());

    /* Lazy load module */
    if (userModel?.hasFeature(AppFeature.CURRENT_EVENT)) {
      initializeFeature(() => import('~features/current_event'));
    }
    if (userModel?.hasFeature(AppFeature.GEOMETRY_UPLOADER)) {
      initializeFeature(() => import('~features/geometry_uploader'));
    }
    if (userModel?.hasFeature(AppFeature.MAP_RULER)) {
      initializeFeature(() => import('~features/map_ruler'));
    }
    if (userModel?.hasFeature(AppFeature.BOUNDARY_SELECTOR)) {
      initializeFeature(() => import('~features/boundary_selector'));
    }
    if (userModel?.hasFeature(AppFeature.LAYERS_IN_AREA)) {
      initializeFeature(() => import('~features/layers_in_area'));
    }
    if (userModel?.hasFeature(AppFeature.FOCUSED_GEOMETRY_LAYER)) {
      initializeFeature(() => import('~features/focused_geometry_layer'));
    }
    if (userModel?.hasFeature(AppFeature.REPORTS)) {
      initializeFeature(() => import('~features/reports'), [history]);
    }

    if (userModel?.hasFeature(AppFeature.BIVARIATE_COLOR_MANAGER)) {
      initializeFeature(
        () => import('~features/bivariate_color_manager'),
        [history],
      );
    }
    if (userModel?.hasFeature(AppFeature.OSM_EDIT_LINK)) {
      initializeFeature(() => import('~features/osm_edit_link'));
    }
    // TODO add feature flag to replace 'draw_tools' to 'focused_geometry_editor'
    if (
      userModel?.hasFeature(AppFeature.DRAW_TOOLS) ||
      userModel?.hasFeature(AppFeature.FOCUSED_GEOMETRY_EDITOR)
    ) {
      initializeFeature(() => import('~features/focused_geometry_editor'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userModel]);

  return (
    <>
      <Suspense fallback={null}>
        {userModel?.hasFeature(AppFeature.TOOLTIP) && <PopupTooltip />}
      </Suspense>
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
              {userModel?.hasFeature(AppFeature.LEGEND_PANEL) && <Legend />}
              {userModel?.hasFeature(AppFeature.CREATE_LAYER) && (
                <EditFeaturesOrLayerPanel />
              )}
              {userModel?.hasFeature(AppFeature.MAP_LAYERS_PANEL) && (
                <MapLayersList />
              )}
              {userModel?.hasFeature(AppFeature.BIVARIATE_MANAGER) && (
                <BivariatePanel />
              )}
            </div>
          </Suspense>
          <DrawToolsToolbox />
        </div>
      </Row>
    </>
  );
}
