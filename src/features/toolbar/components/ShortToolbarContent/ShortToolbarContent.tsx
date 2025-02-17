import { useAtom } from '@reatom/react-v2';
import { toolbar } from '~core/toolbar';
import { ToolbarControl } from '../ToolbarControl/ToolbarControl';
import { ShortToolbarButton } from '../ShortToolbarButton/ShortToolbarButton';
import s from './ShortToolbarContent.module.css';

export const ShortToolbarContent = () => {
  const [controls] = useAtom(toolbar.controls);

  return (
    <div className={s.toolbarContent}>
      {toolbar.toolbarSettings.sections.map(
        (section, index) =>
          section.controls.length > 0 && (
            <div key={section.name} className={s.section}>
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
                    controlComponent={ShortToolbarButton}
                  />
                );
              })}
            </div>
          ),
      )}
    </div>
  );
};
