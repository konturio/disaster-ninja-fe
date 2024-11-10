import { useMemo } from 'react';
import { compiler } from 'markdown-to-jsx';
import { MarkdownLink } from './MarkdownLink';
import { MarkdownMedia } from './MarkdownMedia';
import { structureMarkdownContent } from './structuredMarkdown';

type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  const markdownOptions = useMemo(
    () => ({
      overrides: {
        a: MarkdownLink,
        img: MarkdownMedia,
        h1: { props: { id: undefined } },
        h2: { props: { id: undefined } },
        h3: { props: { id: undefined } },
        h4: { props: { id: undefined } },
        h5: { props: { id: undefined } },
        h6: { props: { id: undefined } },
      },
      wrapper: null,
    }),
    [],
  );

  const compiled = compiler(content, markdownOptions) as unknown as JSX.Element[];
  return structureMarkdownContent(compiled);
}
