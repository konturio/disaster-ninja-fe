import { useMemo } from 'react';
import { useAtom } from '@reatom/react-v2';
import { toolbar } from '~core/toolbar';
import type { ControlState, ToolbarControlSettings } from '~core/toolbar/types';
import type { PrimitiveAtom } from '@reatom/core-v2/primitives';

type ToolbarControlButton = {
  id: string;
  settings: ToolbarControlSettings;
  stateAtom: PrimitiveAtom<ControlState>;
};

export const useToolbarContent = () => {
  const [controls] = useAtom(toolbar.controls);

  const toolbarContent = useMemo(() => {
    return toolbar.toolbarSettings.sections
      .map((section) => {
        const buttons = section.controls.reduce<ToolbarControlButton[]>((acc, id) => {
          const settings = controls.get(id);
          const stateAtom = toolbar.getControlState(id);
          if (settings && stateAtom) acc.push({ id, settings, stateAtom });
          return acc;
        }, []);
        return { sectionName: section.name, buttons };
      })
      .filter(({ buttons }) => buttons.length > 0);
  }, [controls]);

  return toolbarContent;
};
