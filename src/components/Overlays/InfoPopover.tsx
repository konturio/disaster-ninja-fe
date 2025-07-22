import { InfoOutline16 } from '@konturio/default-icons';
import clsx from 'clsx';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { MarkdownContent } from './MarkdownContent';
import s from './Overlays.module.css';

export function InfoPopover({
  content,
  className,
  ...restProps
}: { content: React.ReactNode } & React.ComponentProps<'button'>) {
  const overlayContent =
    typeof content === 'string' ? <MarkdownContent content={content} /> : content;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={clsx(s.InfoPopoverTrigger, className)}
          type="button"
          aria-label="More information"
          {...restProps}
        >
          <InfoOutline16 />
        </button>
      </PopoverTrigger>
      <PopoverContent>{overlayContent}</PopoverContent>
    </Popover>
  );
}
