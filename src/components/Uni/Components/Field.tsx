import { SimpleTooltip } from '@konturio/floating';
import { Icon } from '~components/Icon';
import { useLayoutContext } from '../Layout/LayoutContext';
import s from './Field.module.css';
import type { FieldMeta } from '../fieldsRegistry';

export interface FieldProps {
  value?: any;

  $meta?: {
    value?: FieldMeta | null;
  };

  className?: string;

  showLabel?: boolean;

  format?: string;
}

/**
 * Field displays a value with metadata-driven formatting, icons, labels and tooltips
 */
export function Field({
  value,
  $meta,
  className = '',
  showLabel = true,
  format,
}: FieldProps) {
  const context = useLayoutContext();

  if (value === undefined) return null;

  const fieldMeta = $meta?.value;

  const formattedValue =
    format && context.formatsRegistry[format]
      ? context.formatsRegistry[format](value)
      : context.getFormattedValue(fieldMeta, value);

  const shouldShowLabel = showLabel && fieldMeta?.label;
  const tooltip = fieldMeta?.tooltip;

  const content = (
    <div className={`${s.container} ${className}`}>
      {fieldMeta?.icon && <Icon icon={fieldMeta.icon as any} className={s.icon} />}
      {shouldShowLabel && <div className={s.label}>{fieldMeta.label}</div>}
      <div className={s.value}>{formattedValue}</div>
    </div>
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
