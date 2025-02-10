import { Fragment, useMemo } from 'react';
import { useAtom } from '@reatom/react-v2';
import { ChevronDown16 } from '@konturio/default-icons';
import { toolbar } from '~core/toolbar';
import { ToolbarControl } from '../ToolbarControl/ToolbarControl';
import { ToolbarButton } from '../ToolbarButton/ToolbarButton';
import s from './ToolbarContent.module.css';
import type { ControlState, ToolbarControlSettings } from '~core/toolbar/types';
import type { PrimitiveAtom } from '@reatom/core-v2/primitives';

type ToolbarControlButton = {
  id: string;
  settings: ToolbarControlSettings;
  stateAtom: PrimitiveAtom<ControlState>;
};

export const ToolbarContent = () => {
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

  return (
    <div className={s.toolbarContent}>
      {toolbarContent.map(({ sectionName, buttons }, index) => (
        <Fragment key={sectionName}>
          {index > 0 && <div className={s.sectionDivider} />}
          {
            <div className={s.section}>
              <div className={s.sectionContent}>
                {buttons.map(({ id, settings, stateAtom }) => {
                  return (
                    <ToolbarControl
                      id={id}
                      data-testid={id}
                      key={id}
                      settings={settings}
                      stateAtom={stateAtom}
                      controlComponent={ToolbarButton}
                    />
                  );
                })}
              </div>
              <label className={s.sectionLabel}>
                <input type="checkbox" className={s.sectionToggleCheckbox} />
                {sectionName}
                <ChevronDown16 className={s.sectionArrow} />
              </label>
            </div>
          }
        </Fragment>
      ))}
    </div>
  );
};
