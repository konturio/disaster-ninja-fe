import s from './CreateLayerFieldsPlaceholder.module.css';
import clsx from 'clsx';
import { translationService as i18n } from '~core/index';
import { Button } from '@k2-packages/ui-kit';
import { UploadFileIcon } from '@k2-packages/default-icons';
import { CreateLayerFieldContainer } from '../CreateLayerFieldContainer/CreateLayerFieldContainer';
import { LayerFieldAtomType } from '~features/create_layer/atoms/createLayerField';

interface CreateLayerFieldsPlaceholderProps {
  fieldModels: LayerFieldAtomType[];
  onAddField: () => void;
  onRemoveField: (index: number) => void;
  onReorderFields: (oldIndex: number, newIndex: number) => void;
}

export function CreateLayerFieldsPlaceholder( { fieldModels, onAddField, onRemoveField, onReorderFields }: CreateLayerFieldsPlaceholderProps ) {
  return (
    <div className={s.fieldsContainer}>
      <div className={clsx(s.fieldsLabel, 'k-font-caption')}>
        <div className={s.textCaption}>{i18n.t('Fields')}</div>
      </div>
      <div className={s.fieldsPlaceholder}>
        { fieldModels.map((fldModelAtom) => (
          <CreateLayerFieldContainer key={fldModelAtom.id} data={fldModelAtom} />
        )) }
      </div>
      <Button onClick={onAddField} className={s.addFieldButton} variant='invert-outline'>
        <UploadFileIcon />
        {i18n.t('Add field')}
      </Button>
    </div>
  );
}
