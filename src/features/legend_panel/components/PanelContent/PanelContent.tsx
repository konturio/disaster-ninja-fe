import { useAtom } from '@reatom/react-v2';
import { useAtom as useAtomV3 } from '@reatom/npm-react';
import { useMemo } from 'react';
import { mountedLayersAtom } from '~core/logical_layers/atoms/mountedLayers';
import { FOCUSED_GEOMETRY_LOGICAL_LAYER_ID } from '~core/focused_geometry/constants';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { referenceAreaAtom } from '~core/shared_state/referenceArea';
import { REFERENCE_AREA_LOGICAL_LAYER_ID } from '~features/reference_area/constants';
import { LegendsList } from '../LegendsList/LegendsList';
import s from './PanelContent.module.css';

export function PanelContent() {
  const [layers] = useAtom(mountedLayersAtom);
  const [focusedGeometry] = useAtom(focusedGeometryAtom);
  const [referenceAreaGeometry] = useAtomV3(referenceAreaAtom);

  const layersAtoms = useMemo(() => {
    return Array.from(layers.values()).filter((layer) => {
      if (layer.id === FOCUSED_GEOMETRY_LOGICAL_LAYER_ID) return focusedGeometry;
      if (layer.id === REFERENCE_AREA_LOGICAL_LAYER_ID) return referenceAreaGeometry;
      else return true;
    });
  }, [focusedGeometry, layers, referenceAreaGeometry]);

  return (
    <div className={s.scrollable}>
      {layersAtoms.map((layer) => (
        <LegendsList layer={layer} key={layer.id} />
      ))}
    </div>
  );
}
