import { Panel, PanelIcon } from '@konturio/ui-kit';
import { useCallback, useRef } from 'react';
import { clsx } from 'clsx';
import { Legend24 } from '@konturio/default-icons';
import { useAction, useAtom } from '@reatom/npm-react';
import { Sheet } from 'react-modal-sheet';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import { panelClasses } from '~components/Panel';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import { scheduledAutoFocus } from '~core/shared_state/currentEvent';
import { i18n } from '~core/localization';
import { setCurrentMapBbox, type Bbox } from '~core/shared_state/currentMapPosition';
import {
  featuresPanelLayerId,
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
import type { SheetRef } from 'react-modal-sheet';

export function LayerFeaturesPanel() {
  const [currentFeatureId, setCurrentFeatureIdAtom] = useAtom(currentFeatureIdAtom);
  const setMapBbox = useAction(setCurrentMapBbox);
  const sheetRef = useRef<SheetRef>(null);

  const onCurrentChange = (id: number, feature: FeatureCardCfg) => {
    setCurrentFeatureIdAtom(id);
    scheduledAutoFocus.setFalse.dispatch();
    if (feature.focus) {
      setMapBbox(feature.focus as Bbox);
    }
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
    featuresList === null || featuresList.length === 0 ? (
      <EmptyState />
    ) : (
      {
        full: (
          <FullState
            featuresList={featuresList}
            currentFeatureId={currentFeatureId}
            onClick={onCurrentChange}
            listInfoText={
              featuresPanelLayerId === HOT_PROJECTS_LAYER_ID
                ? i18n.t('layer_features_panel.listInfo')
                : undefined
            }
          />
        ),
        short: (
          <ShortState
            openFullState={openFullState}
            feature={
              currentFeatureId !== null ? featuresList[currentFeatureId] : undefined
            }
          />
        ),
        closed: null,
      }[panelState]
    );

  const panel = (
    <Panel
      header={
        featuresPanelLayerId === HOT_PROJECTS_LAYER_ID
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
      classes={{ ...panelClasses, headerTitle: s.headerTitle, header: s.header }}
      isOpen={isOpen}
      resize={isMobile || isShort ? 'none' : 'vertical'}
      contentClassName={s.panelBody}
      contentContainerRef={handleRefChange}
      customControls={panelControls}
      contentHeight={isShort ? 'min-content' : 'unset'}
      minContentHeight={isShort ? 'min-content' : FEATURESPANEL_MIN_HEIGHT}
    >
      {panelContent}
    </Panel>
  );

  return (
    <>
      {isMobile ? (
        <Sheet
          ref={sheetRef}
          isOpen={isOpen}
          onClose={onPanelClose}
          initialSnap={1}
          snapPoints={[1, 0.5]}
        >
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
