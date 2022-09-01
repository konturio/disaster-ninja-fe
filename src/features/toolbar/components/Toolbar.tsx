import { useAction, useAtom } from '@reatom/react';
import { Button } from '@konturio/ui-kit';
import { nanoid } from 'nanoid';
import clsx from 'clsx';
import { toolbarControlsAtom } from '~core/shared_state';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { controlsOrder } from '../constants';
import { sortByPredefinedOrder } from '../sortByPredefinedOrder';
import s from './Toolbar.module.css';

// To be developed in next commit
export function Toolbar() {
  const [controls] = useAtom(toolbarControlsAtom);
  // To do soon in #11734

  // const setTooltip = useAction(currentTooltipAtom.setCurrentTooltip);
  // const resetTooltip = useAction(currentTooltipAtom.resetCurrentTooltip);

  function onMouseEnter(e: React.MouseEvent<HTMLDivElement, MouseEvent>, title: string) {
    // To do soon in #11734
    // setTooltip({
    //   popup: title,
    //   position: { x: e.clientX + 5, y: e.clientY },
    //   hoverBehavior: true,
    // });
  }

  function onMouseLeave() {
    // resetTooltip();
  }

  return (
    <div className={s.toolbar}>
      {sortByPredefinedOrder(Object.values(controls), controlsOrder).map(
        (control, index) => (
          <div key={control.id} className={s.toolbarItem}>
            <div
              className={clsx([s.buttonWrap, control.active && s.active])}
              onClick={() => control.onClick && control.onClick(!control.active)}
              onPointerEnter={(e) => onMouseEnter(e, control.title)}
              onPointerLeave={onMouseLeave}
            >
              <Button
                active={control.active}
                iconBefore={control.icon}
                size="small"
                className={s.toolButton}
                variant="invert"
              />
            </div>
            <div className={s.hoverHint}>{control.title}</div>
          </div>
        ),
      )}
    </div>
  );
}
