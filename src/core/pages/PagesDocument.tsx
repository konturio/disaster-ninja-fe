import { useMemo } from 'react';
import usePromise from 'react-promise-suspense';
import { getAsset } from '~core/api/assets';
import { Article } from '~components/Layout';
import { MarkdownContent } from './MarkdownContent';

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
  wrapperComponent?: React.ComponentType<{ id: string; children?: React.ReactNode }>;
  id: string;
};

type PagesDocumentElementProps = {
  data: string;
  className?: string;
};

function CssElement({ data }: PagesDocumentElementProps) {
  return <style>{data}</style>;
}

function MarkdownElement({ data }: PagesDocumentElementProps) {
  return (
    <div className="app-pages-element-markdown">
      <MarkdownContent content={data} />
    </div>
  );
}

export function PagesDocument({
  doc,
  wrapperComponent: Wrapper = Article,
  id,
}: PagesDocumentProps) {
  const memoizedDoc = useMemo(() => doc, [doc]);
  const data = usePromise(fetchPagesDocument, [memoizedDoc]);

  return (
    <Wrapper id={`app-pages-docid-${id}`}>
      {data.map((element, index) => {
        const Renderer = PagesDocumentElementRenderers[element.type];
        return <Renderer key={index} {...element} />;
      })}
    </Wrapper>
  );
}

export type { PagesDocumentElement, PagesDocumentProps };
