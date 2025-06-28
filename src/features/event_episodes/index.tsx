import { useAtom } from '@reatom/react-v2';
import { episodesPanelStateHandler } from '~core/focused_geometry/controllers';
import { eventEpisodesModel } from './model';
import { EpisodesTimelinePanel } from './components/EpisodesTimelinePanel/EpisodesTimelinePanel';
import { episodeToFocusedGeometry } from './atoms/episodeToFocusedGeometry';
import { autoFitEpisodesTimeline } from './atoms/autoFitEpisodesTimeline';

export function EventEpisodes() {
  const [panelState] = useAtom(eventEpisodesModel.episodesPanelState);
  useAtom(episodeToFocusedGeometry);
  useAtom(autoFitEpisodesTimeline);
  useAtom(episodesPanelStateHandler);
  return panelState.isOpen ? <EpisodesTimelinePanel /> : null;
}
