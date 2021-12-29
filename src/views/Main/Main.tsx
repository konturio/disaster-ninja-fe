import { Suspense, useEffect } from 'react';
import { lazily } from 'react-lazily';
import { AppHeader, Logo } from '@k2-packages/ui-kit';
import config from '~core/app_config';
import { Row } from '~components/Layout/Layout';
import s from './Main.module.css';
import { useHistory } from 'react-router';
import { BetaLabel } from '~components/BetaLabel/BetaLabel';
import { VisibleLogo } from '~components/KonturLogo/KonturLogo';
import { useAtom } from '@reatom/react';
import { userResourceAtom } from '~core/auth/atoms/UserResourceAtom';

const { ConnectedMap } = lazily(
  () => import('~components/ConnectedMap/ConnectedMap'),
);
const { SideBar } = lazily(() => import('~features/side_bar'));
const { EventList } = lazily(() => import('~features/events_list'));
const { NotificationToast } = lazily(() => import('~features/toasts'));
const { Analytics } = lazily(() => import('~features/analytics_panel'));
const { Legend } = lazily(() => import('~features/legend_panel'));
const { MapLayersList } = lazily(() => import('~features/layers_panel'));
const { BivariatePanel } = lazily(() => import('~features/bivariate_manager/components'));

const { DrawToolsToolbox } = lazily(
  () =>
    import('~features/draw_tools/components/DrawToolsToolbox/DrawToolsToolbox'),
);

export function MainView() {
  const history = useHistory();
  const [{ data: { features: userFeatures } }] = useAtom(userResourceAtom);

  useEffect(() => {
    if (!userFeatures) return;

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
    if (userFeatures?.bivariate_manager === true) {
      import('~features/bivariate_manager/').then(({ initBivariateManager }) =>
        initBivariateManager(),
      );
    }
    if (userFeatures?.draw_tools === true) {
      import('~features/draw_tools/').then(({ initDrawTools }) =>
        initDrawTools(),
      );
    }
  }, [userFeatures]);

  return (
    <>
      <AppHeader title="Disaster Ninja" logo={VisibleLogo()}>
        <Row>
          <BetaLabel />
        </Row>
      </AppHeader>
      <Row>
        <Suspense fallback={null}>
          { userFeatures?.toasts === true && <NotificationToast /> }
          { userFeatures?.side_bar === true && <SideBar /> }
          { userFeatures?.events_list === true && <EventList /> }
          { userFeatures?.analytics_panel === true && <Analytics /> }
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
              <div id='right-buttons-container' className={s.rightButtonsContainer}></div>
              { userFeatures?.legend_panel === true && <Legend iconsContainerId='right-buttons-container' />}
              { userFeatures?.map_layers_panel === true && <MapLayersList iconsContainerId='right-buttons-container' />}
              { userFeatures?.bivariate_manager === true && <BivariatePanel iconsContainerId='right-buttons-container' />}
            </div>
          </Suspense>
          { userFeatures?.draw_tools === true && <DrawToolsToolbox /> }
        </div>
      </Row>
    </>
  );
}
