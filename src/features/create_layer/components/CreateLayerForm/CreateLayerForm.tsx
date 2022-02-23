import s from './CreateLayerForm.module.css';
import { useAtom } from '@reatom/react';
import { LabelWithTooltip } from '~components/LabelWithTooltip/LabelWithTooltip';
import { translationService as i18n } from '~core/index';
import { Button, Input } from '@k2-packages/ui-kit';
import { MarkerIcon } from '@k2-packages/default-icons';
import { CreateLayerFieldsPlaceholder } from '../CreateLayerFieldsPlaceholder/CreateLayerFieldsPlaceholder';
import { useCallback } from 'react';
import { LayerDataAtomType } from '~features/create_layer/atoms/createLayerData';

interface CreateLayerFormProps {
  data: LayerDataAtomType;
}

export function CreateLayerForm({ data }: CreateLayerFormProps) {
  const [ formState, { addField, removeField, reorderFields } ] = useAtom(data);

  const onAddField = useCallback(() => {
    addField();
  }, [addField]);

  const onRemoveField = useCallback((index: number) => {

  }, [removeField]);

  const onReorderFields = useCallback((oldIndex: number, newIndex: number) => {

  }, [reorderFields]);

  return (
    <div className={s.formContainer}>
      <div className={s.formParam}>
        <LabelWithTooltip
          text={i18n.t('Layer name')}
          description={i18n.t('Layer name')}
        />
        <Input className={s.formInput} />
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
        onAddField={onAddField}
        onRemoveField={onRemoveField}
        onReorderFields={onReorderFields}
      />
      <div className={s.buttonsContainer}>
        <Button className={s.saveBtn}>
          {i18n.t('Save')}
        </Button>
        <Button className={s.cancelBtn}>
          {i18n.t('Cancel')}
        </Button>
      </div>
    </div>
  )
}
