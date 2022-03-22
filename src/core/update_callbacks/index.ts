import { createAtom } from '~utils/atoms';

export const UpdateCallbackAnalyticsType = 'UpdateAnalytics';
export const UpdateCallbackAdvancedAnalyticsType = 'UpdateAdvancedAnalytics';
export const UpdateCallbackEventsType = 'UpdateEvents';
export const UpdateCallbackLegendType = 'UpdateLegend';
export const UpdateCallbackLayersType = 'UpdateLayers';
export const UpdateCallbackLayersLoading = 'LayersLoading';
export const UpdateCallbackEditLayerType = 'EditLayer';
export const UpdateCallbackEditFeaturesType = 'EditFeatures';
export const UpdateCallbackDeleteLayerType = 'DeleteLayer';

export type UpdateCallbackType =
  | typeof UpdateCallbackAnalyticsType
  | typeof UpdateCallbackAdvancedAnalyticsType
  | typeof UpdateCallbackEventsType
  | typeof UpdateCallbackLegendType
  | typeof UpdateCallbackLayersType
  | typeof UpdateCallbackEditLayerType
  | typeof UpdateCallbackEditFeaturesType
  | typeof UpdateCallbackDeleteLayerType
  | typeof UpdateCallbackLayersLoading;

export type CallbackAtomParams = Record<string, unknown>;
export type CallbackAtomState = {
  params?: CallbackAtomParams;
};

const createCallbackAtom = () =>
  createAtom(
    {
      update: (params?: CallbackAtomParams) => params,
    },
    ({ onAction }, state: CallbackAtomState = {}) => {
      onAction('update', (params?) => {
        if (params) {
          state = { params };
        } else {
          state = {};
        }
      });

      return state;
    },
  );

export type CallbackAtomType = ReturnType<typeof createCallbackAtom>;

class UpdateCallbackService {
  private _callbacks: Partial<Record<UpdateCallbackType, CallbackAtomType>> =
    {};

  public addCallback(type: UpdateCallbackType): CallbackAtomType {
    if (!this._callbacks[type]) {
      this._callbacks[type] = createCallbackAtom();
    }

    // @ts-ignore
    return this._callbacks[type];
  }

  public removeCallbacksOfType(type: UpdateCallbackType) {
    if (this._callbacks[type]) {
      delete this._callbacks[type];
    }
  }

  public triggerCallback(type: UpdateCallbackType, params?: CallbackAtomParams) {
    if (this._callbacks[type]) {
      this._callbacks[type]?.update.dispatch(params);
    }
  }
}

export const updateCallbackService = new UpdateCallbackService();
