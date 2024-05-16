import { store } from '~core/store/store';
import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { layersSettingsAtom } from '../atoms/layersSettings';
import { layersLegendsAtom } from '../atoms/layersLegends';
import { layersRegistryAtom } from '../atoms/layersRegistry';
import { enabledLayersAtom } from '../atoms/enabledLayers';
import type { LogicalLayerRenderer } from '../types/renderer';

export function registerNewGeometryLayer(
  layerId: string,
  logicalLayerTranslationKey: string,
  renderer: LogicalLayerRenderer,
  mainColor: string,
) {
  store.dispatch([
    // Set layer settings once
    layersSettingsAtom.set(
      layerId,
      createAsyncWrapper({
        name: logicalLayerTranslationKey,
        id: layerId,
        boundaryRequiredForRetrieval: false,
        ownedByUser: false,
      }),
    ),
    // Sel layer legend once
    layersLegendsAtom.set(
      layerId,
      createAsyncWrapper({
        type: 'simple',
        name: logicalLayerTranslationKey,
        steps: [
          {
            stepShape: 'circle',
            stepName: logicalLayerTranslationKey,
            style: {
              color: mainColor,
            },
          },
        ],
      }),
    ),
    // Add layer to registry, so it available from panel and use common lifecycle
    layersRegistryAtom.register({
      renderer,
      id: layerId,
    }),
    enabledLayersAtom.set(layerId),
  ]);
}
