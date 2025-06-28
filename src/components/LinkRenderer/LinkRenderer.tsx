import { memo } from 'react';
import s from './LinkRenderer.module.css';
import { splitTail } from './splitTail';

// types expected by react-markdown library
type ElementWrapProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export const LinkRenderer = memo(function (props: ElementWrapProps) {
  let href = props.href;
  if (href && !/^[a-zA-Z]+:\/\//.test(href)) {
    href = `https://${href}`;
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" onClick={stopPropagation}>
      {props.children}
    </a>
  );
});

// 190 and 12 are the values proposed by the task #8798
export function ShortLinkRenderer({
  children: linksArr,
  maxWidth = 190,
  truncateAmount = 12,
  href,
}: ElementWrapProps & { maxWidth?: number; truncateAmount?: number }) {
  // react-markdown passes links like that ['link'].
  // If several links were provided in .md source like [label1](link1)[label2](link2)
  // still each one of them would have it's own wrapper
  const passedLink: string = linksArr?.[0] ?? href;
  const [leftPart, rightPart] = splitTail(passedLink, truncateAmount);
  return (
    <div className={s.linkWidthWrap}>
      <div className={s.linkOverflowWrap}>
        <a
          className={s.link}
          target="_blank"
          rel="noreferrer"
          data-truncate={rightPart}
          href={href}
        >
          <span className={s.truncate} style={{ maxWidth: maxWidth || 'unset' }}>
            {leftPart}
          </span>
          <span className={s.tail}>{rightPart}</span>
        </a>
      </div>
    </div>
  );
}

function stopPropagation(e) {
  e.stopPropagation();
}

LinkRenderer.displayName = 'LinkRenderer';
