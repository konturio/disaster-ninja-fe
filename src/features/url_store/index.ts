import {
  currentEventAtom,
  currentEpisodeAtom,
  currentMapPositionAtom,
  enabledLayersAtom,
} from '~core/shared_state';
import { selectedDataAtom } from './atoms/selected_data';
import { URLStore } from './url_store';
import { URLDataInSearchEncoder } from './data_in_URL_encoder';
import { UrlData } from './types';

export const initUrlStore = () => {
  const urlStore = new URLStore(new URLDataInSearchEncoder());

  selectedDataAtom.subscribe((current: UrlData) => {
    urlStore.updateUrl(current); // write last store changes in url

    urlStore.onUrlChange((updated: UrlData) => {
      /* Describe here how and when update shared state after user change URL params */

      if (current.event !== updated.event) {
        updated.event
          ? currentEventAtom.setCurrentEventId.dispatch(updated.event)
          : currentEventAtom.resetCurrentEvent.dispatch();
      }

      // Update EPISODE from url
      if (current.episode !== updated.episode) {
        updated.episode
          ? currentEpisodeAtom.setCurrentEpisodeId.dispatch(updated.episode)
          : currentEpisodeAtom.resetCurrentEpisodeId.dispatch();
      }

      // Update LAYERS from url
      if (updated.layers === undefined) {
        enabledLayersAtom.disableAllLayers.dispatch();
      } else if ((current.layers ?? []).join() !== updated.layers.join()) {
        enabledLayersAtom.setLayers.dispatch(updated.layers);
      }

      // Update MAP from url
      if ((current.map ?? []).join() !== (updated.map ?? []).join()) {
        if (updated.map === undefined) return;
        currentMapPositionAtom.setCurrentMapPosition.dispatch({
          zoom: Number(updated.map[0]),
          lng: Number(updated.map[1]),
          lat: Number(updated.map[2]),
        });
      }
    });
  });

  urlStore.init();
};
