import clsx from 'clsx';
import { useUniLayoutContext } from '../Layout/UniLayoutContext';
import s from './Badge.module.css';

type VariantType = 'error' | 'success' | 'warning' | 'info' | 'neutral';

// Map variant names to CSS classes
const Variants = {
  error: s.error,
  success: s.success,
  warning: s.warning,
  info: s.info,
  neutral: s.neutral,
};

interface BadgeProps {
  value: string | number;
  variant?: VariantType;
  mapping?: Record<string, VariantType>;
  className?: string;
  style?: object;
  format?: string;
}

export function Badge({
  value,
  variant = 'neutral',
  mapping,
  className = '',
  style = {},
  format,
}: BadgeProps) {
  const context = useUniLayoutContext();

  if (value === undefined) return null;

  const formattedValue =
    format && context.formatsRegistry[format]
      ? context.formatsRegistry[format](value)
      : value;

  const key = ('' + value).toLowerCase();
  const computedVariant: VariantType = mapping?.[key] ?? variant;

  const variantClass = Variants[computedVariant.toLowerCase() as VariantType] ?? '';

  return (
    <div className={clsx(s.badge, variantClass, className)} style={style}>
      {formattedValue}
    </div>
  );
}
