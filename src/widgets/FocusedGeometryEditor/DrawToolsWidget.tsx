import { EditGeometry16, Finish16 } from '@konturio/default-icons';
import clsx from 'clsx';
import { i18n } from '~core/localization';
import { useDrawTools } from '~core/draw_tools';
import { ToolbarButton } from '~features/toolbar/components/ToolbarButton/ToolbarButton';
import { ToolbarIcon } from '~features/toolbar/components/ToolbarIcon';
import { ShortToolbarButton } from '~features/toolbar/components/ShortToolbarButton/ShortToolbarButton';
import { FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME } from './constants';
import s from './DrawToolsWidget.module.css';
import type { WidgetProps } from '~core/toolbar/types';

export function DrawToolsWidget({
  state,
  onClick,
  controlComponent: ControlComponent,
}: WidgetProps) {
  const [tools, finishDrawing] = useDrawTools();

  if (state === 'regular') {
    return (
      <ControlComponent
        icon={<EditGeometry16 width={16} height={16} />}
        size="large"
        onClick={onClick}
      >
        {FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME}
      </ControlComponent>
    );
  } else {
    const onFinish = () => {
      finishDrawing(); // order of callings is important!
      onClick();
    };

    return (
      <>
        {tools.map((tool) => {
          return (
            <ControlComponent
              key={tool.name}
              icon={<ToolbarIcon width={16} height={16} icon={tool.icon} />}
              size={tool.prefferedSize || 'tiny'}
              onClick={tool.action}
              active={tool.state === 'active'}
              disabled={tool.state === 'disabled'}
            >
              {tool.name}
            </ControlComponent>
          );
        })}
        <ControlComponent
          variant="primary"
          icon={<Finish16 width={16} height={16} />}
          size="medium"
          className={clsx(s.finishButton)}
          disabled={state === 'disabled'}
          onClick={onFinish}
        >
          {i18n.t('save')}
        </ControlComponent>
      </>
    );
  }
}
