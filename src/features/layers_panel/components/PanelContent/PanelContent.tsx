import { LayersTree } from '../LayersTree/LayersTree';
import s from './PanelContent.module.css';

export function PanelContent() {
  return (
    <div className={s.scrollable}>
      <LayersTree />
    </div>
  );
}
