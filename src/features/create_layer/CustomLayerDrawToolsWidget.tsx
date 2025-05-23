import { Close16, Finish16 } from '@konturio/default-icons';
import clsx from 'clsx';
import { useDrawTools } from '~core/draw_tools';
import { ToolbarIcon } from '~features/toolbar/components/ToolbarIcon';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { i18n } from '~core/localization';
import s from '~widgets/FocusedGeometryEditor/DrawToolsWidget.module.css';
import type { WidgetProps } from '~core/toolbar/types';

export function CustomLayerDrawToolsWidget({
  state,
  onClick,
  controlComponent: ControlComponent,
}: WidgetProps): JSX.Element | null {
  const [tools, { cancelDrawing, finishDrawing }] = useDrawTools();
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  switch (state) {
    case 'disabled':
    case 'regular':
      return null;

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
          >
            {i18n.t('save')}
          </ControlComponent>
        </>
      );
  }
}
