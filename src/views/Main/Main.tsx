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

const { UserProfile } = lazily(() => import('~features/user_profile'));

const { CreateLayerPanel } = lazily(
  () =>
    import(
      '~features/create_layer/components/CreateLayerPanel/CreateLayerPanel'
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
  const [{ data }] = useAtom(userResourceAtom);
  const userFeatures = data?.features;

  useEffect(() => {
    import('~core/draw_tools').then(({ initDrawTools }) => initDrawTools());

    /* Lazy load module */
    if (userFeatures?.url_store === true) {
      import('~features/url_store').then(({ initUrlStore }) => initUrlStore());
    }
    if (userFeatures?.current_event === true) {
      import('~features/current_event').then(({ initCurrentEvent }) =>
        initCurrentEvent(),
      );
    }
    if (userFeatures?.geometry_uploader === true) {
      import('~features/geometry_uploader').then(({ initFileUploader }) =>
        initFileUploader(),
      );
    }
    if (userFeatures?.map_ruler === true) {
      import('~features/map_ruler').then(({ initMapRuler }) => initMapRuler());
    }
    if (userFeatures?.boundary_selector === true) {
      import('~features/boundary_selector').then(({ initBoundarySelector }) =>
        initBoundarySelector(),
      );
    }
    if (userFeatures?.layers_in_area === true) {
      import('~features/layers_in_area').then(({ initLayersInArea }) =>
        initLayersInArea(),
      );
    }
    if (userFeatures?.focused_geometry_layer === true) {
      import('~features/focused_geometry_layer').then(
        ({ initFocusedGeometryLayer }) => initFocusedGeometryLayer(),
      );
    }
    if (userFeatures?.reports === true) {
      import('~features/reports/').then(({ initReportsIcon }) =>
        initReportsIcon(history),
      );
    }
    if (userFeatures?.osm_edit_link === true) {
      import('~features/osm_edit_link/').then(({ initOsmEditLink }) =>
        initOsmEditLink(),
      );
    }
    if (userFeatures?.create_layer === true) {
      import('~features/create_layer/').then(({ initCreateLayer }) =>
        initCreateLayer(),
      );
    }
    // TODO add feature flag to replace 'draw_tools' to 'focused_geometry_editor'
    if (userFeatures?.draw_tools || userFeatures?.focused_geometry_editor) {
      import('~features/focused_geometry_editor/').then(
        ({ initFreehandGeometry }) => initFreehandGeometry(),
      );
    }
    if (userFeatures?.create_layer === true) {
      import('~features/create_layer/').then(({ initCreateLayer }) =>
        initCreateLayer(),
      );
    }
    if (userFeatures?.intercom === true) {
      import('~features/intercom').then(({ initIntercom }) => {
        initIntercom();
      });
    }
  }, [userFeatures]);

  return (
    <>
      <Suspense fallback={null}>
        {userFeatures?.tooltip === true && <PopupTooltip />}
      </Suspense>
      <Suspense fallback={null}>
        {userFeatures?.header && (
          <AppHeader
            title="Disaster Ninja"
            logo={VisibleLogo()}
            afterChatContent={
              userFeatures?.app_login === true ? <UserProfile /> : undefined
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
          {userFeatures?.toasts === true && <NotificationToast />}
          {userFeatures?.side_bar === true && <SideBar />}
          {userFeatures?.events_list === true && data?.feeds && <EventList />}
          {userFeatures?.analytics_panel === true && <Analytics />}
          {userFeatures?.advanced_analytics_panel === true && (
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
              {userFeatures?.legend_panel === true && (
                <Legend iconsContainerId="right-buttons-container" />
              )}
              {userFeatures?.create_layer === true && <CreateLayerPanel />}
              {userFeatures?.map_layers_panel === true && (
                <MapLayersList iconsContainerId="right-buttons-container" />
              )}
              {userFeatures?.bivariate_manager === true && (
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
