import { Ninja24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import { currentAppPropertiesResourceAtom } from '~core/shared_state/currentApplication';

export function SidebarAppIcon() {
  const [{ data: appParams }] = useAtom(currentAppPropertiesResourceAtom);
  const appIcon = <img src={appParams?.sidebarIconUrl} width={24} height={24} />;
  const asyncIcon = appParams?.sidebarIconUrl ? appIcon : <Ninja24 />;
  return asyncIcon;
}
