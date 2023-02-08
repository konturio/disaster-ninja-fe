import { useAtom } from '@reatom/react';
import { episodesPanelStateHandler } from '~core/focused_geometry/controllers';
import { eventEpisodesModel } from './model';
import { EpisodesTimelinePanel } from './components/EpisodesTimelinePanel/EpisodesTimelinePanel';
import { episodeToFocusedGeometry } from './atoms/episodeToFocusedGeometry';

export function EventEpisodes() {
  const [panelState] = useAtom(eventEpisodesModel.episodesPanelState);
  useAtom(episodeToFocusedGeometry);
  useAtom(episodesPanelStateHandler);
  return panelState.isOpen ? <EpisodesTimelinePanel /> : null;
}
