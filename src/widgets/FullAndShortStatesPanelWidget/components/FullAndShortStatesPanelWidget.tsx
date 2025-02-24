import { Panel, PanelIcon } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useCallback } from 'react';
import { panelClasses as defaultPanelClasses } from '~components/Panel';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import s from './FullAndShortStatesPanelWidget.module.css';
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
  const { panelState, panelControls, setPanelState } = useShortPanelState({
    initialState,
    skipShortState: Boolean(!fullState || !shortState),
  });

  const isOpen = panelState !== 'closed';
  const isShort = panelState === 'short';
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
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

  const handleRefChange = useHeightResizer(
    (isOpen) => !isOpen && setPanelState('closed'),
    isOpen,
    minHeight,
    id || 'primary_and_secondary',
    isShort ? shortState?.skipAutoResize : fullState?.skipAutoResize,
  );

  const onPanelIconClick = useCallback(() => {
    setPanelState('full');
  }, [setPanelState]);

  const onPanelClose = useCallback(() => {
    setPanelState('closed');
  }, [setPanelState]);

  const togglePanelState = useCallback(() => {
    setPanelState(isOpen ? 'closed' : 'full');
  }, [isOpen, setPanelState]);

  useAutoCollapsePanel(isOpen, onPanelClose);

  if (!fullState && !shortState) return null;

  const resultHeader = header || (!fullState ? shortState?.header : fullState.header);
  const resultPanelIcon =
    panelIcon || (!fullState ? shortState?.panelIcon : fullState.panelIcon);

  const panelContent = {
    full: fullState?.content || shortState?.content,
    short: shortState?.content,
    closed: <></>,
  };

  return (
    <>
      <Panel
        id={id}
        data-testid={id}
        header={resultHeader}
        onHeaderClick={togglePanelState}
        headerIcon={resultPanelIcon || undefined}
        className={clsx(s.panel, isOpen ? s.show : s.collapse, 'knt-panel')}
        classes={getPanelClasses({ isOpen, isShort })}
        isOpen={isOpen}
        modal={{ onModalClick: onPanelClose, showInModal: isMobile }}
        resize={resize}
        contentContainerRef={handleRefChange}
        customControls={panelControls}
        contentHeight={contentHeight}
        minContentHeight={minHeight}
        maxContentHeight={maxHeight}
      >
        {panelContent[panelState]}
      </Panel>

      <PanelIcon
        clickHandler={onPanelIconClick}
        className={clsx(
          s.panelIcon,
          isOpen && s.hide,
          !isOpen && s.show,
          isMobile ? s.mobile : s.desktop,
          'knt-panel-icon',
        )}
        icon={resultPanelIcon || <></>}
        data-testid={id}
      />
    </>
  );
}
