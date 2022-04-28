import { Suspense, useEffect } from 'react';
import { lazily } from 'react-lazily';
import config from '~core/app_config';
import { Row } from '~components/Layout/Layout';
import s from './Main.module.css';
import { useHistory } from 'react-router';
import { BetaLabel } from '~components/BetaLabel/BetaLabel';
import { useAtom } from '@reatom/react';
import { userResourceAtom } from '~core/auth/atoms/userResource';
import { VisibleLogo } from '~components/KonturLogo/KonturLogo';
import { DrawToolsToolbox } from '~core/draw_tools/components/DrawToolsToolbox/DrawToolsToolbox';
import { AppFeature } from '~core/auth/types';

const { UserProfile } = lazily(() => import('~features/user_profile'));

const { EditFeaturesOrLayerPanel } = lazily(
  () =>
    import(
      '~features/create_layer/components/EditFeaturesOrLayerPanel/EditFeaturesOrLayerPanel'
    ),
);

const { AppHeader, Logo } = lazily(() => import('@k2-packages/ui-kit'));

const { ConnectedMap } = lazily(
  () => import('~components/ConnectedMap/ConnectedMap'),
);

const { SideBar } = lazily(() => import('~features/side_bar'));

const { EventList } = lazily(() => import('~features/events_list'));

const { NotificationToast } = lazily(() => import('~features/toasts'));

const { Analytics } = lazily(() => import('~features/analytics_panel'));

const { AdvancedAnalytics } = lazily(
  () => import('~features/advanced_analytics_panel'),
);

const { Legend } = lazily(() => import('~features/legend_panel'));

const { MapLayersList } = lazily(() => import('~features/layers_panel'));

const { BivariatePanel } = lazily(
  () => import('~features/bivariate_manager/components'),
);

const { PopupTooltip } = lazily(() => import('~features/tooltip'));

export function MainView() {
  const history = useHistory();
  const [{ data: userModel }] = useAtom(userResourceAtom);

  useEffect(() => {
    import('~core/draw_tools').then(({ initDrawTools }) => initDrawTools());

    /* Lazy load module */
    if (userModel?.hasFeature(AppFeature.URL_STORE)) {
      import('~features/url_store').then(({ initUrlStore }) => initUrlStore());
    }
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
      import('~features/reports/').then(({ initReportsIcon }) =>
        initReportsIcon(history),
      );
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
  }, [userModel]);

  return (
    <>
      <Suspense fallback={null}>
        {userModel?.hasFeature(AppFeature.TOOLTIP) && <PopupTooltip />}
      </Suspense>
      <Suspense fallback={null}>
        {userModel?.hasFeature(AppFeature.HEADER) && (
          <AppHeader
            title="Disaster Ninja"
            logo={VisibleLogo()}
            afterChatContent={
              userModel?.hasFeature(AppFeature.APP_LOGIN) ? (
                <UserProfile />
              ) : undefined
            }
          >
            <Row>
              <BetaLabel />
            </Row>
          </AppHeader>
        )}
      </Suspense>
      <Row>
        <Suspense fallback={null}>
          {userModel?.hasFeature(AppFeature.TOASTS) && <NotificationToast />}
          {userModel?.hasFeature(AppFeature.SIDE_BAR) && <SideBar />}
          {userModel?.hasFeature(AppFeature.EVENTS_LIST) &&
            userModel?.feeds && <EventList />}
          {userModel?.hasFeature(AppFeature.ANALYTICS_PANEL) && <Analytics />}
          {userModel?.hasFeature(AppFeature.ADVANCED_ANALYTICS_PANEL) && (
            <AdvancedAnalytics />
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
                id="right-buttons-container"
                className={s.rightButtonsContainer}
              ></div>
              {userModel?.hasFeature(AppFeature.LEGEND_PANEL) && (
                <Legend iconsContainerId="right-buttons-container" />
              )}
              {userModel?.hasFeature(AppFeature.CREATE_LAYER) && (
                <EditFeaturesOrLayerPanel />
              )}
              {userModel?.hasFeature(AppFeature.MAP_LAYERS_PANEL) && (
                <MapLayersList iconsContainerId="right-buttons-container" />
              )}
              {userModel?.hasFeature(AppFeature.BIVARIATE_MANAGER) && (
                <BivariatePanel iconsContainerId="right-buttons-container" />
              )}
            </div>
          </Suspense>
          <DrawToolsToolbox />
        </div>
      </Row>
    </>
  );
}
