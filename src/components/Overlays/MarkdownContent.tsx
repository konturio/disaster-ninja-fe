import { useMemo, type FC } from 'react';
import Markdown from 'markdown-to-jsx';
import { parseLinksAsTags } from '~utils/markdown/parser';
import { LinkRenderer } from '~components/LinkRenderer/LinkRenderer';
import s from './Overlays.module.css';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export const MarkdownContent: FC<MarkdownContentProps> = ({ content, className }) => {
  const parsed = useMemo(() => parseLinksAsTags(content), [content]);

  return (
    <Markdown
      options={{ overrides: { a: LinkRenderer } }}
      className={className || s.markdown}
    >
      {parsed}
    </Markdown>
  );
};
