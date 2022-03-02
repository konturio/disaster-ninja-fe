import { createResourceAtom } from '~utils/atoms';
import { LayerDataAtomType } from '~features/create_layer/atoms/createLayerData';
import { v4 as uuidv4 } from 'uuid';
import { apiClient } from '~core/index';
import { CreateLayerModel } from '~features/create_layer/types';
import { LayerFieldAtomType } from '~features/create_layer/atoms/createLayerField';
import { AnalyticsData } from '~core/types';

export function createLayerResourceAtom(dependencyAtom: LayerDataAtomType) {
  return createResourceAtom(
    async (layerDataState?: CreateLayerModel | null) => {
      if (!layerDataState || !layerDataState?.isSaving) return null;
      const data = {
        name: layerDataState?.name || '',
        legend: {},
        feature_properties: layerDataState.fields.map((fldAtom: LayerFieldAtomType) => {
          console.log('fldAtom', fldAtom)
        })
      };
      // const responseData = await apiClient.post<AnalyticsData[] | null>(
      //   `/layers`,
      //   fGeo?.geometry,
      //   false,
      // );
      // if (responseData === undefined) throw new Error('No data received');
      return null;
    },
    dependencyAtom,
    `createLayerResourceAtom_${uuidv4()}`,
  );
}
