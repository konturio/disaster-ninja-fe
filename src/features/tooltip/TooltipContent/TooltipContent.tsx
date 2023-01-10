import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';
import { Close16 } from '@konturio/default-icons';
import { parseLinksAsTags } from '~utils/markdown/parser';
import { LinkRenderer } from '~components/LinkRenderer/LinkRenderer';
import s from './TooltipContent.module.css';
import type { PropsWithChildren } from 'react';

export function TooltipContent({
  children,
  onClose,
  className,
}: PropsWithChildren<{
  onClose?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
}>) {
  return (
    <div className={clsx(s.tooltipContent, className)}>
      {typeof children === 'string' ? (
        <ReactMarkdown components={{ a: LinkRenderer }} className={s.markdown}>
          {parseLinksAsTags(children)}
        </ReactMarkdown>
      ) : (
        children
      )}
      {onClose && (
        <div className={s.closeIcon} onClick={onClose}>
          <Close16 />
        </div>
      )}
    </div>
  );
}
