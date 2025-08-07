import { useToolbarContent } from '~features/toolbar/hooks/use-toolbar-content';
import { ToolbarControl } from '../ToolbarControl/ToolbarControl';
import { ToolbarButton } from '../ToolbarButton/ToolbarButton';
import s from './ToolbarContent.module.css';

export const ToolbarContent = () => {
  const toolbarContent = useToolbarContent().flatMap(({ buttons }) => buttons);

  return (
    <div className={s.toolbarContent}>
      {toolbarContent.map(({ id, settings, stateAtom }) => (
        <ToolbarControl
          id={id}
          data-testid={id}
          key={id}
          settings={settings}
          stateAtom={stateAtom}
          controlComponent={ToolbarButton}
        />
      ))}
    </div>
  );
};
