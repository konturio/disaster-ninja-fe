import type { AtomSelfBinded } from '@reatom/core';
import type { LayerLegend } from './legends';
import type { LayerMeta } from './meta';
import type { LayerSource } from './source';
import type { LayerSettings } from './settings';
import type { LayerContextMenu } from './contextMenu';

export type LogicalLayerState = Readonly<{
  id: string;
  /* This state means - we need to show this layer */
  isEnabled: boolean;
  /* This state means - we show this layer on map */
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
