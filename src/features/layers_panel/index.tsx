import { MapLayerPanel } from './components';
import { LayersTree } from './components/LayersTree/LayersTree';
import s from './components/MapLayersPanel/MapLayersPanel.module.css';

export function MapLayersList() {
  return <MapLayerPanel />;
}

export function LayersPanelContent() {
  return (
    <div className={s.scrollable}>
      <LayersTree />
    </div>
  );
}
