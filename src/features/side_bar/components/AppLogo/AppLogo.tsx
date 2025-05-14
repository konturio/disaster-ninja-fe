import clsx from 'clsx';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import s from './AppLogo.module.css';

type AppLogoProps = {
  className?: string;
  labelClassName?: string;
  isOpen: boolean;
};

export function AppLogo({ isOpen, labelClassName, className }: AppLogoProps) {
  const iconPath = configRepo.get().sidebarIconUrl;

  const appIcon = iconPath ? (
    <div className={clsx(s.logoContainer, 'knt-app-icon')}>
      <img src={iconPath} alt={i18n.t('sidebar.icon_alt')} />
    </div>
  ) : null;

  return (
    <div className={clsx(s.logo, className)}>
      {appIcon}
      {isOpen ? <span className={labelClassName}>{configRepo.get().name}</span> : null}
    </div>
  );
}
