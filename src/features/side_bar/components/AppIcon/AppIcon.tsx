import { useAtom } from '@reatom/react';
import core from '~core/index';
import { currentAppPropertiesResourceAtom } from '~core/shared_state/currentApplication';

export function SidebarAppIcon() {
  const [{ data: appParams }] = useAtom(currentAppPropertiesResourceAtom);

  const appIcon = (
    <img
      src={appParams?.sidebarIconUrl}
      width={24}
      height={24}
      alt={core.i18n.t('sidebar.icon_alt')}
    />
  );
  const asyncIcon = appParams?.sidebarIconUrl ? appIcon : null;
  return asyncIcon;
}
