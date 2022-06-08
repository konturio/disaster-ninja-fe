import type { AtomSelfBinded } from '@reatom/core';
import type { LayerLegend } from './legends';
import type { LayerMeta } from './meta';
import type { LayerSource } from './source';
import type { LayerSettings } from './settings';
import type { LayerContextMenu } from './contextMenu';

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
  contextMenu: LayerContextMenu | null;
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
