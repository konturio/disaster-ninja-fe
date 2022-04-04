import { useAtom } from '@reatom/react';
import { editTargetAtom } from '~features/create_layer/atoms/editTarget';
import { EditFeaturesPanel } from '../EditFeaturesPanel/EditFeaturesPanel';
import { EditLayerPanel } from '../EditLayerPanel/EditLayerPanel';

export function EditFeaturesOrLayerPanel() {
  const [editTarget] = useAtom(editTargetAtom);

  switch (editTarget) {
    case 'layer':
      return <EditLayerPanel />;

    case 'features':
      return <EditFeaturesPanel />;

    default:
      return null;
  }
}
