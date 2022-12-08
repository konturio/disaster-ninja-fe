import { useEffect } from 'react';
import app_config from '~core/app_config';
import { trimLinkIfInDev } from '~utils/common';

export function useBrowserTabUpdateEffect(iconPath?: string) {
  // change tab icon (not expected to work in Safari https://stackoverflow.com/questions/63781987/cant-change-favicon-with-javascript-in-safari)
  useEffect(() => {
    if (!iconPath) return;
    const link = trimLinkIfInDev(app_config.isDevBuild, iconPath);
    const linkElements = document.querySelectorAll(
      "link[rel~='icon']",
    ) as NodeListOf<HTMLLinkElement>;
    linkElements.forEach((linkEl) => {
      // keep url icons versions
      const linkUrl = new URL(linkEl.href);
      linkUrl.pathname = link!;
      linkEl.href = linkUrl.pathname + linkUrl.search;
    });
  }, [iconPath]);
}
