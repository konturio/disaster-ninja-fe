import s from './CreateLayerForm.module.css';
import { useAtom } from '@reatom/react';
import { LabelWithTooltip } from '~components/LabelWithTooltip/LabelWithTooltip';
import { translationService as i18n } from '~core/index';
import { Button, Input } from '@k2-packages/ui-kit';
import { MarkerIcon } from '@k2-packages/default-icons';
import { CreateLayerFieldsPlaceholder } from '../CreateLayerFieldsPlaceholder/CreateLayerFieldsPlaceholder';
import { ChangeEvent, useCallback } from 'react';
import { LayerDataAtomType } from '~features/create_layer/atoms/createLayerData';

interface CreateLayerFormProps {
  data: LayerDataAtomType;
  onSave: () => void;
  onCancel: () => void;
}

export function CreateLayerForm({
  data,
  onSave,
  onCancel,
}: CreateLayerFormProps) {
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
        <Input onChange={onNameChange} className={s.formInput} />
      </div>
      <div className={s.formParam}>
        <LabelWithTooltip
          text={i18n.t('Marker icon')}
          description={i18n.t('Marker icon')}
        />
        <Button>
          <MarkerIcon />
        </Button>
      </div>
      <CreateLayerFieldsPlaceholder
        fieldModels={formState.fields}
        onAddField={addField}
        onRemoveField={removeField}
        onReorderFields={reorderFields}
      />
      <div className={s.buttonsContainer}>
        <Button onClick={onSave} className={s.saveBtn}>
          {i18n.t('Save')}
        </Button>
        <Button onClick={onCancel} className={s.cancelBtn}>
          {i18n.t('Cancel')}
        </Button>
      </div>
    </div>
  );
}
