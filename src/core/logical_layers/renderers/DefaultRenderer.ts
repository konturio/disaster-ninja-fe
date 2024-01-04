import type { Atom } from '@reatom/core-v2';
import type {
  LogicalLayerRenderer,
  NotNullableMap,
  NullableMap,
  CommonHookArgs,
} from '../types/renderer';

export class LogicalLayerDefaultRenderer<T = Atom> implements LogicalLayerRenderer<T> {
  private errorSetter = (e: Error) => {
    console.warn(
      'Hook for renderer errors not installed. You must add it in logical layer by setErrorState method',
    );
  };

  /** Call it in renderer */
  protected onError = (e: unknown) => {
    if (e instanceof Error) {
      this.errorSetter(e);
    } else if (typeof e === 'string') {
      this.errorSetter(new Error(e));
    } else {
      this.errorSetter(new Error('unknown'));
    }
  };

  /** Call it in logical layer atom */
  setErrorState(cb: (e: Error) => void) {
    this.errorSetter = cb;
  }

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
