import { createAtom } from '~utils/atoms';
import { createLayerDataAtom, LayerDataAtomType } from '~features/create_layer/atoms/createLayerData';
import { createLayerFieldAtom, LayerFieldAtomType } from '~features/create_layer/atoms/createLayerField';
import { CreateLayerModel } from '~features/create_layer/types';
import { apiClient } from '~core/index';
import {
  UpdateCallbackDeleteLayerType,
  UpdateCallbackEditLayerType,
  UpdateCallbackLayersType,
  updateCallbackService,
} from '~core/update_callbacks';
import { layersUserDataAtom } from '~core/logical_layers/atoms/layersUserData';
import { UserDataFieldType } from '~core/logical_layers/types/userData';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';

type CreateLayerAtomStateType = {
  loading: boolean;
  error: string | null;
  data: LayerDataAtomType | null;
};

export const createLayerControllerAtom = createAtom(
  {
    editLayer: (layer: CreateLayerModel) => layer,
    createNewLayer: () => null,
    save: () => null,
    delete: (layerId: string) => layerId,
    reset: () => null,
    _update: (state: CreateLayerAtomStateType) => state,
    editLayerCallback: updateCallbackService.addCallback(UpdateCallbackEditLayerType),
    deleteLayerCallback: updateCallbackService.addCallback(UpdateCallbackDeleteLayerType),
  },
  (
    { onAction, schedule, getUnlistedState, create, onChange },
    state: CreateLayerAtomStateType | null = null,
  ) => {
    onChange('editLayerCallback', (updateState ) => {
      if (updateState?.params?.layerId) {
        const lId = updateState?.params?.layerId as string;
        const dataRegistry = getUnlistedState(layersUserDataAtom);
        if (dataRegistry && dataRegistry.has(lId)) {
          const layerUserData = dataRegistry.get(lId);
          if (layerUserData) {
            schedule((dispatch) => {
              dispatch(create('editLayer', {
                id: lId,
                name: layerUserData?.data?.name || '',
                marker: 'default',
                fields: (layerUserData?.data?.featureProperties
                  && Object.keys(layerUserData?.data?.featureProperties).map(objKey => createLayerFieldAtom({
                    name: objKey,
                    type: layerUserData?.data?.featureProperties[objKey] as UserDataFieldType,
                  })))
                  || []
              }));
            })
          }
        }
      }
    });

    onAction('editLayer', (layer) => {
      state = {
        loading: false,
        error: null,
        data: createLayerDataAtom(layer),
      };
    });

    onAction('createNewLayer', () => {
      state = {
        loading: false,
        error: null,
        data: createLayerDataAtom(),
      };
    });

    onAction('save', () => {
      if (state?.data) {
        const dataState = getUnlistedState(state.data);
        if (!dataState.name) return;

        state = { ...state, loading: true };

        const data = {
          id: dataState.id,
          name: dataState.name,
          featureProperties: dataState.fields.reduce(
            (acc, fldAtom: LayerFieldAtomType) => {
              const fieldState = getUnlistedState(fldAtom);
              if (fieldState.name && fieldState.type !== 'none') {
                acc[fieldState.name] = fieldState.type;
              }
              return acc;
            },
            {} as Record<string, UserDataFieldType>,
          ),
        };

        schedule(async (dispatch) => {
          try {
            let responseData: unknown;
            if (data.id) {
              responseData = await apiClient.put<unknown>(
                `/layers/${data.id}`,
                data,
                true,
              );
            } else {
              responseData = await apiClient.post<unknown>(
                `/layers`,
                data,
                true,
              );
            }

            if (responseData) {
              dispatch(
                create('_update', {
                  loading: false,
                  error: null,
                  data: state?.data || null,
                }),
              );
              updateCallbackService.triggerCallback(UpdateCallbackLayersType);
            }
          } catch (e) {
            dispatch(
              create('_update', {
                loading: false,
                error: e,
                data: state?.data || null,
              }),
            );
          }
        });
      }
    });

    onChange('deleteLayerCallback', (updateState ) => {
      if (updateState?.params?.layerId) {
        const lId = updateState?.params?.layerId as string;
        schedule((dispatch) => {
          dispatch(create('delete', lId));
        });
      }
    });

    onAction('delete', (layerId) => {
      const registeredLayers = getUnlistedState(layersRegistryAtom);
      if (registeredLayers.has(layerId)) {
        schedule(async (dispatch) => {
          try {
            await apiClient.delete<unknown>(
              `/layers/${layerId}`,
              true,
            );
            updateCallbackService.triggerCallback(UpdateCallbackLayersType);
          } catch (e) {
            dispatch(
              create('_update', {
                loading: false,
                error: e,
                data: state?.data || null,
              }),
            );
          }
        });
      }
    });

    onAction('reset', () => {
      if (state) {
        state = null;
      }
    });

    onAction('_update', (st) => {
      state = st;
    });

    return state;
  },
  'createLayerControllerAtom',
);
