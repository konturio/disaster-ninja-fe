import clsx from 'clsx';
import { useFormattedValue } from '../hooks/useFormattedValue';
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
  const formattedValue = useFormattedValue(value, format);

  if (value === undefined) return null;

  const key = ('' + value).toLowerCase();
  const computedVariant: VariantType = mapping?.[key] ?? variant;

  const variantClass = Variants[computedVariant.toLowerCase() as VariantType] ?? '';

  return (
    <div className={clsx(s.badge, variantClass, className)} style={style}>
      {formattedValue}
    </div>
  );
}
