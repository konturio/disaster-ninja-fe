import { useAtom } from '@reatom/react';
import { ActionsBar, ActionsBarBTN } from '@konturio/ui-kit';
import { nanoid } from 'nanoid';
import { Link } from 'react-router-dom';
import { modesControlsAtom } from '~core/modes/modesControls';
import { APP_ROUTES } from '~core/app_config/appRoutes';
import { MODES_LABELS } from '~core/modes/constants';
import { controlsOrder } from '../constants';
import { sortByPredefinedOrder } from '../sortByPredefinedOrder';
import s from './SideBar.module.css';

// To be developed in next commit
export function Toolbar() {
  const [controls] = useAtom(modesControlsAtom);
  // const setTooltip = useAction(currentTooltipAtom.setCurrentTooltip);
  // const resetTooltip = useAction(currentTooltipAtom.resetCurrentTooltip);

  // function onMouseEnter(
  //   e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  //   title: string,
  // ) {
  //   setTooltip({
  //     popup: title,
  //     position: { x: e.clientX + 5, y: e.clientY },
  //     hoverBehavior: true,
  //   });
  // }

  // function onMouseLeave() {
  //   resetTooltip();
  // }

  return (
    <ActionsBar>
      {sortByPredefinedOrder(Object.values(controls), controlsOrder).map(
        (control) => {
          return (
            <Link
              key={nanoid(4)}
              className={s.sideBarContainer}
              to={APP_ROUTES[control.id]}
            >
              <div className={s.buttonWrap} onClick={() => control.onClick()}>
                <ActionsBarBTN
                  active={control.active}
                  iconBefore={control.icon}
                  value={control.id}
                  className={s.controlButton}
                >
                  <span className={s.modeName}>{MODES_LABELS[control.id]}</span>
                </ActionsBarBTN>
              </div>
            </Link>
          );
        },
      )}
    </ActionsBar>
  );
}
