import { AppHeader, Logo } from '@k2-packages/ui-kit';
import config from '~core/app_config/runtime';
import { ConnectedMap } from '~components/ConnectedMap/ConnectedMap';
import { Row } from '~components/Layout/Layout';
import styles from './Main.module.css';
import { DisastersListPanel } from '~components/DisastersListPanel/DisastersListPanel';
import { useEffect } from 'react';
import { SideBar } from '~features/side_bar/components/SideBar/SideBar';

function BivariateLayerManagerView() {
  useEffect(() => {
    /* Lazy load module */
    // TODO: Add feature flag check
    import('~features/url_store').then(({ initUrlStore }) => initUrlStore());
    import('~features/geometry_uploader').then(({ initFileUploader }) =>
      initFileUploader(),
    );
  }, []);

  return (
    <>
      <AppHeader title="Disaster Ninja" />
      <Row>
        <SideBar />
        {/* <DisastersListPanel /> */}
        <div className={styles.root} style={{ flex: 1, position: 'relative' }}>
          <ConnectedMap
            options={
              Object.assign(config.map.centerPoint, {
                logoPosition: 'top-right',
              }) as any
            }
            style={config.map.style || ''}
            accessToken={config.map.accessToken || ''}
            className={styles.Map}
          />
          {/* <BivariatePanel />
          <LegendPanel /> */}
          <div style={{ position: 'absolute', left: '8px', bottom: '8px' }}>
            <Logo height={24} palette={'contrast'} />
          </div>
        </div>
      </Row>
    </>
  );
}

export default BivariateLayerManagerView;
