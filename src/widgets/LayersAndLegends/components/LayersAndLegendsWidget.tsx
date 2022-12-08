import { Panel, PanelIcon } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useCallback } from 'react';
import { panelClasses } from '~components/Panel';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import s from './LayersAndLegends.module.css';
import type { PanelFeatureInterface } from 'types/featuresTypes';

type PanelProps = {
  layersProps?: PanelFeatureInterface | null;
  legendProps?: PanelFeatureInterface | null;
};

export function LayersAndLegendsWidget({ layersProps, legendProps }: PanelProps) {
  const { panelState, panelControls, setPanelState } = useShortPanelState(
    Boolean(!layersProps || !legendProps),
  );

  const isOpen = panelState !== 'closed';
  const isShort = panelState === 'short';
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const minHeight = isShort
    ? legendProps?.minHeight || 0
    : (layersProps?.minHeight || legendProps?.minHeight)!;

  const handleRefChange = useHeightResizer(
    (isOpen) => !isOpen && setPanelState('closed'),
    isOpen,
    minHeight,
  );

  const onPanelIconClick = useCallback(() => {
    setPanelState('full');
  }, [setPanelState]);

  const onPanelClose = useCallback(() => {
    setPanelState('closed');
  }, [setPanelState]);

  if (!layersProps && !legendProps) return null;

  const header = !layersProps ? legendProps!.header : layersProps.header;
  const panelIcon = !layersProps ? legendProps!.panelIcon : layersProps.panelIcon;

  const panelContent = {
    full: layersProps?.content || legendProps!.content,
    short: legendProps?.content,
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
        contentClassName={s.contentWrap}
        contentContainerRef={handleRefChange}
        customControls={panelControls}
        contentHeight={isShort ? 'min-content' : undefined}
        minContentHeight={minHeight}
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
