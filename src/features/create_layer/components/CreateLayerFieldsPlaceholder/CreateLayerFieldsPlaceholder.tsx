import s from './CreateLayerFieldsPlaceholder.module.css';
import clsx from 'clsx';
import { translationService as i18n } from '~core/index';
import { Button } from '@k2-packages/ui-kit';
import { UploadFileIcon } from '@k2-packages/default-icons';
import { CreateLayerFieldContainer } from '../CreateLayerFieldContainer/CreateLayerFieldContainer';
import { LayerFieldAtomType } from '~features/create_layer/atoms/createLayerField';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface CreateLayerFieldsPlaceholderProps {
  fieldModels: LayerFieldAtomType[];
  onAddField: () => void;
  onRemoveField: (index: number) => void;
  onReorderFields: (fromIndex: number, toIndex: number) => void;
}

export function CreateLayerFieldsPlaceholder({
  fieldModels,
  onAddField,
  onRemoveField,
  onReorderFields,
}: CreateLayerFieldsPlaceholderProps) {
  return (
    <div className={s.fieldsContainer}>
      <div className={clsx(s.fieldsLabel, 'k-font-caption')}>
        <div className={s.textCaption}>{i18n.t('Fields')}</div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className={s.fieldsPlaceholder}>
          {fieldModels.map((fldModelAtom, index) => (
            <CreateLayerFieldContainer
              id={fldModelAtom.id}
              index={index}
              key={fldModelAtom.id}
              data={fldModelAtom}
              onReorder={onReorderFields}
              onRemove={onRemoveField}
            />
          ))}
        </div>
      </DndProvider>

      <Button
        onClick={onAddField}
        className={s.addFieldButton}
        variant="invert-outline"
      >
        <UploadFileIcon />
        {i18n.t('Add field')}
      </Button>
    </div>
  );
}
