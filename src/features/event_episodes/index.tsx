import { useAtom } from '@reatom/react';
import { eventEpisodesModel } from './model';
import { EpisodesTimelinePanel } from './components/EpisodesTimelinePanel/EpisodesTimelinePanel';
import { episodeToFocusedGeometry } from './atoms/episodeToFocusedGeometry';

export function EventEpisodes() {
  const [panelState] = useAtom(eventEpisodesModel.episodesPanelState);
  useAtom(episodeToFocusedGeometry);
  return panelState.isOpen ? <EpisodesTimelinePanel /> : null;
}
