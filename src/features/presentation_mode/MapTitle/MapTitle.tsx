import clsx from 'clsx';
import { AppLogo } from '~features/side_bar/components/AppLogo/AppLogo';
import s from './MapTitle.module.css';

type MapTitleProps = {
  title?: string;
  description?: string;
};

export const MapTitle = ({ title, description }: MapTitleProps) => {
  return (
    <div className={clsx(s.container, 'knt-panel')}>
      <AppLogo
        isOpen={true}
        logoContainerClassName={s.logoContainer}
        labelClassName={s.appLabel}
      />
      {title && <div className={s.title}>{title}</div>}
      {description && <div className={s.description}>{description}</div>}
    </div>
  );
};
