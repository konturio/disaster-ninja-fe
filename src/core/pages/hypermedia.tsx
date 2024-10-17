import { useCallback } from 'react';
import { configRepo } from '~core/config';
import { goTo } from '~core/router/goTo';

export function isExternalLink(href: string) {
  const externalProtocols = ['http://', 'https://', 'mailto:'];
  return externalProtocols.some((protocol) => href.startsWith(protocol));
}

export function isInnerAnchorLink(href: string) {
  // if the hash starts at 0, it means there's no slug and it's an inner anchor link
  return href.indexOf('#') === 0;
}

export function buildAssetUrl(asset: string) {
  return `${configRepo.get().apiGateway}/apps/${configRepo.get().id}/assets/${asset}`;
}

/*
In Markdown overrides, some props must be preserved depending on the type of html element:

a: title, href
img: title, alt, src
input[type="checkbox"]: checked, readonly (specifically, the one rendered by a GFM task list)
ol: start
td: style
th: style
*/

export function CustomImg({
  title,
  alt,
  src,
}: {
  title: string;
  alt: string;
  src: string;
}) {
  let realSrc = src;
  if (!isExternalLink(src)) {
    realSrc = buildAssetUrl(src);
  }
  return <img src={realSrc} alt={alt} title={title} />;
}

export function CustomLink({
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
    // open external links in new window
    return (
      <a title={title} href={href} target="_blank" rel="noreferrer" className="external">
        {children}
      </a>
    );
  }
  // internal link - use router
  return (
    <a title={title} href={href} onClick={handleClick} className="internal">
      {children}
    </a>
  );
}
