import {
  AppHeader,
  ActionsBar,
  ActionsBarBTN,
  Logo,
} from '@k2-packages/ui-kit';
import AppConfig from '@config/AppConfig';
import BivariatePanel from '@components/BivariatePanel/BivariatePanel';
import ConnectedMap from '@components/ConnectedMap/ConnectedMap';
import LegendPanel from '@components/LegendPanel/LegendPanel';
import PolygonSelectionToolbox from '@components/PolygonSelectionToolbox/PolygonSelectionToolbox';
import LoadIndicator from '@components/shared/LoadIndicator/LoadIndicator';
import styles from './BivariateLayerManagerView.module.css';

const BivariateLayerManagerView = () => (
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
        <ActionsBarBTN>BTN</ActionsBarBTN>
      </ActionsBar>
      <div className={styles.root} style={{ flex: 1, position: 'relative' }}>
        <LoadIndicator />
        <ConnectedMap
          options={
            Object.assign(AppConfig.map.centerPoint, {
              logoPosition: 'top-right',
            }) as any
          }
          style={AppConfig.map.style || ''}
          accessToken={AppConfig.map.accessToken || ''}
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

export default BivariateLayerManagerView;
