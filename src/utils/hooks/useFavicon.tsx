import { useEffect } from 'react';
import { transformIconLink } from '~utils/common';

export function useFavicon(iconPath?: string) {
  // change tab icon (not expected to work in Safari https://stackoverflow.com/questions/63781987/cant-change-favicon-with-javascript-in-safari)
  useEffect(() => {
    if (!iconPath) return;
    const iconLink = transformIconLink(iconPath);

    const linkElements = document.querySelectorAll(
      "link[rel~='icon']",
    ) as NodeListOf<HTMLLinkElement>;

    linkElements.forEach((linkEl) => {
      linkEl.href = iconLink;
    });
  }, [iconPath]);
}
