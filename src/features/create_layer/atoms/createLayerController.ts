import { createAtom } from '~utils/atoms';
import {
  createLayerDataAtom,
  LayerDataAtomType,
} from '~features/create_layer/atoms/createLayerData';
import { LayerFieldAtomType } from '~features/create_layer/atoms/createLayerField';
import { LayerFieldType } from '~features/create_layer/types';
import { apiClient } from '~core/index';
import {
  UpdateCallbackEditLayerType,
  UpdateCallbackLayersType,
  updateCallbackService,
} from '~core/update_callbacks';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';

type CreateLayerAtomStateType = {
  loading: boolean;
  error: string | null;
  data: LayerDataAtomType | null;
};

export const createLayerControllerAtom = createAtom(
  {
    editLayer: (id: number) => id,
    createNewLayer: () => null,
    save: () => null,
    reset: () => null,
    _update: (state: CreateLayerAtomStateType) => state,
    editLayerCallback: updateCallbackService.addCallback(UpdateCallbackEditLayerType),
  },
  (
    { onAction, schedule, getUnlistedState, create, onChange },
    state: CreateLayerAtomStateType | null = null,
  ) => {
    onChange('editLayerCallback', (updateState ) => {
      if (updateState?.params?.layerId) {
        const lId = updateState?.params?.layerId as string;
        const lRegistry = getUnlistedState(layersRegistryAtom);
        if (lRegistry && lRegistry.has(lId)) {
          const layerAtom = lRegistry.get(lId);
          if (layerAtom) {
            console.log('layer', getUnlistedState(layerAtom));
          }
        }
        // schedule((dispatch) => {
        //   dispatch(create('editLayer', updateState?.params?.layerId as number));
        // })
      }
    });

    onAction('editLayer', (id) => {
      const dataAtom = createLayerDataAtom({
        id: 1,
        name: 'test',
        marker: 'default',
        fields: [],
      });

      state = {
        loading: false,
        error: null,
        data: dataAtom,
      };
    });

    onAction('createNewLayer', () => {
      const dataAtom = createLayerDataAtom();

      state = {
        loading: false,
        error: null,
        data: dataAtom,
      };
    });

    onAction('save', () => {
      if (state?.data) {
        const dataState = getUnlistedState(state.data);
        if (!dataState.name) return;

        state = { ...state, loading: true };

        const data = {
          name: dataState.name,
          featureProperties: dataState.fields.reduce(
            (acc, fldAtom: LayerFieldAtomType) => {
              const fieldState = getUnlistedState(fldAtom);
              if (fieldState.name && fieldState.type !== 'none') {
                acc[fieldState.name] = fieldState.type;
              }
              return acc;
            },
            {} as Record<string, LayerFieldType>,
          ),
        };

        schedule(async (dispatch) => {
          try {
            const responseData = await apiClient.post<unknown>(
              `/layers`,
              data,
              true,
            );

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
