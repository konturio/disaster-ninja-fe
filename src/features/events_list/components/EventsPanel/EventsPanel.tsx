import { Panel, PanelIcon } from '@konturio/ui-kit';
import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { Disasters24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import { i18n } from '~core/localization';
import { userResourceAtom } from '~core/auth';
import { AppFeature } from '~core/auth/types';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import { panelClasses } from '~components/Panel';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { MIN_HEIGHT } from '../../constants';
import { ShortState } from '../ShortState/ShortState';
import { FullState } from '../FullState/FullState';
import s from './EventsPanel.module.css';
import type { ShortStateListenersType } from '@konturio/ui-kit/tslib/Panel';

export function EventsPanel({
  currentEventId,
  onCurrentChange,
}: {
  currentEventId?: string | null;
  onCurrentChange: (id: string) => void;
}) {
  const [panelState, setPanelState] = useState<'full' | 'short' | 'closed'>('full');
  const isOpen = panelState !== 'closed';
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const [{ data: userModel }] = useAtom(userResourceAtom);
  const handleRefChange = useHeightResizer(
    (isOpen) => !isOpen && setPanelState('closed'),
    isOpen,
    MIN_HEIGHT,
  );

  const shortStateListeners: ShortStateListenersType = {
    onClose: () => setPanelState('closed'),
    onFullStateOpen: () => setPanelState('full'),
    onShortStateOpen: () => setPanelState('short'),
  };

  const onPanelIconClick = useCallback(() => {
    setPanelState('full');
  }, [setPanelState]);

  const onPanelClose = useCallback(() => {
    setPanelState('closed');
  }, [setPanelState]);

  useAutoCollapsePanel(isOpen, onPanelClose);

  return (
    <div className={clsx(s.panelContainer, s[panelState])}>
      <Panel
        header={String(i18n.t('disasters'))}
        headerIcon={<Disasters24 />}
        className={clsx(s.eventsPanel, isOpen ? s.show : s.collapse)}
        classes={panelClasses}
        isOpen={isOpen}
        modal={{ onModalClick: onPanelClose, showInModal: isMobile }}
        resize={isMobile || panelState === 'short' ? 'none' : 'vertical'}
        contentClassName={s.contentWrap}
        contentContainerRef={handleRefChange}
        shortStateContent={
          <ShortState
            hasTimeline={userModel?.hasFeature(AppFeature.EPISODES_TIMELINE)}
            openFullState={shortStateListeners.onFullStateOpen}
            currentEventId={currentEventId}
          />
        }
        shortStateListeners={shortStateListeners}
        isShortStateOpen={panelState === 'short'}
        minContentHeight={panelState === 'short' ? 'min-content' : undefined}
      >
        {panelState === 'full' && (
          <FullState currentEventId={currentEventId} onCurrentChange={onCurrentChange} />
        )}
      </Panel>

      <PanelIcon
        clickHandler={onPanelIconClick}
        className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
        icon={<Disasters24 />}
      />
    </div>
  );
}
