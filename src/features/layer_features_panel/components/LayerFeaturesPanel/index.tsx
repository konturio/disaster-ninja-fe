import { Panel, PanelIcon } from '@konturio/ui-kit';
import { useCallback } from 'react';
import { clsx } from 'clsx';
import { Legend24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react-v2';
import { currentMapAtom } from '~core/shared_state';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import { panelClasses } from '~components/Panel';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import {
  currentFeatureIdAtom,
  layerFeaturesCollectionAtom,
} from '../../atoms/layerFeaturesCollectionAtom';
import { FullState } from './FullState';
import { ShortState } from './ShortState';
import s from './LayerFeaturesPanel.module.css';
import type { FeatureCardCfg } from '../CardElements';

const MIN_HEIGHT = 80;
const header = 'HOT Tasking Manager Projects';

export function LayerFeaturesPanel() {
  const [currentFeatureId, { set: setCurrentFeatureId }] = useAtom(currentFeatureIdAtom);
  const onCurrentChange = (id: number, feature: FeatureCardCfg) => {
    setCurrentFeatureId(id);
    currentMapAtom.getState()?.fitBounds(feature.focus);
  };

  const [featuresList] = useAtom(layerFeaturesCollectionAtom);

  const { panelState, panelControls, setPanelState } = useShortPanelState();

  const isOpen = panelState !== 'closed';
  const isShort = panelState === 'short';
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  const handleRefChange = useHeightResizer(
    (isOpen) => !isOpen && setPanelState('closed'),
    isOpen,
    MIN_HEIGHT,
    'lf_list',
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

  const feature = featuresList[currentFeatureId];

  const panelContent = {
    full: (
      <FullState
        featuresList={featuresList}
        currentFeatureId={currentFeatureId}
        onClick={onCurrentChange}
      />
    ),
    short: <ShortState openFullState={openFullState} feature={feature} />,
    closed: null,
  };

  return (
    <>
      <Panel
        header={header}
        headerIcon={
          <div className={s.iconWrap}>
            <Legend24 />
          </div>
        }
        onHeaderClick={togglePanelState}
        className={clsx(s.featuresPanel, isOpen ? s.show : s.collapse)}
        classes={{ ...panelClasses, headerTitle: s.headerTitle }}
        isOpen={isOpen}
        modal={{ onModalClick: onPanelClose, showInModal: isMobile }}
        resize={isMobile || isShort ? 'none' : 'vertical'}
        contentClassName={s.contentWrap}
        contentContainerRef={handleRefChange}
        customControls={panelControls}
        contentHeight={isShort ? 'min-content' : '30vh'}
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
        icon={<Legend24 />}
      />
    </>
  );
}
