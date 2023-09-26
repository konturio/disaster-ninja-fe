import { ActionsBarBTN } from '@konturio/ui-kit';
import configRepo from '~core/config';
import { i18n } from '~core/localization';
import { transformIconLink } from '~utils/common';

type AppNameAndIconProps = {
  wrapClassName?: string;
  appNameClassName?: string;
  isOpen: boolean;
};

export function AppNameAndIcon({
  isOpen,
  appNameClassName,
  wrapClassName,
}: AppNameAndIconProps) {
  const iconPath =
    configRepo.get().sidebarIconUrl && transformIconLink(configRepo.get().sidebarIconUrl);

  const appIcon = iconPath ? (
    <img src={iconPath} width={24} height={24} alt={i18n.t('sidebar.icon_alt')} />
  ) : null;

  return (
    <ActionsBarBTN active={false} iconBefore={appIcon} className={wrapClassName}>
      {isOpen ? <span className={appNameClassName}>{configRepo.get().name}</span> : null}
    </ActionsBarBTN>
  );
}
