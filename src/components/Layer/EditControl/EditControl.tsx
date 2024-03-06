import { Edit16 } from '@konturio/default-icons';
import { showModal } from '~core/modal';
import { MCDAForm } from '~features/mcda/components/MCDAForm';
import { store } from '~core/store/store';
import { mcdaLayerAtom } from '~features/mcda/atoms/mcdaLayer';
import { editMCDAConfig } from '~features/mcda/mcdaConfig';
import style from './EditControl.module.css';
import type {
  LogicalLayerActions,
  LogicalLayerState,
} from '~core/logical_layers/types/logicalLayer';

export function EditControl({
  startEdit,
  layerState,
  layerActions,
}: {
  startEdit: () => any;
  layerState: LogicalLayerState;
  layerActions: LogicalLayerActions;
}) {
  async function editLayer() {
    if (layerState.style?.type === 'mcda') {
      const name = layerState.id;
      const axises =
        layerState.style.config?.layers?.map((layer) => ({
          id: layer.id,
          label: layer.name,
        })) ?? [];
      const config = await editMCDAConfig(name, axises);
      if (config) {
        store.dispatch([mcdaLayerAtom.createMCDALayer({ ...config, id: layerState.id })]);
      }
    }
  }
  return (
    <div className={style.download} onClick={editLayer}>
      <Edit16 />
    </div>
  );
}
