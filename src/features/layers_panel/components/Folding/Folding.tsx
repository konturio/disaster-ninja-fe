import { PropsWithChildren, useState } from 'react';
import { FoldingWrap } from '~components/FoldingWrap/FoldingWrap';
import s from './Folding.module.css';

export function Folding({
  title,
  children,
  open,
}: PropsWithChildren<{ title: JSX.Element; open: boolean }>) {
  return (
    <FoldingWrap
      title={title}
      open={open}
      childrenWithIndent={false}
      onStateChange={(s) => null}
    >
      <div className={s.foldingChildren}>{children}</div>
    </FoldingWrap>
  );
}
