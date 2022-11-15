import { useAtom } from '@reatom/react';
import { i18n } from '~core/localization';
import { currentAppPropertiesResourceAtom } from '~core/shared_state/currentApplication';

export function SidebarAppIcon() {
  const [{ data: appParams }] = useAtom(currentAppPropertiesResourceAtom);

  const appIcon = (
    <img
      src={appParams?.sidebarIconUrl}
      width={24}
      height={24}
      alt={i18n.t('sidebar.icon_alt')}
    />
  );
  const asyncIcon = appParams?.sidebarIconUrl ? appIcon : null;
  return asyncIcon;
}
