import { SimpleTooltip } from '@konturio/floating';
import { Button } from '@konturio/ui-kit';
import { useCallback } from 'react';
import { Icon } from '~components/Icon';
import { useUniLayoutContext } from '../Layout/UniLayoutContext';
import baseStyles from './Base.module.css';

interface IconButtonProps {
  value: string;
  $meta: any;
  icon: string;
  variant?: 'primary' | 'invert-outline' | 'invert';
  action?: string;
  handleAction?: (action: string, data?: any) => void;
}

export function IconButton({
  value,
  $meta,
  icon,
  variant = 'invert-outline',
  action,
  handleAction,
  ...props
}: IconButtonProps) {
  const context = useUniLayoutContext();

  const fieldMeta = $meta?.value;

  const formattedValue = context.getFormattedValueWithMeta(fieldMeta, value);

  const tooltip = fieldMeta?.tooltip;

  const handler = useCallback(() => {
    if (action && handleAction) {
      handleAction(action);
    }
  }, [action, handleAction]);

  const content = (
    <Button
      className={baseStyles.alignStart}
      variant={variant}
      size="tiny"
      onClick={action ? handler : undefined}
      iconBefore={icon && <Icon icon={icon as any} style={{ height: 16 }} />}
      {...props}
    >
      {formattedValue}
    </Button>
  );

  if (tooltip) {
    return (
      <SimpleTooltip content={tooltip} placement="top">
        {content}
      </SimpleTooltip>
    );
  }

  return content;
}
