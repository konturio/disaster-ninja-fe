import { Layers24, Legend24 } from '@konturio/default-icons';
import { Panel, PanelIcon } from '@konturio/ui-kit';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { i18n } from '~core/localization';
import { panelClasses } from '~components/Panel';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useHeightResizer } from '~utils/hooks/useResizer';
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
  const [panelState, setPanelState] = useState<'full' | 'short' | 'closed'>('full');
  const isOpen = panelState !== 'closed';
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  const handleRefChange = useHeightResizer(
    (isOpen) => !isOpen && setPanelState('closed'),
    isOpen,
    panelState === 'short' && layersPanelContent && layersMinHeight
      ? layersMinHeight
      : legendMinHeight || 0,
  );

  const shortStateListeners = {
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

  if (!layersPanelContent && !legendPanelContent) return null;

  const header = !layersPanelContent ? i18n.t('legend') : i18n.t('layers');
  const headerIcon = !layersPanelContent ? <Legend24 /> : <Layers24 />;

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
        // Temp. Will be fixed
        shortStateContent={legendPanelContent || undefined}
        shortStateListeners={shortStateListeners}
        isShortStateOpen={panelState === 'short'}
        minContentHeight={panelState === 'short' ? 'min-content' : undefined}
      >
        {(panelState === 'full' && layersPanelContent) || legendPanelContent}
      </Panel>

      <PanelIcon
        clickHandler={onPanelIconClick}
        className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
        icon={headerIcon}
      />
    </div>
  );
}
