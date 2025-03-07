import { Panel, PanelIcon } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useCallback, useRef } from 'react';
import { Sheet } from 'react-modal-sheet';
import { panelClasses as defaultPanelClasses } from '~components/Panel';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import s from './FullAndShortStatesPanelWidget.module.css';
import type { SheetRef } from 'react-modal-sheet';
import type { PanelState } from '~utils/hooks/useShortPanelState';
import type { PanelFeatureInterface } from '~core/types/featuresTypes';

type PanelProps = {
  fullState?: PanelFeatureInterface | null;
  shortState?: PanelFeatureInterface | null;
  id?: string;
  initialState?: PanelState | null;
  header?: string;
  panelIcon?: JSX.Element;
  getPanelClasses?: ({
    isOpen,
    isShort,
  }: {
    isOpen: boolean;
    isShort: boolean;
  }) => typeof defaultPanelClasses;
};

export function FullAndShortStatesPanelWidget({
  fullState,
  shortState,
  id,
  initialState,
  header,
  panelIcon,
  getPanelClasses = () => defaultPanelClasses,
}: PanelProps) {
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  const {
    panelState,
    panelControls,
    openFullState,
    closePanel,
    togglePanel,
    setPanelState,
    isOpen,
    isShort,
  } = useShortPanelState({
    initialState,
    skipShortState: Boolean(!fullState || !shortState),
    isMobile: isMobile,
  });

  const getProperty = useCallback(
    function <K extends keyof PanelFeatureInterface>(property: K) {
      return isShort ? shortState?.[property] : fullState?.[property];
    },
    [isShort, fullState, shortState],
  );

  const minHeight = getProperty('minHeight') || shortState?.minHeight || 0;
  const maxHeight = getProperty('maxHeight');
  const contentHeight = getProperty('contentheight');
  const resize = isMobile ? 'none' : getProperty('resize');
  const sheetRef = useRef<SheetRef>(null);

  const handleRefChange = useHeightResizer(
    (isOpen) => !isOpen && setPanelState('closed'),
    isOpen,
    minHeight,
    id || 'primary_and_secondary',
    isShort ? shortState?.skipAutoResize : fullState?.skipAutoResize,
  );

  useAutoCollapsePanel(isOpen, closePanel);

  if (!fullState && !shortState) return null;

  const resultHeader = header || (!fullState ? shortState?.header : fullState.header);
  const resultPanelIcon =
    panelIcon || (!fullState ? shortState?.panelIcon : fullState.panelIcon);

  const panelContent = {
    full: fullState?.content || shortState?.content,
    short: shortState?.content,
    closed: <></>,
  };

  const panel = (
    <Panel
      id={id}
      data-testid={id}
      header={resultHeader}
      onHeaderClick={togglePanel}
      headerIcon={resultPanelIcon || undefined}
      className={clsx(s.panel, isOpen ? '' : s.collapse)}
      classes={getPanelClasses({ isOpen, isShort })}
      isOpen={isOpen}
      resize={resize}
      contentContainerRef={handleRefChange}
      customControls={panelControls}
      contentHeight={contentHeight}
      minContentHeight={minHeight}
      maxContentHeight={maxHeight}
    >
      {panelContent[panelState]}
    </Panel>
  );

  return (
    <>
      {isMobile ? (
        <Sheet
          ref={sheetRef}
          isOpen={isOpen}
          onClose={closePanel}
          initialSnap={1}
          snapPoints={[1, 0.55]}
        >
          <Sheet.Backdrop onTap={closePanel} className={s.backdrop} />
          <Sheet.Container>
            <Sheet.Content style={{ paddingBottom: sheetRef.current?.y }}>
              {panel}
            </Sheet.Content>
          </Sheet.Container>
        </Sheet>
      ) : (
        panel
      )}

      <PanelIcon
        clickHandler={openFullState}
        className={clsx(s.panelIcon, isMobile ? '' : s.desktop)}
        icon={resultPanelIcon || <></>}
        data-testid={id}
      />
    </>
  );
}
