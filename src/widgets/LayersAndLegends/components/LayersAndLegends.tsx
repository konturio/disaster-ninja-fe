import { Layers24, Legend24 } from '@konturio/default-icons';
import { Panel, PanelIcon } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useCallback } from 'react';
import { i18n } from '~core/localization';
import { panelClasses } from '~components/Panel';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import s from './LayersAndLegends.module.css';

type PanelProps = {
  legendPanelContent?: JSX.Element | null;
  legendMinHeight?: number;

  layersPanelContent?: JSX.Element | null;
  layersMinHeight?: number;
};

export function LayersAndLegends({
  layersPanelContent,
  legendPanelContent,
  layersMinHeight,
  legendMinHeight,
}: PanelProps) {
  const { panelState, panelControls, setPanelState } = useShortPanelState(
    Boolean(!layersPanelContent || !legendPanelContent),
  );
  const isOpen = panelState !== 'closed';
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

  const header = !layersPanelContent ? i18n.t('legend') : i18n.t('layers');
  const headerIcon = !layersPanelContent ? <Legend24 /> : <Layers24 />;

  const panelContent = {
    full: (panelState === 'full' && layersPanelContent) || legendPanelContent,
    short: legendPanelContent,
    closed: null,
  };

  return (
    <div className={clsx(s.panelContainer, s[panelState])}>
      <Panel
        header={header}
        headerIcon={headerIcon}
        className={clsx(s.panel, isOpen ? s.show : s.collapse)}
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
        clickHandler={onPanelIconClick}
        className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
        icon={headerIcon}
      />
    </div>
  );
}
