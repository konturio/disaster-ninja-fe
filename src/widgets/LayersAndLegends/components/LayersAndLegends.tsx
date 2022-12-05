import { Panel, PanelIcon } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useCallback } from 'react';
import { panelClasses } from '~components/Panel';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import s from './LayersAndLegends.module.css';

type PanelProps = {
  legendProps?: {
    content?: JSX.Element | null | false;
    panelIcon?: JSX.Element | false;
    header?: string | JSX.Element;
    minHeight?: number;
  };
  layersProps?: {
    content?: JSX.Element | null | false;
    panelIcon?: JSX.Element | false;
    header?: string | JSX.Element;
    minHeight?: number;
  };
};

export function LayersAndLegends({ layersProps, legendProps }: PanelProps) {
  const {
    content: layersPanelContent,
    minHeight: layersMinHeight,
    header: layersHeader,
    panelIcon: layersIcon,
  } = layersProps || {};
  const {
    content: legendPanelContent,
    minHeight: legendMinHeight,
    header: legendHeader,
    panelIcon: legendIcon,
  } = legendProps || {};

  const { panelState, panelControls, setPanelState } = useShortPanelState(
    Boolean(!layersProps || !legendProps),
  );

  const isOpen = panelState !== 'closed';
  const isShort = panelState === 'short';
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  const handleRefChange = useHeightResizer(
    (isOpen) => !isOpen && setPanelState('closed'),
    isOpen,
    panelState === 'short' && layersPanelContent && layersMinHeight
      ? layersMinHeight
      : legendMinHeight || 0,
  );

  const onPanelIconClick = useCallback(() => {
    setPanelState('full');
  }, [setPanelState]);

  const onPanelClose = useCallback(() => {
    setPanelState('closed');
  }, [setPanelState]);

  if (!layersPanelContent && !legendPanelContent) return null;

  const header = !layersPanelContent ? legendHeader : layersHeader;
  const panelIcon = !layersPanelContent ? legendIcon : layersIcon;

  const panelContent = {
    full: (panelState === 'full' && layersPanelContent) || legendPanelContent,
    short: legendPanelContent,
    closed: null,
  };

  return (
    <div className={clsx(s.panelContainer, s[panelState])}>
      <Panel
        header={header}
        headerIcon={panelIcon || undefined}
        className={clsx(s.panel, isOpen ? s.show : s.collapse)}
        classes={panelClasses}
        isOpen={isOpen}
        modal={{ onModalClick: onPanelClose, showInModal: isMobile }}
        resize={isMobile || isShort ? 'none' : 'vertical'}
        contentClassName={s.contentWrap}
        contentContainerRef={handleRefChange}
        customControls={panelControls}
        contentHeight={isShort ? 'min-content' : undefined}
      >
        {panelContent[panelState]}
      </Panel>

      <PanelIcon
        clickHandler={onPanelIconClick}
        className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
        icon={panelIcon || <></>}
      />
    </div>
  );
}
