import { useAction, useAtom } from '@reatom/react';
import { ActionsBar, ActionsBarBTN } from '@k2-packages/ui-kit';
import { sideControlsBarAtom } from '~core/shared_state';
import { sortByPredefinedOrder } from './sortByPredefinedOrder';
import { controlsOrder } from '../../constants';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { v4 as uuidv4 } from 'uuid';
import s from './SideBar.module.css';

export function SideBar() {
  const [controls] = useAtom(sideControlsBarAtom);
  const setTooltip = useAction(currentTooltipAtom.setCurrentTooltip);
  const resetTooltip = useAction(currentTooltipAtom.resetCurrentTooltip);

  function onMouseEnter(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    title: string,
  ) {
    setTooltip({
      popup: title,
      position: { x: e.clientX + 5, y: e.clientY },
      hoverBehavior: true,
    });
  }

  function onMouseLeave() {
    resetTooltip();
  }

  return (
    <ActionsBar>
      {sortByPredefinedOrder(Object.values(controls), controlsOrder).map(
        (control) => (
          <div key={uuidv4()} className={s.sideBarContainer}>
            <div
              className={s.buttonWrap}
              onClick={() =>
                control.onClick && control.onClick(!control.active)
              }
              onPointerEnter={(e) => onMouseEnter(e, control.title)}
              onPointerLeave={onMouseLeave}
            >
              <ActionsBarBTN
                active={control.active}
                iconBefore={control.icon}
              />
            </div>
          </div>
        ),
      )}
    </ActionsBar>
  );
}
