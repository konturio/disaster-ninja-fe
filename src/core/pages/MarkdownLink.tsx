import { useCallback } from 'react';
import { goTo } from '~core/router/goTo';
import { openIntercomChat } from '~features/intercom';
import { isInnerAnchorLink, isExternalLink } from './linkUtils';

type AppProtocolHandler = (url: URL) => void;

const appProtocolHandlers: Record<string, AppProtocolHandler> = {
  intercom: () => openIntercomChat(),
  // Add more handlers here:
  // someCommand: (url) => { /* handle someCommand */ },
};

function handleAppProtocol(url: URL) {
  const handler = appProtocolHandlers[url.hostname];
  if (handler) {
    handler(url);
    return true;
  }
  console.warn(`Unknown app protocol handler: ${url.hostname}`);
  return false;
}

export function MarkdownLink({
  children,
  href,
  title,
}: React.PropsWithChildren<{ href: string; title: string }>) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isInnerAnchorLink(href)) {
        return;
      }

      try {
        const url = new URL(href);
        if (url.protocol === 'app:') {
          handleAppProtocol(url);
          e.preventDefault();
          return;
        }
      } catch {
        // Invalid URL, proceed with normal navigation
      }

      goTo(href);
      e.preventDefault();
    },
    [href],
  );

  if (isExternalLink(href)) {
    return (
      <a title={title} href={href} target="_blank" rel="noreferrer" className="external">
        {children}
      </a>
    );
  }

  return (
    <a title={title} href={href} onClick={handleClick} className="internal">
      {children}
    </a>
  );
}
