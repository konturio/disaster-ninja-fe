import { useAtom } from '@reatom/react';
import { ActionsBar, ActionsBarBTN } from '@k2-packages/ui-kit';
import { sideControlsBarAtom } from '~core/shared_state';
import { sortByPredefinedOrder } from './sortByPredefinedOrder';
import { controlsOrder } from '../../constants';

export function SideBar() {
  const [controls] = useAtom(sideControlsBarAtom);
  console.log('%c⧭', 'color: #731d6d', controls);

  return (
    <ActionsBar>
      {sortByPredefinedOrder(Object.values(controls), controlsOrder).map(
        (control) => (
          <ActionsBarBTN
            key={control.id}
            onClick={() => control.onClick && control.onClick(!control.active)}
            active={control.active}
          >
            {control.icon}
          </ActionsBarBTN>
        ),
      )}
    </ActionsBar>
  );
}
