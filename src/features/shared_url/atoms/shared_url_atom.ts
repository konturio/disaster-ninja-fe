import { createAtom } from '@reatom/core';
import {
  currentEventAtom,
  currentEpisodeAtom,
  currentMapPositionAtom,
  enabledLayersAtom,
} from '~core/shared_state';
import { composedDataAtom } from './composed_data';
import { currentUrlAtom } from './current_url';

export const sharedUrlAtom = createAtom(
  { composedDataAtom, currentUrlAtom },
  ({ get, onChange }) => {
    const current = get('composedDataAtom');
    /* Update Url after state changes */
    onChange('composedDataAtom', (state) => currentUrlAtom.setUrlState(state));

    /* Update state after url changes */
    onChange('currentUrlAtom', (updated) => {
      console.log("onChange('currentUrlAtom')", updated);
      if (current.event !== updated.event) {
        updated.event
          ? currentEventAtom.setCurrentEventId(updated.event)
          : currentEventAtom.unsetCurrentEvent();
      }

      // Update EPISODE from url
      if (current.episode !== updated.episode) {
        updated.episode
          ? currentEpisodeAtom.setCurrentEpisodeId(updated.episode)
          : currentEpisodeAtom.unsetCurrentEpisodeId();
      }

      // Update LAYERS from url
      if (updated.layers === undefined) {
        enabledLayersAtom.disableAllLayers();
      } else if (
        // layers list was changed
        (current.layers ?? []).join() !== updated.layers.join()
      ) {
        console.log(
          `[UrlAtom] LayersAtom.setLayers.dispatch([${updated.layers.join(
            ', ',
          )}])`,
        );

        enabledLayersAtom.setLayers.dispatch(updated.layers);
      }

      // Update MAP from url
      if ((current.map ?? []).join() !== (updated.map ?? []).join()) {
        if (updated.map === undefined) return;
        currentMapPositionAtom.setCurrentMapPosition({
          zoom: Number(updated.map[0]),
          lng: Number(updated.map[1]),
          lat: Number(updated.map[2]),
        });
      }
    });
  },
);
