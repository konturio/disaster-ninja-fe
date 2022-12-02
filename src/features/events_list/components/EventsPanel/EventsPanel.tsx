import { Panel, PanelIcon } from '@konturio/ui-kit';
import { useCallback } from 'react';
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
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import { MIN_HEIGHT } from '../../constants';
import { FullState } from '../FullState/FullState';
import { ShortState } from '../ShortState/ShortState';
import s from './EventsPanel.module.css';

export function EventsPanel({
  currentEventId,
  onCurrentChange,
}: {
  currentEventId?: string | null;
  onCurrentChange: (id: string) => void;
}) {
  const { panelState, panelControls, setPanelState } = useShortPanelState();

  const isOpen = panelState !== 'closed';
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const [{ data: userModel }] = useAtom(userResourceAtom);
  const handleRefChange = useHeightResizer(
    (isOpen) => !isOpen && setPanelState('closed'),
    isOpen,
    MIN_HEIGHT,
  );

  const openFullState = useCallback(() => {
    setPanelState('full');
  }, [setPanelState]);

  const onPanelClose = useCallback(() => {
    setPanelState('closed');
  }, [setPanelState]);

  useAutoCollapsePanel(isOpen, onPanelClose);

  const panelContent = {
    full: <FullState currentEventId={currentEventId} onCurrentChange={onCurrentChange} />,
    short: (
      <ShortState
        hasTimeline={userModel?.hasFeature(AppFeature.EPISODES_TIMELINE)}
        openFullState={openFullState}
        currentEventId={currentEventId}
      />
    ),
    closed: null,
  };

  return (
    <div className={clsx(s.panelContainer)}>
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
        customControls={panelControls}
        contentHeight={panelState === 'short' ? 'min-content' : undefined}
      >
        {panelContent[panelState]}
      </Panel>

      <PanelIcon
        clickHandler={openFullState}
        className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
        icon={<Disasters24 />}
      />
    </div>
  );
}
