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
export function getShortLinkRenderer(
  maxWidth: number | null = 192,
  truncateAmount = 12,
) {
  return function ShortLinkRenderer({ children: linkArr }: ElementWrapProps) {
    const style = { maxWidth: maxWidth || 'unset' };
    return (
      <div className={s.linkWidthWrap} style={style}>
        <div className={s.linkOverflowWrap}>
          <a
            className={s.link}
            target="_blank"
            rel="noreferrer"
            data-truncate={linkArr?.[0].slice(-truncateAmount)}
          >
            {linkArr?.[0]}
          </a>
        </div>
      </div>
    );
  };
}

function stopPropagation(e) {
  e.stopPropagation();
}

LinkRenderer.displayName = 'LinkRenderer';
