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
import { LayerEditorFormModel, EditableLayerFieldType } from '../types';
import { apiClient } from '~core/index';
import { editableLayerSettingsAtom } from './editableLayerSettings';
import { editTargetAtom } from './editTarget';
import { EditTargets } from '../constants';
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
        dispatch(editTargetAtom.set('layer'));
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
            editTargetAtom.set(EditTargets.layer),
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
              dispatch([
                create('_update', {
                  loading: false,
                  error: null,
                  data: state?.data || null,
                }),
                editableLayersListResource.refetch(),
                editTargetAtom.set(EditTargets.features),
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
        schedule(async (dispatch) => {
          try {
            await apiClient.delete<unknown>(`/layers/${layerId}`, true);
            dispatch([
              create('_update', {
                loading: false,
                error: null,
                data: null,
              }),
              editableLayersListResource.refetch(),
              editTargetAtom.set(EditTargets.none),
              layersRegistryAtom.unregister(layerId),
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
    });

    onAction('_update', (st) => {
      state = st;
    });

    return state;
  },
  'editableLayerControllerAtom',
);
