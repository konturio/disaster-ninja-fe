import React from 'react';
import Markdown from 'markdown-to-jsx';
import { parseLinksAsTags } from '~utils/markdown/parser';
import { LinkRenderer } from '~components/LinkRenderer/LinkRenderer';
import s from './Overlays.module.css';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <Markdown
      options={{ overrides: { a: LinkRenderer } }}
      className={className || s.markdown}
    >
      {parseLinksAsTags(content)}
    </Markdown>
  );
}
