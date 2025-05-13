import Markdown from 'markdown-to-jsx';
import { InfoOutline16 } from '@konturio/default-icons';
import { parseLinksAsTags } from '~utils/markdown/parser';
import { LinkRenderer } from '~components/LinkRenderer/LinkRenderer';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import s from './Overlays.module.css';

export function InfoPopover({
  content,
  ...props
}: { content: React.ReactNode } & React.ComponentProps<'button'>) {
  const overlayContent =
    typeof content === 'string' ? (
      <Markdown options={{ overrides: { a: LinkRenderer } }} className={s.markdown}>
        {parseLinksAsTags(content)}
      </Markdown>
    ) : (
      content
    );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={s.InfoPopoverTrigger}
          type="button"
          aria-label="More information"
          {...props}
        >
          <InfoOutline16 />
        </button>
      </PopoverTrigger>
      <PopoverContent>{overlayContent}</PopoverContent>
    </Popover>
  );
}
