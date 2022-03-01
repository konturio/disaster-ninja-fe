import { Atom } from '@reatom/core';
import type {
  LogicalLayerRenderer,
  NotNullableMap,
  NullableMap,
  CommonHookArgs,
} from '../types/renderer';

export class LogicalLayerDefaultRenderer<T = Atom>
  implements LogicalLayerRenderer<T>
{
  setupExtension(atom: T) {
    return;
  }
  willInit(args: NullableMap & CommonHookArgs) {
    return;
  }
  willMount(args: NotNullableMap & CommonHookArgs) {
    return;
  }
  willUnMount(args: NotNullableMap & CommonHookArgs) {
    return;
  }
  willHide(args: NotNullableMap & CommonHookArgs) {
    return;
  }
  willUnhide(args: NotNullableMap & CommonHookArgs) {
    return;
  }
  willLegendUpdate(args: NotNullableMap & CommonHookArgs) {
    return;
  }
  willSourceUpdate(args: NotNullableMap & CommonHookArgs) {
    return;
  }
  willDestroy(args: NullableMap & CommonHookArgs) {
    return;
  }
}
