import {
  currentEventAtom,
  currentEpisodeAtom,
  currentMapPositionAtom,
  logicalLayersRegistryAtom,
} from '~core/shared_state';
import { selectedDataAtom } from './atoms/selectedData';
import { URLStore } from './URLStore';
import { URLDataInSearchEncoder } from './dataInURLEncoder';
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
      const currentLayers = new Set(current.layers ?? []);
      const added = (updated.layers ?? []).filter((l) => !currentLayers.has(l));
      logicalLayersRegistryAtom.mountLayers.dispatch(added);

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
