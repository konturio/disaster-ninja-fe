import { AppHeader } from '@k2-packages/ui-kit';
import AppConfig from '@config/AppConfig';
import BivariatePanel from '@components/BivariatePanel/BivariatePanel';
import ConnectedMap from '@components/ConnectedMap/ConnectedMap';
import LegendPanel from '@components/LegendPanel/LegendPanel';
import PolygonSelectionToolbox from '@components/PolygonSelectionToolbox/PolygonSelectionToolbox';
import LoadIndicator from '@components/shared/LoadIndicator/LoadIndicator';
import styles from './BivariateLayerManagerView.module.css';

const BivariateLayerManagerView = () => (
  <>
    <AppHeader title="Disater Ninja" />
    {/* <div className={styles.root}>
    <LoadIndicator />
    <ConnectedMap
      options={AppConfig.mapbox.centerPoint as any}
      style={AppConfig.mapbox.style || ''}
      accessToken={AppConfig.mapbox.accessToken || ''}
      className={styles.Map}
    />

    <BivariatePanel />
    <LegendPanel />
    <PolygonSelectionToolbox />
  </div> */}
  </>
);

export default BivariateLayerManagerView;
