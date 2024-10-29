import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import clsx from 'clsx';
import { Button, Divider } from '@konturio/ui-kit';
import { Plus24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import { EditableLayerFieldContainer } from '../EditableLayerFieldContainer/EditableLayerFieldContainer';
import s from './EditableLayerFieldsPlaceholder.module.css';
import type { LayerEditorFormFieldAtomType } from '~features/create_layer/atoms/layerEditorFormField';

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
      <Divider className={clsx(s.dividerLabel, 'k-font-caption')} type="horizontal">
        {i18n.t('create_layer.fields')}
      </Divider>

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
        iconBefore={<Plus24 />}
        size="small"
      >
        {i18n.t('create_layer.add_field')}
      </Button>

      <Divider fitted />
    </div>
  );
}
