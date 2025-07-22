import clsx from 'clsx';
import { Icon } from '~components/Icon';
import { useUniLayoutContext } from '../Layout/UniLayoutContext';
import s from './CardHeader.module.css';

export interface CardHeaderProps {
  image?: string;
  icon?: any;
  value: string;
  subtitle?: string;
  className?: string;
  format?: string;
}

export function CardHeader({
  image,
  icon,
  value,
  subtitle,
  className,
  format,
}: CardHeaderProps) {
  const context = useUniLayoutContext();
  const formattedValue = context.getFormattedValue(value, format);

  return (
    <div className={clsx(s.cardHeader, className)}>
      {image && (
        <div className={s.imageContainer}>
          <img src={image} alt="" className={s.image} />
        </div>
      )}

      {icon && <Icon icon={icon} className={s.icon} />}

      <div className={s.title}>{formattedValue}</div>

      {subtitle && <div className={s.subtitle}>{subtitle}</div>}
    </div>
  );
}
