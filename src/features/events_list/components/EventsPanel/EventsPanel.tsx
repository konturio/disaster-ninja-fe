import { Panel, PanelIcon, Text } from '@konturio/ui-kit';
import clsx from 'clsx';
import { Disasters24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react-v2';
import { i18n } from '~core/localization';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import { panelClasses } from '~components/Panel';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { isEventGeometry, getEventName } from '~core/focused_geometry/utils';
import { MIN_HEIGHT } from '../../constants';
import { FullState } from '../FullState/FullState';
import { ShortState } from '../ShortState/ShortState';
import s from './EventsPanel.module.css';

const featureFlags = configRepo.get().features;

export function EventsPanel({
  currentEventId,
  onCurrentChange,
}: {
  currentEventId?: string | null;
  onCurrentChange: (id: string) => void;
}) {
  const {
    panelState,
    panelControls,
    openFullState,
    closePanel,
    togglePanel,
    isOpen,
    isShort,
  } = useShortPanelState();

  const [focusedGeometry] = useAtom(focusedGeometryAtom);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  const handleRefChange = useHeightResizer(
    (isOpen) => !isOpen && closePanel(),
    isOpen,
    MIN_HEIGHT,
    'event_list',
  );

  useAutoCollapsePanel(isOpen, closePanel);

  const panelContent = {
    full: <FullState currentEventId={currentEventId} onCurrentChange={onCurrentChange} />,
    short: (
      <ShortState
        hasTimeline={!!featureFlags[AppFeature.EPISODES_TIMELINE]}
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
      {isEventGeometry(focusedGeometry) && (
        <div className={clsx(s.eventNameLabel, s.truncated)}>
          <Text type="short-m">{getEventName(focusedGeometry)}</Text>
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
        onHeaderClick={togglePanel}
        className={clsx(s.eventsPanel, isOpen ? s.show : s.collapse)}
        classes={panelClasses}
        isOpen={isOpen}
        modal={{ onModalClick: closePanel, showInModal: isMobile }}
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
