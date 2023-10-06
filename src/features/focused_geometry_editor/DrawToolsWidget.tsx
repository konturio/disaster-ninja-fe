import { useRef } from 'react';
import { i18n } from '~core/localization';
import { useDrawTools } from '~core/draw_tools';
import { FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME } from './constants';
import type { ValueForState, WidgetProps } from '~core/toolbar/types';

const TemporaryButton = (props: {
  name: string | ValueForState<string>;
  hint: string | ValueForState<string>;
  icon: string | ValueForState<string>;
  preferredSize: 'large' | 'small' | 'medium';
  state: 'regular' | 'disabled' | 'active';
  onClick: () => void;
}) => {
  useRef(() => console.warn('TemporaryButton must be replaced with real button'));
  return null;
};

export function DrawToolsWidget({ state, onClick, controlClassName }: WidgetProps) {
  const [tools] = useDrawTools();
  if (state === 'regular') {
    return (
      <TemporaryButton
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
          <TemporaryButton
            key={tool.name}
            name={tool.name}
            hint={tool.hint}
            icon={tool.icon}
            preferredSize={'small'}
            state={tool.state}
            onClick={tool.action}
          />
        ))}
        <TemporaryButton
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
