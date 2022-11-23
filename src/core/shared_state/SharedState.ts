import { currentEpisodeAtom } from './currentEpisode';
import { layersCategoriesSettingsAtom } from './layersCategoriesSettings';
import { layersGroupsSettingsAtom } from './layersGroupsSettings';
import { toolbarControlsAtom } from './toolbarControls';
import { episodesPanelState } from './episodesPanelState';

export class SharedState {
  currentEpisodeAtom = currentEpisodeAtom;
  layersCategoriesSettingsAtom = layersCategoriesSettingsAtom;
  layersGroupsSettingsAtom = layersGroupsSettingsAtom;
  toolbarControlsAtom = toolbarControlsAtom;
  episodesPanelState = episodesPanelState;
}
