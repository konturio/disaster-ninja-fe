import { useEffect, Suspense } from 'react';
import { lazily } from 'react-lazily';
import { AppHeader, Logo } from '@k2-packages/ui-kit';
import config from '~core/app_config';
import { ConnectedMap } from '~components/ConnectedMap/ConnectedMap';
import { Row } from '~components/Layout/Layout';
import styles from './Main.module.css';

const { SideBar } = lazily(() => import('~features/side_bar'));
const { EventList } = lazily(() => import('~features/events_list'));
const { NotificationToast } = lazily(() => import('~features/toasts'));

function MainView() {
  useEffect(() => {
    /* Lazy load module */
    // TODO: Add feature flag check
    import('~features/url_store').then(({ initUrlStore }) => initUrlStore());
    import('~features/geometry_uploader').then(({ initFileUploader }) =>
      initFileUploader(),
    );
    import('~features/map_ruler').then(({ initMapRuler }) => initMapRuler());
  }, []);

  return (
    <>
      <AppHeader title="Disaster Ninja" />
      <Row>
        <Suspense fallback={null}>
          <NotificationToast />
          <SideBar />
          <EventList />
        </Suspense>
        <div className={styles.root} style={{ flex: 1, position: 'relative' }}>
          <ConnectedMap
            options={{
              logoPosition: 'top-right',
            }}
            style={config.mapBaseStyle || ''}
            accessToken={config.mapAccessToken || ''}
            className={styles.Map}
          />
          <div style={{ position: 'absolute', left: '8px', bottom: '8px' }}>
            <Logo height={24} palette={'contrast'} />
          </div>
        </div>
      </Row>
    </>
  );
}

export default MainView;
