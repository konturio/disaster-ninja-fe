import { Panel, PanelIcon } from '@konturio/ui-kit';
import { useCallback } from 'react';
import { clsx } from 'clsx';
import { Legend24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react-v2';
import { currentMapPositionAtom } from '~core/shared_state';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import { panelClasses } from '~components/Panel';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import { scheduledAutoFocus } from '~core/shared_state/currentEvent';
import {
  currentFeatureIdAtom,
  layerFeaturesCollectionAtom,
} from '../../atoms/layerFeaturesCollectionAtom';
import {
  ACAPS_DATA_HEADER,
  FEATURESPANEL_MIN_HEIGHT,
  HOT_PROJECTS_HEADER,
  HOT_PROJECTS_LAYER_ID,
} from '../../constants';
import { FullState } from './FullState';
import { ShortState } from './ShortState';
import s from './LayerFeaturesPanel.module.css';
import { EmptyState } from './EmptyState';
import type { FeatureCardCfg } from '../CardElements';
import type { Bbox } from '~core/shared_state/currentMapPosition';

const CURRENT_FEATURES_PANEL_LAYER_ID = HOT_PROJECTS_LAYER_ID;

export function LayerFeaturesPanel() {
  const [currentFeatureId, { set: setCurrentFeatureId }] = useAtom(currentFeatureIdAtom);
  const onCurrentChange = (id: number, feature: FeatureCardCfg) => {
    setCurrentFeatureId(id);
    scheduledAutoFocus.setFalse.dispatch();
    currentMapPositionAtom.setCurrentMapBbox.dispatch(feature.focus as Bbox);
  };

  const [featuresList] = useAtom(layerFeaturesCollectionAtom);

  const { panelState, panelControls, setPanelState } = useShortPanelState();

  const isOpen = panelState !== 'closed';
  const isShort = panelState === 'short';
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  const handleRefChange = useHeightResizer(
    (isOpen) => !isOpen && setPanelState('closed'),
    isOpen,
    FEATURESPANEL_MIN_HEIGHT,
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

  const panelContent =
    featuresList === null ? (
      <EmptyState />
    ) : (
      {
        full: (
          <FullState
            featuresList={featuresList}
            currentFeatureId={currentFeatureId}
            onClick={onCurrentChange}
          />
        ),
        short: (
          <ShortState
            openFullState={openFullState}
            feature={featuresList[currentFeatureId]}
          />
        ),
        closed: null,
      }[panelState]
    );

  return (
    <>
      <Panel
        header={
          CURRENT_FEATURES_PANEL_LAYER_ID === HOT_PROJECTS_LAYER_ID
            ? HOT_PROJECTS_HEADER
            : ACAPS_DATA_HEADER
        }
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
        contentClassName={s.panelBody}
        contentContainerRef={handleRefChange}
        customControls={panelControls}
        contentHeight={isShort ? 'min-content' : '30vh'}
        minContentHeight={isShort ? 'min-content' : FEATURESPANEL_MIN_HEIGHT}
      >
        {panelContent}
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
