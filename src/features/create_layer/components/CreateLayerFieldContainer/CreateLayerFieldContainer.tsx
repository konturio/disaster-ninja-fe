import s from './CreateLayerFieldContainer.module.css';
import { Atom } from '@reatom/core';
import { LayerFieldModel } from '~features/create_layer/types';
import { TrashBinIcon } from '@k2-packages/default-icons';
import { useAtom } from '@reatom/react';

interface CreateLayerFieldContainerProps {
  data: Atom<LayerFieldModel>;
}

export function CreateLayerFieldContainer( { data }: CreateLayerFieldContainerProps ) {
  const [atomState] = useAtom(data);

  return (
    <div className={s.fieldContainer}>
      <div className={s.removeBtn}>
        <TrashBinIcon />
      </div>
      <div className={s.fieldPlaceholder}></div>
      Fields Container { atomState.name }
    </div>
  );
}
