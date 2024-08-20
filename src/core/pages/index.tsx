import { useCallback, useId, useMemo } from 'react';
import Markdown from 'markdown-to-jsx';
import usePromise from 'react-promise-suspense';
import { goTo } from '~core/router/goTo';
import { getAsset } from '~core/api/assets';
import { Article } from '~components/Layout';
import { configRepo } from '~core/config';
import { isExternalLink, splitTextIntoSections } from './utils';

type PagesDocumentElement = {
  type: 'css' | 'md';
  url?: string;
  data?: string;
};

type ResolvedPagesDocumentElement = PagesDocumentElement & { data: string };

const PagesDocumentElementRenderers = {
  css: CssElement,
  md: MarkdownElement,
};

function fetchPagesDocument(
  doc: PagesDocumentElement[],
): Promise<ResolvedPagesDocumentElement[]> {
  return Promise.all(
    doc.map((element) => {
      if (element.url) {
        return getAsset(element.url).then((res) => {
          return { ...element, data: res as string };
        });
      } else return { ...element, data: element.data || '' };
    }),
  );
}

type PagesDocumentProps = {
  doc: PagesDocumentElement[];
  wrapperComponent?: React.ComponentType<React.PropsWithChildren<unknown>>;
};

export function PagesDocument({ doc, wrapperComponent = Article }: PagesDocumentProps) {
  const memoizedDoc = useMemo(() => doc, [doc]);
  const data = usePromise(fetchPagesDocument, [memoizedDoc]);
  return <PagesDocumentRenderer doc={data} wrapperComponent={wrapperComponent} />;
}

type ResolvedPagesDocumentProps = {
  doc: (PagesDocumentElement & { data: string })[];
  wrapperComponent?: React.ComponentType<React.PropsWithChildren<unknown>>;
};

export function PagesDocumentRenderer({
  doc,
  wrapperComponent: WrapperComponent = Article,
}: ResolvedPagesDocumentProps) {
  const id = useId();
  return (
    <WrapperComponent>
      {doc.map((e, idx) => {
        if (PagesDocumentElementRenderers.hasOwnProperty(e.type)) {
          const Component = PagesDocumentElementRenderers[e.type];
          return Component ? <Component key={`${id}-${idx}`} data={e.data} /> : null;
        }
        return null;
      })}
    </WrapperComponent>
  );
}

type PagesDocumentElementProps = { data: string };

function CssElement({ data }: PagesDocumentElementProps) {
  return <style>{data}</style>;
}

function MarkdownElement({ data }: PagesDocumentElementProps) {
  const sections = splitTextIntoSections(data);

  return (
    <div>
      {sections.map((section, index) => {
        const [sectionName, sectionText] = section;
        return (
          <section key={sectionName + index} className={sectionName}>
            <Markdown
              options={{
                overrides: {
                  a: CustomLink,
                  img: CustomImg,
                },
              }}
            >
              {sectionText}
            </Markdown>
          </section>
        );
      })}
    </div>
  );
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

function CustomImg({ title, alt, src }: { title: string; alt: string; src: string }) {
  let realSrc = src;
  if (!isExternalLink(src)) {
    realSrc = buildAssetUrl(src);
  }
  return <img src={realSrc} alt={alt} title={title} />;
}

function buildAssetUrl(asset: string) {
  return `${configRepo.get().apiGateway}/apps/${configRepo.get().id}/assets/${asset}`;
}

function CustomLink({
  children,
  href,
  title,
}: React.PropsWithChildren<{ href: string; title: string }>) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
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
