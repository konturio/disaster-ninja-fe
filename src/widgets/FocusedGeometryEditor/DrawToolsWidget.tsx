import { Close16, EditGeometry16, Finish16 } from '@konturio/default-icons';
import clsx from 'clsx';
import { i18n } from '~core/localization';
import { useDrawTools } from '~core/draw_tools';
import { ToolbarIcon } from '~features/toolbar/components/ToolbarIcon';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME } from './constants';
import s from './DrawToolsWidget.module.css';
import type { WidgetProps } from '~core/toolbar/types';

export function DrawToolsWidget({
  state,
  onClick,
  controlComponent: ControlComponent,
}: WidgetProps): JSX.Element {
  const [tools, { cancelDrawing, finishDrawing }] = useDrawTools();
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  switch (state) {
    case 'disabled':
    case 'regular':
      return (
        <ControlComponent
          icon={<EditGeometry16 width={16} height={16} />}
          size={isMobile ? 'medium' : 'large'}
          onClick={onClick}
          disabled={state === 'disabled'}
          hint={FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME}
        >
          {FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME}
        </ControlComponent>
      );

    case 'active':
      const onFinish = () => {
        finishDrawing(); // order of callings is important!
        onClick();
      };

      const onCancel = () => {
        cancelDrawing(); // order of callings is important!
        onClick();
      };

      return (
        <>
          {tools.map((tool) => {
            const size =
              isMobile && tool.mobilePreferredSize
                ? tool.mobilePreferredSize
                : tool.preferredSize;
            return (
              <ControlComponent
                key={tool.name}
                icon={<ToolbarIcon width={16} height={16} icon={tool.icon} />}
                size={size || 'tiny'}
                onClick={tool.action}
                active={tool.state === 'active'}
                disabled={tool.state === 'disabled'}
                hint={tool.name}
              >
                {tool.name}
              </ControlComponent>
            );
          })}
          {/* Cancel button */}
          <ControlComponent
            icon={<Close16 width={16} height={16} />}
            size="medium"
            onClick={onCancel}
            hint={i18n.t('cancel')}
          >
            {i18n.t('cancel')}
          </ControlComponent>
          {/* Finish button */}
          <ControlComponent
            variant="primary"
            icon={<Finish16 width={16} height={16} />}
            size="medium"
            className={clsx(s.finishButton)}
            onClick={onFinish}
            hint={i18n.t('save')}
          >
            {i18n.t('save')}
          </ControlComponent>
        </>
      );
  }
}
