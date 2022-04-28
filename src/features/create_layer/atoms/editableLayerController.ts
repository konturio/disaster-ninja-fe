import { apiClient } from '~core/index';
import { createAtom } from '~utils/atoms';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import {
  createLayerEditorFormAtom,
  LayerEditorFormAtomType,
} from './layerEditorForm';
import {
  createLayerEditorFormFieldAtom,
  LayerEditorFormFieldAtomType,
} from './layerEditorFormField';
import {
  LayerEditorFormModel,
  EditableLayerFieldType,
  EditableLayers,
} from '../types';
import { editableLayerSettingsAtom } from './editableLayerSettings';
import { editTargetAtom } from './editTarget';
import { EditTargets, TEMPORARY_USER_LAYER_LEGEND } from '../constants';
import { editableLayersListResource } from './editableLayersListResource';

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
    save: () => null,
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
            fields: Object.entries(layerUserData.featureProperties).map(
              ([name, type]) => createLayerEditorFormFieldAtom({ name, type }),
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

    onAction('save', () => {
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

        schedule(async (dispatch) => {
          try {
            // TODO - use shared appId from core (fix in #9817)
            const appId = await apiClient.get('/apps/default_id');
            // @ts-expect-error temporary code
            data.appId = appId;
            let responseData: EditableLayers | undefined;
            if (data.id) {
              responseData = await apiClient.put<EditableLayers>(
                `/layers/${data.id}`,
                data,
                true,
              );
            } else {
              responseData = await apiClient.post<EditableLayers>(
                `/layers`,
                data,
                true,
              );
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
                error: e,
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
                error: e,
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
