import * as icons from '@konturio/default-icons';
import { Button } from '@konturio/ui-kit';
import clsx from 'clsx';
import { resolveValue } from '~core/toolbar/utils';
import s from '~features/toolbar/components/ToolbarContent/ToolbarContent.module.css';
import type { ValueForState } from '~core/toolbar/types';
import type { ButtonProps } from '@konturio/ui-kit/tslib/Button';

export const DrawToolsButton = (props: {
  name: string | ValueForState<string>;
  hint: string | ValueForState<string>;
  icon: string | ValueForState<string>;
  preferredSize: 'tiny' | 'small' | 'medium' | 'large';
  state: 'regular' | 'disabled' | 'active';
  onClick: () => void;
  className?: string;
  variant?: ButtonProps['variant'];
}) => {
  const Icon = icons[resolveValue(props.icon, props.state)];
  return (
    <Button
      variant={props.variant || 'invert-outline'}
      iconBefore={<Icon width={16} height={16} />}
      size={props.preferredSize}
      className={clsx(s[`control-${props.preferredSize}`], props.className)}
      disabled={props.state === 'disabled'}
      onClick={props.onClick}
    >
      {resolveValue(props.name, props.state)}
    </Button>
  );
};
