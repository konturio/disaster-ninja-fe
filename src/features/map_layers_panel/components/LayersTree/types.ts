import { LogicalLayerAtom } from '../../types';
export interface ICategory {
  id: string;
  isCategory: true;
  children: IGroup[];
}

export interface IGroup {
  id: string;
  isGroup: true;
  children: LogicalLayerAtom[];
}

export type Tree = (ICategory | IGroup | LogicalLayerAtom)[];
