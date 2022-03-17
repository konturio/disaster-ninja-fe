import s from './UserLayerContext.module.css';
import { TripleDotIcon } from '@k2-packages/default-icons';
import { useCallback, useState } from 'react';
import { TranslationService as i18n } from '~core/localization';
import { v4 as uuidv4 } from 'uuid';

const ContextMenuEditItem = 'editlayer';

type ContextMenuEditItemType = typeof ContextMenuEditItem;

type ContextMenuItemType = {
  name: string;
  type: ContextMenuEditItemType;
};

const contextMenuItems: ContextMenuItemType[] = [
  {
    name: 'Edit Layer',
    type: ContextMenuEditItem,
  },
];

interface UserLayerContextItemProps {
  context: ContextMenuItemType;
  onClick: (type: ContextMenuEditItemType) => void;
}

function UserLayerContextItem({ context, onClick }: UserLayerContextItemProps) {
  const onItemClick = useCallback(() => {
    onClick(context.type);
  }, [onClick, context]);

  return (
    <div className={s.contextItem} onClick={onItemClick}>
      {i18n.t(context.name)}
    </div>
  );
}

export function UserLayerContext({ layerId }: { layerId: string }) {
  const [showContext, setShowContext] = useState<boolean>(false);

  const onContextItemClick = useCallback(
    (type: ContextMenuEditItemType) => {
      switch (ContextMenuEditItem) {
        case 'editlayer':
          // TODO: Layer edit mode processing should start here
          console.log('onContextItemClick', layerId);
          break;
      }
    },
    [layerId],
  );

  const onContextClick = useCallback(() => {
    setShowContext(true);
  }, []);

  const onContextMouseOut = useCallback(
    (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setShowContext(false);
    },
    [],
  );

  return (
    <div className={s.userLayerContext}>
      <div className={s.context} onClick={onContextClick}>
        <TripleDotIcon />
      </div>
      {showContext && (
        <div className={s.contextBox} onMouseLeave={onContextMouseOut}>
          {contextMenuItems.map((ctx) => (
            <UserLayerContextItem
              key={uuidv4()}
              context={ctx}
              onClick={onContextItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
