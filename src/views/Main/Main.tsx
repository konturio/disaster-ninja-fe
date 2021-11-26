import { useEffect, Suspense } from 'react';
import { lazily } from 'react-lazily';
import { AppHeader, Logo } from '@k2-packages/ui-kit';
import config from '~core/app_config';
import { Row } from '~components/Layout/Layout';
import s from './Main.module.css';
import { useHistory } from 'react-router';
import { BetaLabel } from '~components/BetaLabel/BetaLabel';
import { VisibleLogo } from '~components/KonturLogo/KonturLogo';

const { ConnectedMap } = lazily(
  () => import('~components/ConnectedMap/ConnectedMap'),
);
const { SideBar } = lazily(() => import('~features/side_bar'));
const { EventList } = lazily(() => import('~features/events_list'));
const { NotificationToast } = lazily(() => import('~features/toasts'));
const { Analytics } = lazily(() => import('~features/analytics_panel'));
const { Legend } = lazily(() => import('~features/legend_panel'));
const { MapLayersList } = lazily(() => import('~features/map_layers_panel'));
const { DrawToolsToolbox } = lazily(
  () =>
    import('~features/draw_tools/components/DrawToolsToolbox/DrawToolsToolbox'),
);

export function MainView() {
  const history = useHistory();

  useEffect(() => {
    /* Lazy load module */
    // TODO: Add feature flag check
    import('~features/url_store').then(({ initUrlStore }) => initUrlStore());
    import('~features/current_event').then(({ initCurrentEvent }) =>
      initCurrentEvent(),
    );
    import('~features/geometry_uploader').then(({ initFileUploader }) =>
      initFileUploader(),
    );
    import('~features/map_ruler').then(({ initMapRuler }) => initMapRuler());
    import('~features/boundary_selector').then(({ initBoundarySelector }) =>
      initBoundarySelector(),
    );
    import('~features/layers_in_area').then(({ initLayersInArea }) =>
      initLayersInArea(),
    );
    import('~features/focused_geometry_layer').then(
      ({ initFocusedGeometryLayer }) => initFocusedGeometryLayer(),
    );
    import('~features/reports/').then(({ initReportsIcon }) =>
      initReportsIcon(history),
    );
    import('~features/bivariate_manager/').then(({ initBivariateManager }) =>
      initBivariateManager(),
    );
    // import('~features/draw_tools/').then(({ initDrawTools }) =>
    //   initDrawTools(),
    // );
  }, []);

  return (
    <>
      <AppHeader title="Disaster Ninja" logo={VisibleLogo()}>
        <Row>
          <BetaLabel />
        </Row>
      </AppHeader>
      <Row>
        <Suspense fallback={null}>
          <NotificationToast />
          <SideBar />
          <EventList />
          <Analytics />
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
              <Legend />
              <MapLayersList />
            </div>
          </Suspense>
          <DrawToolsToolbox />
        </div>
      </Row>
    </>
  );
}
