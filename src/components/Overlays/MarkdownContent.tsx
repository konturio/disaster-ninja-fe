import { useMemo, memo, type FC } from 'react';
import Markdown from 'markdown-to-jsx';
import clsx from 'clsx';
import { parseLinksAsTags } from '~utils/markdown/parser';
import { LinkRenderer } from '~components/LinkRenderer/LinkRenderer';
import s from './Overlays.module.css';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export const MarkdownContent: FC<MarkdownContentProps> = memo(function MarkdownContent({
  content,
  className,
}) {
  const parsed = useMemo(() => parseLinksAsTags(content), [content]);

  return (
    <Markdown
      options={{ overrides: { a: LinkRenderer } }}
      className={clsx(s.markdown, className)}
    >
      {parsed}
    </Markdown>
  );
});
