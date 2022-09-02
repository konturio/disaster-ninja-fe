import { useAtom } from '@reatom/react';
import { Button } from '@konturio/ui-kit';
import clsx from 'clsx';
import { toolbarControlsAtom } from '~core/shared_state';
import { controlsOrder } from '../constants';
import { sortByPredefinedOrder } from '../sortByPredefinedOrder';
import s from './Toolbar.module.css';

// To be developed in next commit
export function Toolbar() {
  const [controls] = useAtom(toolbarControlsAtom);

  return (
    <div className={s.toolbar}>
      {sortByPredefinedOrder(Object.values(controls), controlsOrder).map(
        (control, index) => (
          <div key={control.id} className={s.toolbarItem}>
            <div
              className={clsx([s.buttonWrap, control.active && s.active])}
              onClick={() => control.onClick && control.onClick(!control.active)}
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
