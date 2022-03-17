import { createAtom } from '~utils/atoms';

export const UpdateCallbackAnalyticsType = 'UpdateAnalytics';
export const UpdateCallbackAdvancedAnalyticsType = 'UpdateAdvancedAnalytics';
export const UpdateCallbackEventsType = 'UpdateEvents';
export const UpdateCallbackLegendType = 'UpdateLegend';
export const UpdateCallbackLayersType = 'UpdateLayers';

export type UpdateCallbackType =
  | typeof UpdateCallbackAnalyticsType
  | typeof UpdateCallbackAdvancedAnalyticsType
  | typeof UpdateCallbackEventsType
  | typeof UpdateCallbackLegendType
  | typeof UpdateCallbackLayersType;

const createCallbackAtom = () =>
  createAtom(
    {
      update: () => null,
    },
    ({ onAction }, state = {}) => {
      onAction('update', () => {
        state = {};
      });

      return state;
    },
  );

export type CallbackAtomType = ReturnType<typeof createCallbackAtom>;

class UpdateCallbackService {
  private _callbacks: Partial<Record<UpdateCallbackType, CallbackAtomType[]>> =
    {};

  public addCallback(type: UpdateCallbackType): CallbackAtomType {
    if (!this._callbacks[type]) {
      this._callbacks[type] = [];
    }
    const callbackAtom = createCallbackAtom();
    this._callbacks[type]?.push(callbackAtom);
    return callbackAtom;
  }

  public removeCallbacksOfType(type: UpdateCallbackType) {
    if (this._callbacks[type]) {
      delete this._callbacks[type];
    }
  }

  public triggerCallback(type: UpdateCallbackType) {
    if (this._callbacks[type]) {
      this._callbacks[type]?.forEach((clbAtom) => {
        clbAtom.update.dispatch();
      });
    }
  }
}

export const updateCallbackService = new UpdateCallbackService();
