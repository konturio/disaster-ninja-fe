import { ChangeEvent, useCallback, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useAtom } from '@reatom/react';
import type { Identifier, XYCoord } from 'dnd-core';
import clsx from 'clsx';
import { SortDrag16, Trash16 } from '@k2-packages/default-icons';
import { Input } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import type { LayerEditorFormFieldAtomType } from '~features/create_layer/atoms/layerEditorFormField';
import { USER_LAYER_FIELDS } from '../../constants';
import { EditableLayerFieldType } from '../../types';
import s from './EditableLayerFieldContainer.module.css';

const ITEM_TYPE = 'field-container';

interface EditableLayerFieldContainerProps {
  data: LayerEditorFormFieldAtomType;
  index: number;
  id: string;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onRemove: (index: number) => void;
  className?: string;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export function EditableLayerFieldContainer({
  data,
  id,
  index,
  onReorder,
  onRemove,
  className,
}: EditableLayerFieldContainerProps) {
  const [atomState, { updateType, updateName }] = useAtom(data);
  const ref = useRef<HTMLDivElement>(null);

  const onRemoveClick = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ITEM_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onReorder(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.3 : 1;

  drag(drop(ref));

  const updateAtomName = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      updateName(ev.target.value);
    },
    [updateName],
  );

  const updateAtomType = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      updateType(ev.target.value as EditableLayerFieldType);
    },
    [updateType],
  );

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className={clsx(s.fieldContainer, className)}
    >
      <div className={s.sortBtn}>
        <SortDrag16 />
      </div>
      <div onClick={onRemoveClick} className={s.removeBtn}>
        <Trash16 />
      </div>
      <div className={s.fieldPlaceholder}>
        <div className={s.fieldLabel}>{i18n.t('Field name')}</div>
        <Input
          className={s.input}
          onChange={updateAtomName}
          value={atomState.name}
        />
      </div>
      <div className={s.fieldPlaceholder}>
        <div className={s.fieldLabel}>{i18n.t('Type')}</div>
        <select
          className={s.input}
          value={atomState.type}
          onChange={updateAtomType}
        >
          {USER_LAYER_FIELDS.map((fldParams) => (
            <option key={fldParams.label} value={fldParams.type}>
              {i18n.t(fldParams.label)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
