import { useAtom } from '@reatom/react-v2';
import { editTargetAtom } from '~features/create_layer/atoms/editTarget';
import { EditFeaturesPanel } from '../EditFeaturesPanel/EditFeaturesPanel';
import { EditLayerPanel } from '../EditLayerPanel/EditLayerPanel';
import { EditTargets } from '../../constants';

export function EditFeaturesOrLayerPanel() {
  const [editTarget] = useAtom(editTargetAtom);

  switch (editTarget.type) {
    case EditTargets.layer:
      return <EditLayerPanel />;

    case EditTargets.features:
      return <EditFeaturesPanel />;

    default:
      return null;
  }
}
