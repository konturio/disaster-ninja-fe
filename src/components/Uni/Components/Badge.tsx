import s from './Badge.module.css';
import type { FieldMeta } from '../fieldsRegistry';

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
}

export function Badge({
  value,
  variant = 'neutral',
  mapping,
  className = '',
  style = {},
}: BadgeProps) {
  if (mapping?.[('' + value).toLowerCase()]) {
    variant = mapping[('' + value).toLowerCase()];
  }
  const variantClass = variant ? Variants[('' + variant).toLowerCase()] : '';
  return (
    <div className={`${s.badge} ${variantClass} ${className}`} style={style}>
      {value}
    </div>
  );
}
