import { action, atom } from '@reatom/framework';
import { currentMapAtom } from '~core/shared_state';
import { notificationServiceInstance as notification } from '~core/notificationServiceInstance';
import { i18n } from '~core/localization';
import { store } from '~core/store/store';

export interface LayerFeaturesFilters {
  geometry: GeoJSON.GeoJSON | null;
}

export const layerFeaturesFiltersAtom = atom<LayerFeaturesFilters>(
  { geometry: null },
  'layerFeaturesFiltersAtom',
);

export const setBBoxAsGeometryForLayerFeatures = action((ctx) => {
  const map = store.getState(currentMapAtom);
  if (map) {
    const currentViewBbox = map.getBounds();
    const geometry: GeoJSON.GeoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            currentViewBbox.getNorthEast().toArray(),
            currentViewBbox.getSouthEast().toArray(),
            currentViewBbox.getSouthWest().toArray(),
            currentViewBbox.getNorthWest().toArray(),
            currentViewBbox.getNorthEast().toArray(),
          ],
        ],
      },
      properties: {},
    };
    layerFeaturesFiltersAtom(ctx, (prevState) => ({
      ...prevState,
      geometry,
    }));
  } else {
    notification.warning({
      title: i18n.t('event_list.warning_title'),
      description: i18n.t('event_list.warning_description'),
    });
  }
}, 'setBBoxAsGeometryForLayerFeatures');

export const resetGeometryForLayerFeatures = action((ctx) => {
  layerFeaturesFiltersAtom(ctx, (prevState) => ({
    ...prevState,
    geometry: null,
  }));
}, 'resetGeometryForLayerFeatures');
