import s from './CreateLayerFieldContainer.module.css';
import { Atom } from '@reatom/core';
import { LayerFieldModel } from '~features/create_layer/types';
import { TrashBinIcon } from '@k2-packages/default-icons';

interface CreateLayerFieldContainerProps {
  data: Atom<LayerFieldModel>;
}

export function CreateLayerFieldContainer( { data }: CreateLayerFieldContainerProps ) {
  return (
    <div className={s.fieldContainer}>
      <div className={s.removeBtn}>
        <TrashBinIcon />
      </div>
      Fields Container
    </div>
  );
}
