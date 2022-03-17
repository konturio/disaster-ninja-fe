import s from './UserLayerContext.module.css';
import { TripleDotIcon } from '@k2-packages/default-icons';
import { useCallback, useState } from 'react';
import { TranslationService as i18n } from '~core/localization';
import { v4 as uuidv4 } from 'uuid';
import {
  UpdateCallbackDeleteLayerType,
  UpdateCallbackEditFeaturesType,
  UpdateCallbackEditLayerType,
  updateCallbackService,
} from '~core/update_callbacks';
import { CONTEXT_MENU_ITEMS } from '~features/layers_panel/constants';
import {
  ContextMenuDeleteLayerItem,
  ContextMenuEditItem,
  ContextMenuEditItemType,
  ContextMenuEditLayerFeaturesItem,
  ContextMenuItemType,
} from '~features/layers_panel/types';

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

      switch (type) {
        case ContextMenuEditItem:
          updateCallbackService.triggerCallback(UpdateCallbackEditLayerType, { layerId });
          break;
        case ContextMenuEditLayerFeaturesItem:
          // TODO: check that it start draw mode
          updateCallbackService.triggerCallback(UpdateCallbackEditFeaturesType, { layerId });
          break;
        case ContextMenuDeleteLayerItem:
          updateCallbackService.triggerCallback(UpdateCallbackDeleteLayerType, { layerId });
      }


      setShowContext(false);
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
          {CONTEXT_MENU_ITEMS.map((ctx) => (
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
