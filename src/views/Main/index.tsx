import {
  AppHeader,
  ActionsBar,
  ActionsBarBTN,
  Logo,
} from '@k2-packages/ui-kit';
import config from '~config/runtime';
import BivariatePanel from '~components/BivariatePanel/BivariatePanel';
import ConnectedMap from '~components/ConnectedMap/ConnectedMap';
import LegendPanel from '~components/LegendPanel/LegendPanel';
import PolygonSelectionToolbox from '~components/PolygonSelectionToolbox/PolygonSelectionToolbox';
import LoadIndicator from '~components/LoadIndicator/LoadIndicator';
import styles from './style.module.css';
import store from '../../store';
import { setUploadedGeometry } from '~appModule/actions';
import { readGeoJSON } from '~utils/geoJSON/helpers';

/**
 * Why I use so wired way for upload file?
 * Because webkit suck.
 * U can't use additional function wrapper including useCallback
 * because it's disable file upload popup.
 */
function askFiles() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = false;
  input.click();
  input.onchange = async () => {
    if ('files' in input && input.files !== null) {
      const files = Array.from(input.files);
      const geoJSON = await readGeoJSON(files[0]);
      store.dispatch(setUploadedGeometry(geoJSON));
    }
  };
}

function BivariateLayerManagerView() {
  return (
    <>
      <AppHeader title="Disaster Ninja" />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexFlow: 'row nowrap',
          alignItems: 'stretch',
        }}
      >
        <ActionsBar>
          <ActionsBarBTN onClick={askFiles}>Upload</ActionsBarBTN>
        </ActionsBar>
        <div className={styles.root} style={{ flex: 1, position: 'relative' }}>
          <LoadIndicator />
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
          <BivariatePanel />
          <LegendPanel />
          <PolygonSelectionToolbox />
          <div style={{ position: 'absolute', left: '8px', bottom: '8px' }}>
            <Logo height={24} palette={'contrast'} />
          </div>
        </div>
      </div>
    </>
  );
}

export default BivariateLayerManagerView;
