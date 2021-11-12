import { useEffect, Suspense } from 'react';
import { lazily } from 'react-lazily';
import { AppHeader, Logo } from '@k2-packages/ui-kit';
import config from '~core/app_config';
import { ConnectedMap } from '~components/ConnectedMap/ConnectedMap';
import { Row } from '~components/Layout/Layout';
import s from './Main.module.css';
import { MapLayersList } from '~features/map_layers_panel';
import { useHistory } from 'react-router';

const { SideBar } = lazily(() => import('~features/side_bar'));
const { EventList } = lazily(() => import('~features/events_list'));
const { NotificationToast } = lazily(() => import('~features/toasts'));
const { Analytics } = lazily(() => import('~features/analytics_panel'));

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
  }, []);

  return (
    <>
      <AppHeader title="Disaster Ninja" />
      <Row>
        <Suspense fallback={null}>
          <NotificationToast />
          <SideBar />
          <EventList />
          <Analytics />
        </Suspense>
        <div className={s.root} style={{ flex: 1, position: 'relative' }}>
          <ConnectedMap
            options={{
              logoPosition: 'top-right',
            }}
            style={config.mapBaseStyle || ''}
            accessToken={config.mapAccessToken || ''}
            className={s.Map}
          />
          <div className={s.logo}>
            <Logo height={24} palette={'contrast'} />
          </div>
          <Suspense fallback={null}>
            <div className={s.floating}>
              <MapLayersList />
            </div>
          </Suspense>
        </div>
      </Row>
    </>
  );
}
