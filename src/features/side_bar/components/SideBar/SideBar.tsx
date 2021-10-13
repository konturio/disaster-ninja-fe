import { useAtom } from '@reatom/react';
import { ActionsBar, ActionsBarBTN } from '@k2-packages/ui-kit';
import { sideControlsBarAtom } from '~core/shared_state';
import { sortByPredefinedOrder } from './sortByPredefinedOrder';
import { controlsOrder } from '../../constants';

export function SideBar() {
  const [controls] = useAtom(sideControlsBarAtom);
  return (
    <ActionsBar>
      {sortByPredefinedOrder(Object.values(controls), controlsOrder).map(
        (control) => (
          <ActionsBarBTN
            key={control.id}
            onClick={control.onClick}
            active={control.active}
          >
            {control.icon}
          </ActionsBarBTN>
        ),
      )}
    </ActionsBar>
  );
}
