import { useId, useMemo } from 'react';
import { compiler } from 'markdown-to-jsx';
import usePromise from 'react-promise-suspense';
import { getAsset } from '~core/api/assets';
import { Article } from '~components/Layout';
import { CustomImg, CustomLink } from './hypermedia';
import { structureMarkdownContent } from './structuredMarkdown';

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

type PagesDocumentElementProps = {
  data: string;
  className?: string;
};

function CssElement({ data }: PagesDocumentElementProps) {
  return <style>{data}</style>;
}

function MarkdownElement({ data }: PagesDocumentElementProps) {
  const compiled = compiler(data, {
    overrides: {
      a: CustomLink,
      img: CustomImg,
      // prevent id/slug generation in h1-h6 tags
      h1: { component: 'h1', props: { id: undefined } },
      h2: { component: 'h2', props: { id: undefined } },
      h3: { component: 'h3', props: { id: undefined } },
      h4: { component: 'h4', props: { id: undefined } },
      h5: { component: 'h5', props: { id: undefined } },
      h6: { component: 'h6', props: { id: undefined } },
    },
    wrapper: null,
  }) as unknown as JSX.Element[];

  const structuredContent = structureMarkdownContent(compiled);
  return <div className="app-pages-element-markdown">{structuredContent}</div>;
}
