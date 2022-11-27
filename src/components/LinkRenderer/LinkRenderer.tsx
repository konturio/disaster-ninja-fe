import { memo } from 'react';
import s from './LinkRenderer.module.css';

// types from react-markdown expected types
type ReactMemoElementWrapProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export const LinkRenderer = memo(function (props: ReactMemoElementWrapProps) {
  return (
    <a href={props.href} target="_blank" rel="noreferrer" onClick={stopPropagation}>
      {props.children}
    </a>
  );
});

export const LinkRendererShort = memo(function ({
  children: linkArr,
}: ReactMemoElementWrapProps) {
  return (
    <div className={s.linkWidthWrap}>
      <div className={s.linkOverflowWrap}>
        <a
          className={s.link}
          target="_blank"
          rel="noreferrer"
          data-truncate={linkArr?.[0].slice(-12)}
        >
          {linkArr?.[0]}
        </a>
      </div>
    </div>
  );
});

LinkRenderer.displayName = 'LinkRenderer';
LinkRendererShort.displayName = 'LinkRendererShort';

function stopPropagation(e) {
  e.stopPropagation();
}
