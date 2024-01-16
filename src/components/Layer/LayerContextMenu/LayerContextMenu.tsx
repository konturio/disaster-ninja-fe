import { More16 } from '@konturio/default-icons';
import { useCallback, useState } from 'react';
import s from './LayerContextMenu.module.css';

interface LayerContextMenuItemProps {
  id: string;
  name: string;
  callback: () => void;
}

function LayerContextMenuItem({ name, callback }: Omit<LayerContextMenuItemProps, 'id'>) {
  return (
    <div className={s.contextItem} onClick={callback}>
      {name}
    </div>
  );
}

export function LayerContextMenu({
  contextMenu,
}: {
  contextMenu: LayerContextMenuItemProps[];
}) {
  const [showContext, setShowContext] = useState<boolean>(false);

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
        <More16 />
      </div>
      {showContext && (
        <div className={s.contextBox} onMouseLeave={onContextMouseOut}>
          {contextMenu.map((menuItem) => (
            <LayerContextMenuItem
              key={menuItem.id}
              callback={menuItem.callback}
              name={menuItem.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
