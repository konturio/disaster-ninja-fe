import s from './CreateLayerFieldContainer.module.css';
import { SortIcon, TrashBinIcon } from '@k2-packages/default-icons';
import { useAtom } from '@reatom/react';
import { Input } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import clsx from 'clsx';
import { ChangeEvent, useCallback, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import { LayerFieldAtomType } from '~features/create_layer/atoms/createLayerField';
import { LayerFieldType } from '~features/create_layer/types';

const ITEM_TYPE = 'field-container';

interface CreateLayerFieldContainerProps {
  data: LayerFieldAtomType;
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

export function CreateLayerFieldContainer({
  data,
  id,
  index,
  onReorder,
  onRemove,
  className,
}: CreateLayerFieldContainerProps) {
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
      updateType(ev.target.value as LayerFieldType);
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
        <SortIcon />
      </div>
      <div onClick={onRemoveClick} className={s.removeBtn}>
        <TrashBinIcon />
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
          <option value="none">{i18n.t('Select')}</option>
          <option value="shorttext">{i18n.t('Short Text')}</option>
          <option value="longtext">{i18n.t('Long Text')}</option>
          <option value="link">{i18n.t('Link')}</option>
          <option value="image">{i18n.t('Image')}</option>
        </select>
      </div>
    </div>
  );
}
