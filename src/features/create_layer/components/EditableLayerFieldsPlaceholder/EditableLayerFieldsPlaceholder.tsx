import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import clsx from 'clsx';
import { Button } from '@k2-packages/ui-kit';
import { UploadFileIcon } from '@k2-packages/default-icons';
import { translationService as i18n } from '~core/index';
import { EditableLayerFieldContainer } from '../EditableLayerFieldContainer/EditableLayerFieldContainer';
import type { LayerEditorFormFieldAtomType } from '~features/create_layer/atoms/layerEditorFormField';
import s from './EditableLayerFieldsPlaceholder.module.css';

interface EditableLayerFieldsPlaceholderProps {
  fieldModels: LayerEditorFormFieldAtomType[];
  onAddField: () => void;
  onRemoveField: (index: number) => void;
  onReorderFields: (fromIndex: number, toIndex: number) => void;
}

export function EditableLayerFieldsPlaceholder({
  fieldModels,
  onAddField,
  onRemoveField,
  onReorderFields,
}: EditableLayerFieldsPlaceholderProps) {
  return (
    <div className={s.fieldsContainer}>
      <div className={clsx(s.fieldsLabel, 'k-font-caption')}>
        <div className={s.textCaption}>{i18n.t('Fields')}</div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className={s.fieldsPlaceholder}>
          {fieldModels.map((fldModelAtom, index) => (
            <EditableLayerFieldContainer
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
        variant="invert"
        iconBefore={<UploadFileIcon />}
        size="small"
      >
        {i18n.t('Add field')}
      </Button>
    </div>
  );
}
