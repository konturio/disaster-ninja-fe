import { Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { useCallback } from 'react';
import clsx from 'clsx';
import { Disasters24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react-v2';
import { i18n } from '~core/localization';
import { featureFlagsAtom, FeatureFlag } from '~core/shared_state';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import { panelClasses } from '~components/Panel';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
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
  const [focusedGeometry] = useAtom(focusedGeometryAtom);

  const isOpen = panelState !== 'closed';
  const isShort = panelState === 'short';
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const [featureFlags] = useAtom(featureFlagsAtom);

  const handleRefChange = useHeightResizer(
    (isOpen) => !isOpen && setPanelState('closed'),
    isOpen,
    MIN_HEIGHT,
    'event_list',
  );

  const openFullState = useCallback(() => {
    setPanelState('full');
  }, [setPanelState]);

  const onPanelClose = useCallback(() => {
    setPanelState('closed');
  }, [setPanelState]);

  const togglePanelState = useCallback(() => {
    setPanelState(isOpen ? 'closed' : 'full');
  }, [isOpen, setPanelState]);

  useAutoCollapsePanel(isOpen, onPanelClose);

  const panelContent = {
    full: <FullState currentEventId={currentEventId} onCurrentChange={onCurrentChange} />,
    short: (
      <ShortState
        hasTimeline={!!featureFlags[FeatureFlag.EPISODES_TIMELINE]}
        openFullState={openFullState}
        currentEventId={currentEventId}
      />
    ),
    closed: null,
  };

  const header = isOpen ? (
    i18n.t('disasters')
  ) : (
    <div className={s.combinedHeader}>
      <div>{i18n.t('disasters')}</div>
      {focusedGeometry?.source.type === 'event' && (
        <div className={clsx(s.eventNameLabel, s.truncated)}>
          <Text type="short-m">{focusedGeometry.source.meta.eventName}</Text>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Panel
        header={header}
        headerIcon={
          <div className={s.iconWrap}>
            <Disasters24 />
          </div>
        }
        onHeaderClick={togglePanelState}
        className={clsx(s.eventsPanel, isOpen ? s.show : s.collapse)}
        classes={panelClasses}
        isOpen={isOpen}
        modal={{ onModalClick: onPanelClose, showInModal: isMobile }}
        resize={isMobile || isShort ? 'none' : 'vertical'}
        contentClassName={s.contentWrap}
        contentContainerRef={handleRefChange}
        customControls={panelControls}
        contentHeight={isShort ? 'min-content' : undefined}
        minContentHeight={isShort ? 'min-content' : MIN_HEIGHT}
      >
        {panelContent[panelState]}
      </Panel>

      <PanelIcon
        clickHandler={openFullState}
        className={clsx(
          s.panelIcon,
          isOpen && s.hide,
          !isOpen && s.show,
          isMobile ? s.mobile : s.desktop,
        )}
        icon={<Disasters24 />}
      />
    </>
  );
}
