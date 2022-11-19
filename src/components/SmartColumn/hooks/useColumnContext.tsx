import { useContext, createContext } from 'react';
import type { Resizer } from '../Resizer';

export const ColumnContext = createContext<Resizer | null>(null);

export function useColumnContext() {
  return useContext(ColumnContext);
}
