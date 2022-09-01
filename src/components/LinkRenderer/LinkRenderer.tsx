import { memo } from 'react';

export const LinkRenderer = memo(function (props: any) {
  return (
    <a href={props.href} target="_blank" rel="noreferrer" onClick={stopPropagation}>
      {props.children}
    </a>
  );
});
function stopPropagation(e) {
  e.stopPropagation();
}

LinkRenderer.displayName = 'LinkRenderer';
