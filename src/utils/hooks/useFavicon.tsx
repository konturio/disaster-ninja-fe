import { createElement, useEffect } from 'react';
import { transformIconLink } from '~utils/common';

export function useFavicon(iconPath?: string) {
  // change tab icon (not expected to work in Safari https://stackoverflow.com/questions/63781987/cant-change-favicon-with-javascript-in-safari)
  useEffect(() => {
    if (!iconPath) return;
    const iconLink = transformIconLink(iconPath);

    const linkElement = document.createElement('link');
    linkElement.type = 'image/svg+xml';
    linkElement.rel = 'icon';
    linkElement.href = iconLink;
    document.head.appendChild(linkElement);
  }, [iconPath]);
}
