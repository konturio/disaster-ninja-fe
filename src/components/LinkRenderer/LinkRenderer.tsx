import { memo } from 'react';
import s from './LinkRenderer.module.css';

// types expected by react-markdown library
type ElementWrapProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export const LinkRenderer = memo(function (props: ElementWrapProps) {
  return (
    <a href={props.href} target="_blank" rel="noreferrer" onClick={stopPropagation}>
      {props.children}
    </a>
  );
});

// 192 and 12 are the values proposed by the task #8798
export function ShortLinkRenderer({
  children: linksArr,
  maxWidth = 192,
  truncateAmount = 12,
  href,
}: ElementWrapProps & { maxWidth?: number; truncateAmount?: number }) {
  const style = { maxWidth: maxWidth || 'unset' };
  // react-markdown passes links like that ['link'].
  // If several links were provided in .md source like [label1](link1)[label2](link2)
  // still each one of them would have it's own wrapper
  const passedLink: string | undefined = linksArr?.[0];
  const truncatedData = passedLink?.slice(-truncateAmount);
  return (
    <div className={s.linkWidthWrap} style={style}>
      <div className={s.linkOverflowWrap}>
        <a
          className={s.link}
          target="_blank"
          rel="noreferrer"
          data-truncate={truncatedData}
          href={href}
        >
          {passedLink}
        </a>
      </div>
    </div>
  );
}

function stopPropagation(e) {
  e.stopPropagation();
}

LinkRenderer.displayName = 'LinkRenderer';
