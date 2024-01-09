import { useAtom } from '@reatom/react-v2';
import { Play24, PlayActive24 } from '@konturio/default-icons';
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltips';
import { episodesPanelState } from '~core/shared_state';
import { i18n } from '~core/localization';
import s from './EpisodeTimelineToggle.module.css';

export function EpisodeTimelineToggle({ isActive }) {
  const [panelState, panelStateActions] = useAtom(episodesPanelState);

  return (
    <Tooltip>
      <TooltipTrigger>
        <span
          className={s.timelineIcon}
          onClick={panelState.isOpen ? panelStateActions.close : panelStateActions.open}
        >
          {isActive && panelState.isOpen ? <PlayActive24 /> : <Play24 />}
        </span>
      </TooltipTrigger>
      <TooltipContent>{i18n.t('event_list.open_timeline_button')}</TooltipContent>
    </Tooltip>
  );
}
