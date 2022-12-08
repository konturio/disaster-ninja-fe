import { ActionsBarBTN } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import app_config from '~core/app_config';
import { i18n } from '~core/localization';
import { currentAppPropertiesResourceAtom } from '~core/shared_state/currentApplication';
import { trimLinkIfInDev } from '~utils/common';

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
  const [{ data: appParams }] = useAtom(currentAppPropertiesResourceAtom);
  const iconPath =
    appParams?.sidebarIconUrl &&
    trimLinkIfInDev(app_config.isDevBuild, appParams?.sidebarIconUrl);

  const appIcon = iconPath ? (
    <img src={iconPath} width={24} height={24} alt={i18n.t('sidebar.icon_alt')} />
  ) : null;

  return (
    <ActionsBarBTN active={false} iconBefore={appIcon} className={wrapClassName}>
      {isOpen ? <span className={appNameClassName}>{appParams?.name}</span> : null}
    </ActionsBarBTN>
  );
}
