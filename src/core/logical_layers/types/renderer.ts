import { Atom } from '@reatom/core';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { LogicalLayerState } from './logicalLayer';

export type NullableMap = {
  map: ApplicationMap | null;
};

export type NotNullableMap = {
  map: ApplicationMap;
};

export type CommonHookArgs = {
  state: LogicalLayerState;
};

export interface LogicalLayerRenderer<T = any> {
  setupExtension: (extensionAtom: T) => void;
  willInit: (args: NullableMap & CommonHookArgs) => void;
  willMount: (args: NotNullableMap & CommonHookArgs) => void;
  willUnMount: (args: NotNullableMap & CommonHookArgs) => void;
  willHide: (args: NotNullableMap & CommonHookArgs) => void;
  willUnhide: (args: NotNullableMap & CommonHookArgs) => void;
  willLegendUpdate: (args: NotNullableMap & CommonHookArgs) => void;
  willSourceUpdate: (args: NotNullableMap & CommonHookArgs) => void;
  willDestroy: (args: NullableMap & CommonHookArgs) => void;
}
