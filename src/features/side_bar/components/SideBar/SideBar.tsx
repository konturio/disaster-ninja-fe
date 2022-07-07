import { useAction, useAtom } from '@reatom/react';
import { ActionsBar, ActionsBarBTN } from '@konturio/ui-kit';
import { nanoid } from 'nanoid';
import { sideControlsBarAtom } from '~core/shared_state';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { featureStatus } from '~core/featureStatus';
import { AppFeature } from '~core/auth/types';
import { controlsOrder } from '../../constants';
import { sortByPredefinedOrder } from './sortByPredefinedOrder';
import s from './SideBar.module.css';

let markedReady = false;

export function SideBar() {
  const [controls] = useAtom(sideControlsBarAtom);
  const setTooltip = useAction(currentTooltipAtom.setCurrentTooltip);
  const resetTooltip = useAction(currentTooltipAtom.resetCurrentTooltip);

  if (!markedReady) {
    featureStatus.markReady(AppFeature.SIDE_BAR);
    markedReady = true;
  }

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
          <div key={nanoid(4)} className={s.sideBarContainer}>
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
