import { useCallback } from 'react';
import { useAtom } from '@reatom/react';
import { Button, Input } from '@konturio/ui-kit';
import { PointFilled24 } from '@konturio/default-icons';
import core from '~core/index';
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
            text={core.i18n.t('create_layer.layer_name')}
            description={core.i18n.t('create_layer.layer_name')}
          />
        }
      />
      <div className={s.formParam}>
        <LabelWithTooltip
          text={core.i18n.t('create_layer.marker_icon')}
          description={core.i18n.t('create_layer.marker_icon')}
        />
        <Button iconBefore={<PointFilled24 />} size="small" variant="invert-outline" />
      </div>
      <EditableLayerFieldsPlaceholder
        fieldModels={formState.fields}
        onAddField={addField}
        onRemoveField={removeField}
        onReorderFields={reorderFields}
      />
      <div className={s.buttonsContainer}>
        <Button onClick={onSave} variant="primary" size="small">
          {core.i18n.t(formState.id ? 'save' : 'create')}
        </Button>
        <Button onClick={onCancel} variant="invert-outline" size="small">
          {core.i18n.t('cancel')}
        </Button>
      </div>
    </div>
  );
}
