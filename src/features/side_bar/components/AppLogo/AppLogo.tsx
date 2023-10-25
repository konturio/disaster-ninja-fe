import { ActionsBarBTN } from '@konturio/ui-kit';
import clsx from 'clsx';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import { transformIconLink } from '~utils/common';
import s from './AppLogo.module.css';

type AppLogoProps = {
  className?: string;
  labelClassName?: string;
  isOpen: boolean;
};

export function AppLogo({ isOpen, labelClassName, className }: AppLogoProps) {
  const iconPath =
    configRepo.get().sidebarIconUrl && transformIconLink(configRepo.get().sidebarIconUrl);

  const appIcon = iconPath ? (
    <img src={iconPath} width={24} height={24} alt={i18n.t('sidebar.icon_alt')} />
  ) : null;

  return (
    <div className={clsx(s.logo, className)}>
      {appIcon}
      {isOpen ? <span className={labelClassName}>{configRepo.get().name}</span> : null}
    </div>
  );
}
