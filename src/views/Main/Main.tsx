import {
  AppHeader,
  ActionsBar,
  ActionsBarBTN,
  Logo,
} from '@k2-packages/ui-kit';
import config from '~core/app_config/runtime';
import { ConnectedMap } from '~components/ConnectedMap/ConnectedMap';
import { Row } from '~components/Layout/Layout';
import PolygonSelectionToolbox from '~features/draw_tools/components/PolygonSelectionToolbox/PolygonSelectionToolbox';
import styles from './Main.module.css';
import { focusedGeometryAtom } from '~core/shared_state/focusedGeometry';
import { DisastersListPanel } from '~components/DisastersListPanel/DisastersListPanel';
import { askGeoJSONFile, UploadFileIcon } from '~features/geometry_uploader';
import { useEffect } from 'react';

/**
 * Why I use so wired way for upload file?
 * Because of webkit.
 * You can't use additional function wrapper including useCallback
 * because it's disable file upload popup.
 */
function onUploadClick() {
  askGeoJSONFile((geoJSON) =>
    focusedGeometryAtom.setFocusedGeometry.dispatch(geoJSON),
  );
}

function BivariateLayerManagerView() {
  useEffect(() => {
    /* Lazy load module */
    // TODO: Add feature flag check
    import('~features/url_store').then(({ initUrlStore }) => initUrlStore());
  }, []);

  return (
    <>
      <AppHeader title="Disaster Ninja" />
      <Row>
        <ActionsBar>
          <ActionsBarBTN onClick={onUploadClick}>
            <UploadFileIcon />
          </ActionsBarBTN>
        </ActionsBar>
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
          <PolygonSelectionToolbox />
          <div style={{ position: 'absolute', left: '8px', bottom: '8px' }}>
            <Logo height={24} palette={'contrast'} />
          </div>
        </div>
      </Row>
    </>
  );
}

export default BivariateLayerManagerView;
