import { useCallback } from 'react';
import { goTo } from '~core/router/goTo';
import { isInnerAnchorLink, isExternalLink } from './linkUtils';

export function MarkdownLink({
  children,
  href,
  title,
}: React.PropsWithChildren<{ href: string; title: string }>) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      /* HACK: don't prevent default behavior for anchor links inside current page.
        Anchor links to different pages are currently broken for both router and default browser navigation. */
      if (isInnerAnchorLink(href)) {
        return;
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
