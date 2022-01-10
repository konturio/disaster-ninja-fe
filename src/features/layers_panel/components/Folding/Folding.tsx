import { PropsWithChildren, useState } from 'react';
import { FoldingWrap } from '~components/FoldingWrap/FoldingWrap';
import s from './Folding.module.css';

export function Folding({
  label,
  children,
  open,
}: PropsWithChildren<{ label: JSX.Element; open: boolean }>) {
  return (
    <FoldingWrap
      label={label}
      open={open}
      childrenWithIndent={false}
      onStateChange={(s) => null}
    >
      <div className={s.foldingChildren}>{children}</div>
    </FoldingWrap>
  );
}
