import { Fragment } from 'react';
import { ChevronDown16 } from '@konturio/default-icons';
import { useToolbarContent } from '~features/toolbar/hooks/use-toolbar-content';
import { ToolbarControl } from '../ToolbarControl/ToolbarControl';
import { ToolbarButton } from '../ToolbarButton/ToolbarButton';
import s from './ToolbarContent.module.css';

export const ToolbarContent = () => {
  const toolbarContent = useToolbarContent();

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
