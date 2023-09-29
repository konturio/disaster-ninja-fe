import { useAtom } from '@reatom/react';
import { Button } from '@konturio/ui-kit';
import clsx from 'clsx';
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltips';
import { toolbarControlsAtom } from '~core/shared_state';
import { controlsOrder } from '../constants';
import { sortByPredefinedOrder } from '../sortByPredefinedOrder';
import s from './Toolbar.module.css';

export function Toolbar() {
  const [controls] = useAtom(toolbarControlsAtom);

  return (
    <div className={s.toolbar}>
      {sortByPredefinedOrder(Object.values(controls), controlsOrder).map(
        (control, index) => (
          <div key={control.id} className={s.toolbarItem}>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={clsx([control.active && s.active])}
                  onClick={() => control.onClick?.(!control.active)}
                >
                  <Button
                    active={control.active}
                    iconBefore={control.icon}
                    size="small"
                    className={s.toolButton}
                    variant="invert"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>{control.title}</TooltipContent>
            </Tooltip>
          </div>
        ),
      )}
    </div>
  );
}
