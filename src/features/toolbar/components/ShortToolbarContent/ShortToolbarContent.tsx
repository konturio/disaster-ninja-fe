import { useToolbarContent } from '~features/toolbar/hooks/use-toolbar-content';
import { ToolbarControl } from '../ToolbarControl/ToolbarControl';
import { ShortToolbarButton } from '../ShortToolbarButton/ShortToolbarButton';
import s from './ShortToolbarContent.module.css';

export const ShortToolbarContent = () => {
  const toolbarContent = useToolbarContent();

  return (
    <div className={s.toolbarContent}>
      {toolbarContent.map(({ sectionName, buttons }) => (
        <div key={sectionName} className={s.section}>
          {buttons.map(({ id, settings, stateAtom }) => (
            <ToolbarControl
              id={id}
              data-testid={id}
              key={id}
              settings={settings}
              stateAtom={stateAtom}
              controlComponent={ShortToolbarButton}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
