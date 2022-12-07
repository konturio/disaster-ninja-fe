import { ActionsBarBTN } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react';
import { useEffect } from 'react';
import app_config from '~core/app_config';
import { i18n } from '~core/localization';
import { currentAppPropertiesResourceAtom } from '~core/shared_state/currentApplication';

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
  let iconPath = appParams?.sidebarIconUrl;

  // trim beginning of url designed for builded apps that serve static files via '/active/static'
  if (app_config.isDevBuild && iconPath?.startsWith('/active/static')) {
    iconPath = iconPath.substring(14);
  }

  const appIcon = iconPath ? (
    <img src={iconPath} width={24} height={24} alt={i18n.t('sidebar.icon_alt')} />
  ) : null;

  // change tab icon (not expected to work in Safari https://stackoverflow.com/questions/63781987/cant-change-favicon-with-javascript-in-safari)
  useEffect(() => {
    if (!iconPath) return;
    const linkElements = document.querySelectorAll(
      "link[rel~='icon']",
    ) as NodeListOf<HTMLLinkElement>;
    linkElements.forEach((linkEl) => {
      // keep url icons versions
      const linkUrl = new URL(linkEl.href);
      linkUrl.pathname = iconPath!;
      linkEl.href = linkUrl.pathname + linkUrl.search;
    });
  }, [iconPath]);

  return (
    <ActionsBarBTN active={false} iconBefore={appIcon} className={wrapClassName}>
      {isOpen ? <span className={appNameClassName}>{appParams?.name}</span> : null}
    </ActionsBarBTN>
  );
}
