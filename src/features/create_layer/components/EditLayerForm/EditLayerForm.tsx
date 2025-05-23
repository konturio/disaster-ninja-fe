import { useCallback } from 'react';
import { useAtom } from '@reatom/react-v2';
import { Button, Input } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { LabelWithTooltip } from '~components/LabelWithTooltip/LabelWithTooltip';
import { EditableLayerFieldsPlaceholder } from '../EditableLayerFieldsPlaceholder/EditableLayerFieldsPlaceholder';
import s from './EditLayerForm.module.css';
import type { LayerEditorFormAtomType } from '../../atoms/layerEditorForm';
import type { ChangeEvent } from 'react';

interface EditLayerFormFormProps {
  data: LayerEditorFormAtomType;
  onSave: () => void;
  onCancel: () => void;
}

export function EditLayerForm({ data, onSave, onCancel }: EditLayerFormFormProps) {
  const [formState, { addField, removeField, reorderFields, updateName }] = useAtom(data);

  const onNameChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      updateName(ev.target.value);
    },
    [updateName],
  );

  return (
    <div className={s.formContainer}>
      <Input
        onChange={onNameChange}
        value={formState.name}
        className={s.formInputContainer}
        renderLabel={
          <LabelWithTooltip
            text={i18n.t('create_layer.layer_name')}
            description={i18n.t('create_layer.layer_name')}
          />
        }
      />
      <EditableLayerFieldsPlaceholder
        fieldModels={formState.fields}
        onAddField={addField}
        onRemoveField={removeField}
        onReorderFields={reorderFields}
      />
      <div className={s.buttonsContainer}>
        <Button onClick={onSave} variant="primary" size="small">
          {i18n.t('create_layer.save_and_draw')}
        </Button>
        <Button onClick={onCancel} variant="invert-outline" size="small">
          {i18n.t('cancel')}
        </Button>
      </div>
    </div>
  );
}
