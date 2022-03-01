import { AtomSelfBinded } from '@reatom/core';
import { LayerLegend } from './legends';
import { LayerMeta } from './meta';
import { LayerSource } from './source';
import { LayerSettings } from './settings';

export type LogicalLayerState = Readonly<{
  id: string;
  isEnabled: boolean;
  isMounted: boolean;
  isVisible: boolean;
  isLoading: boolean;
  isDownloadable: boolean;
  error: null | Error | unknown;
  meta: LayerMeta | null;
  legend: LayerLegend | null;
  settings: LayerSettings | null;
  source: LayerSource | null;
}>;

export type LogicalLayerActions = {
  enable: () => null;
  disable: () => null;
  hide: () => null;
  show: () => null;
  download: () => null;
  destroy: () => null;
};

export type LayerAtom = AtomSelfBinded<LogicalLayerState, LogicalLayerActions>;

export type LogicalLayerFetcher<T, K = unknown> = (params: K) => Promise<T>;
