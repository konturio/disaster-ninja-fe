import { i18n } from '~core/localization';
import { useDrawTools } from '~core/draw_tools';
import { FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME } from './constants';
import { DrawToolsButton } from './DrawToolsButton';
import s from './DrawToolsWidget.module.css';
import type { WidgetProps } from '~core/toolbar/types';

export function DrawToolsWidget({ state, onClick, controlClassName }: WidgetProps) {
  const [tools, finishDrawing] = useDrawTools();

  if (state === 'regular') {
    return (
      <DrawToolsButton
        name={FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME}
        hint={i18n.t('focus_geometry.title')}
        icon={'EditGeometry16'}
        preferredSize={'large'}
        state={state}
        onClick={onClick}
      />
    );
  } else {
    const onFinish = () => {
      finishDrawing(); // order jf callings is important!
      onClick();
    };

    return (
      <>
        {tools.map((tool) => (
          <DrawToolsButton
            key={tool.name}
            name={tool.name}
            hint={tool.hint}
            icon={tool.icon}
            preferredSize={tool.prefferedSize || 'tiny'}
            state={tool.state}
            onClick={tool.action}
          />
        ))}
        <DrawToolsButton
          name={'Save'}
          hint={i18n.t('save')}
          icon="Finish16"
          preferredSize="medium"
          state={state}
          onClick={onFinish}
          className={s.finishButton}
          variant="primary"
        />
      </>
    );
  }
}
