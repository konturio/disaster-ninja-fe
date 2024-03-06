import type { AtomSelfBinded } from '@reatom/core-v2';
import type { LayerLegend } from './legends';
import type { LayerMeta } from './meta';
import type { LayerSource } from './source';
import type { LayerSettings } from './settings';
import type { LayerContextMenu } from './contextMenu';
import type { LayerStyle } from './style';
import type { LayerEditor } from './editors';

export type LogicalLayerState = Readonly<{
  id: string;
  /* isEnabled tells if we need to show this layer */
  isEnabled: boolean;
  /* isMounted means the layer is already shown on the map */
  isMounted: boolean;
  isEditable: boolean;
  isVisible: boolean;
  isLoading: boolean;
  isDownloadable: boolean;
  error: null | Error | unknown;
  meta: LayerMeta | null;
  legend: LayerLegend | null;
  settings: LayerSettings | null;
  source: LayerSource | null;
  style: LayerStyle | null;
  contextMenu: LayerContextMenu | null;
  editor: LayerEditor | null;
}>;

export type LogicalLayerActions = {
  enable: () => null;
  disable: () => null;
  hide: () => null;
  show: () => null;
  download: () => null;
  destroy: () => null;
  edit: () => null;
};

export type LayerAtom = AtomSelfBinded<LogicalLayerState, LogicalLayerActions>;

export type LogicalLayerFetcher<T, K = unknown> = (params: K) => Promise<T>;
