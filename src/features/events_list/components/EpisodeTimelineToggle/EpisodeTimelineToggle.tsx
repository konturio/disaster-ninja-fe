import { useAtom } from '@reatom/react';
import { Play24, PlayActive24 } from '@konturio/default-icons';
import { episodesPanelState } from '~core/shared_state';
import s from './EpisodeTimelineToggle.module.css';

export function EpisodeTimelineToggle({ isActive }) {
  const [panelState, panelStateActions] = useAtom(episodesPanelState);

  return (
    <span
      className={s.timelineIcon}
      onClick={panelState.isOpen ? panelStateActions.close : panelStateActions.open}
    >
      {isActive && panelState.isOpen ? <PlayActive24 /> : <Play24 />}
    </span>
  );
}
