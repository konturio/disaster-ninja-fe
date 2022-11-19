import type { MutableRefObject } from 'react';

export interface PanelProps {
  resizableNode: HTMLDivElement;
  closeCb: () => void;
  minHeight: number;
  getOpenState: () => boolean;
}

export type DynamicDivRef = MutableRefObject<null | HTMLDivElement>;
