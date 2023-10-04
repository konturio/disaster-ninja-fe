import { i18n } from '~core/localization';
import { drawTools } from '~core/draw_tools';
import { FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME } from './constants';
import type { WidgetProps } from '~core/toolbar/types';

export function DrawToolsWidget({ state, toolbox, onClick }: WidgetProps) {
  const [tools] = drawTools.useDrawTools();
  if (state === 'regular') {
    return (
      <toolbox.button
        name={FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME}
        hint={i18n.t('focus_geometry.title')}
        icon={'Poly24'}
        preferredSize={'small'}
        state={state}
        onClick={onClick}
      />
    );
  } else {
    return (
      <>
        {tools.map((tool) => (
          <toolbox.button
            key={tool.name}
            name={tool.name}
            hint={tool.hint}
            icon={tool.icon}
            preferredSize={'small'}
            state={tool.state}
            onClick={tool.toggle}
          />
        ))}
        <toolbox.button
          name={FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME}
          hint={i18n.t('focus_geometry.title')}
          icon={'Poly24'}
          preferredSize={'small'}
          state={state}
          onClick={onClick}
        />
      </>
    );
  }
}
