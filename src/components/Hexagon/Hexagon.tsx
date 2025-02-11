import s from './Hexagon.module.css';
import type { ReactNode } from 'react';

type HexagonProps = {
  children?: ReactNode;
  color: string;
};

export const Hexagon = ({ color, children }: HexagonProps) => {
  return (
    <div className={s.hexagon}>
      <div style={{ background: color }}>{children}</div>
    </div>
  );
};
