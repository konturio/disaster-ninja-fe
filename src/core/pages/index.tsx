import { useId, useMemo } from 'react';
import Markdown, { RuleType } from 'markdown-to-jsx';
import usePromise from 'react-promise-suspense';
import { getAsset } from '~core/api/assets';
import { Article } from '~components/Layout';
import { splitTextIntoSections } from './utils';
import { CustomImg, CustomLink } from './hypermedia';

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
  return (
    <Markdown
      options={{
        overrides: {
          a: CustomLink,
          img: CustomImg,
        },
      }}
    >
      {data}
    </Markdown>
  );
}
