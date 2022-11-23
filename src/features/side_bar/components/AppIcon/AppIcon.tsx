import { useAtom } from '@reatom/react';
import core from '~core/index';

export function SidebarAppIcon() {
  const [{ data: appParams }] = useAtom(core.app.atom);

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
