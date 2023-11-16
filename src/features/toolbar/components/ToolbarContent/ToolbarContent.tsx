import { Button } from '@konturio/ui-kit';
import { Fragment } from 'react';
import { useAtom } from '@reatom/react';
import { toolbar } from '~core/toolbar';
import { ToolbarControl } from '../ToolbarControl/ToolbarControl';
import s from './ToolbarContent.module.css';

export const ToolbarContent = () => {
  const [controls] = useAtom(toolbar.controls);

  return (
    <div className={s.toolbarContent}>
      {toolbar.toolbarSettings.sections.map((section, index) => (
        <Fragment key={section.name}>
          {index > 0 && <div className={s.sectionDivider}></div>}
          <div className={s.section}>
            <div className={s.sectionContent}>
              {section.controls.map((id) => {
                const settings = controls.get(id);
                const stateAtom = toolbar.getControlState(id);

                if (!settings || !stateAtom) return null;
                return (
                  <ToolbarControl
                    id={id}
                    key={id}
                    settings={settings}
                    stateAtom={stateAtom}
                  />
                );
              })}
            </div>
            <div className={s.sectionLabel}>{section.name}</div>
          </div>
        </Fragment>
      ))}
    </div>
  );
};
