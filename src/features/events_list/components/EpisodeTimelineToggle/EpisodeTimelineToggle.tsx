import { useRef, useState } from 'react';
import { useAtom } from '@reatom/react';
import { Trans } from 'react-i18next';
import { Play24, PlayActive24 } from '@konturio/default-icons';
import { Tooltip } from '@konturio/ui-kit';
import { episodesPanelState } from '~core/shared_state';
import { i18n } from '~core/localization';
import s from './EpisodeTimelineToggle.module.css';

export function EpisodeTimelineToggle({ isActive }) {
  const [panelState, panelStateActions] = useAtom(episodesPanelState);

  const ref = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <span
        ref={ref}
        className={s.timelineIcon}
        onClick={panelState.isOpen ? panelStateActions.close : panelStateActions.open}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {isActive && panelState.isOpen ? <PlayActive24 /> : <Play24 />}
      </span>
      <Tooltip triggerRef={ref} open={showTooltip} hoverBehavior>
        {i18n.t('event_list.open_timeline_button')}
      </Tooltip>
    </>
  );
}
