import { configRepo } from '~core/config';
import { apiClient } from '~core/apiClientInstance';
import { createAtom } from '~utils/atoms';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { EditTargets, TEMPORARY_USER_LAYER_LEGEND } from '../constants';
import { createLayerEditorFormAtom } from './layerEditorForm';
import { createLayerEditorFormFieldAtom } from './layerEditorFormField';
import { editableLayerSettingsAtom } from './editableLayerSettings';
import { editTargetAtom } from './editTarget';
import { editableLayersListResource } from './editableLayersListResource';
import type { LayerEditorFormFieldAtomType } from './layerEditorFormField';
import type { LayerEditorFormAtomType } from './layerEditorForm';
import type {
  EditableLayerFieldType,
  EditableLayers,
  LayerEditorFormModel,
} from '../types';

type EditableLayerAtomStateType = {
  loading: boolean;
  error: string | null;
  data: LayerEditorFormAtomType | null;
};

export const editableLayerControllerAtom = createAtom(
  {
    editForm: (form: LayerEditorFormModel) => form,
    editLayer: (layerId: string) => layerId,
    deleteLayer: (layerId: string) => layerId,
    createNewLayer: () => null,
    saveLayer: () => null,
    delete: (formId: string) => formId,
    reset: () => null,
    _update: (state: EditableLayerAtomStateType) => state,
  },
  (
    { onAction, schedule, getUnlistedState, create },
    state: EditableLayerAtomStateType | null = null,
  ) => {
    onAction('createNewLayer', () => {
      state = {
        loading: false,
        error: null,
        data: createLayerEditorFormAtom(),
      };
      schedule((dispatch) => {
        dispatch(editTargetAtom.set({ type: 'layer' }));
      });
    });

    onAction('editLayer', (layerId) => {
      const dataRegistry = getUnlistedState(editableLayerSettingsAtom);
      const layerUserData = dataRegistry?.get(layerId);
      if (layerUserData) {
        schedule((dispatch) => {
          const form: LayerEditorFormModel = {
            id: layerId,
            name: layerUserData.name ?? '',
            marker: 'default' as const,
            fields: Object.entries(layerUserData.featureProperties).map(([name, type]) =>
              createLayerEditorFormFieldAtom({ name, type }),
            ),
          };
          dispatch([
            editTargetAtom.set({
              type: EditTargets.layer,
              layerId,
            }),
            create('editForm', form),
          ]);
        });
      }
    });

    onAction('editForm', (form) => {
      state = {
        loading: false,
        error: null,
        data: createLayerEditorFormAtom(form),
      };
    });

    onAction('saveLayer', () => {
      if (state?.data) {
        const dataState = getUnlistedState(state.data);
        if (!dataState.name) return;

        state = { ...state, loading: true };

        const data = {
          id: dataState.id,
          name: dataState.name,
          legend: {
            name: dataState.name,
            ...TEMPORARY_USER_LAYER_LEGEND,
          },
          featureProperties: dataState.fields.reduce(
            (acc, fldAtom: LayerEditorFormFieldAtomType) => {
              const fieldState = getUnlistedState(fldAtom);
              if (fieldState.name && fieldState.type !== 'none') {
                acc[fieldState.name] = fieldState.type;
              }
              return acc;
            },
            {} as Record<string, EditableLayerFieldType>,
          ),
        };

        // @ts-expect-error temporary code
        data.appId = configRepo.get().id;

        schedule(async (dispatch) => {
          try {
            let responseData: EditableLayers | null;
            if (data.id) {
              responseData = await apiClient.put<EditableLayers>(
                `/layers/${data.id}`,
                data,
                true,
              );
            } else {
              responseData = await apiClient.post<EditableLayers>(`/layers`, data, true);
            }

            if (responseData) {
              dispatch([
                create('_update', {
                  loading: false,
                  error: null,
                  data: state?.data ?? null,
                }),
                editableLayersListResource.refetch(),
                editTargetAtom.set({
                  type: EditTargets.features,
                  layerId: responseData.id,
                }),
              ]);
            }
          } catch (e) {
            dispatch(
              create('_update', {
                loading: false,
                error: e as string,
                data: state?.data || null,
              }),
            );
          }
        });
      }
    });

    onAction('deleteLayer', (layerId) => {
      const registeredLayers = getUnlistedState(layersRegistryAtom);
      if (registeredLayers.has(layerId)) {
        const layer = registeredLayers.get(layerId)!;
        schedule(async (dispatch) => {
          try {
            await apiClient.delete<unknown>(`/layers/${layerId}`, true);
            dispatch([
              create('_update', {
                loading: false,
                error: null,
                data: null,
              }),
              layer.disable(), // clear url, remove from next details request
              layersRegistryAtom.unregister(layerId), // Optimistic behavior, improve ux
              // editableLayersListResource.refetch(), // Extra refresh layers list request, uncomment it's in case it needed for some reason
              editTargetAtom.set({ type: EditTargets.none }),
            ]);
          } catch (e) {
            dispatch([
              create('_update', {
                loading: false,
                error: e as string,
                data: state?.data || null,
              }),
              editableLayersListResource.refetch(),
            ]);
          }
        });
      }
    });

    onAction('reset', () => {
      if (state) {
        state = null;
      }
      schedule((dispatch) => {
        dispatch(editTargetAtom.set({ type: EditTargets.none }));
      });
    });

    onAction('_update', (st) => {
      state = st;
    });

    return state;
  },
  'editableLayerControllerAtom',
);
