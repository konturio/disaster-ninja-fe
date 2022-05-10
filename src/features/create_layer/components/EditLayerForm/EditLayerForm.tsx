import { ChangeEvent, useCallback } from 'react';
import { useAtom } from '@reatom/react';
import { Button, Input } from '@k2-packages/ui-kit';
import { MarkerIcon } from '@k2-packages/default-icons';
import { translationService as i18n } from '~core/index';
import { LabelWithTooltip } from '~components/LabelWithTooltip/LabelWithTooltip';
import type { LayerEditorFormAtomType } from '../../atoms/layerEditorForm';
import { EditableLayerFieldsPlaceholder } from '../EditableLayerFieldsPlaceholder/EditableLayerFieldsPlaceholder';
import s from './EditLayerForm.module.css';

interface EditLayerFormFormProps {
  data: LayerEditorFormAtomType;
  onSave: () => void;
  onCancel: () => void;
}

export function EditLayerForm({
  data,
  onSave,
  onCancel,
}: EditLayerFormFormProps) {
  const [formState, { addField, removeField, reorderFields, updateName }] =
    useAtom(data);

  const onNameChange = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      updateName(ev.target.value);
    },
    [updateName],
  );

  return (
    <div className={s.formContainer}>
      <div className={s.formParam}>
        <LabelWithTooltip
          text={i18n.t('Layer name')}
          description={i18n.t('Layer name')}
        />
        <Input
          onChange={onNameChange}
          value={formState.name}
          className={s.formInput}
        />
      </div>
      <div className={s.formParam}>
        <LabelWithTooltip
          text={i18n.t('Marker icon')}
          description={i18n.t('Marker icon')}
        />
        <Button
          iconBefore={<MarkerIcon />}
          size="small"
          variant="invert-outline"
        />
      </div>
      <EditableLayerFieldsPlaceholder
        fieldModels={formState.fields}
        onAddField={addField}
        onRemoveField={removeField}
        onReorderFields={reorderFields}
      />
      <div className={s.buttonsContainer}>
        <Button onClick={onSave} variant="primary" size="small">
          {i18n.t(formState.id ? 'Save' : 'Create')}
        </Button>
        <Button onClick={onCancel} variant="invert-outline" size="small">
          {i18n.t('Cancel')}
        </Button>
      </div>
    </div>
  );
}
