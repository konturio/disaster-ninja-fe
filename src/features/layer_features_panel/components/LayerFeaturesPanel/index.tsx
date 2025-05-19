import { Panel, PanelIcon } from '@konturio/ui-kit';
import { useMemo, useRef } from 'react';
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
import { BBoxFilterToggle } from '~components/BBoxFilterToggle/BBoxFilterToggle';
import {
  layerFeaturesFiltersAtom,
  resetGeometryForLayerFeatures,
  setBBoxAsGeometryForLayerFeatures,
} from '~features/layer_features_panel/atoms/layerFeaturesFiltersAtom';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { PanelSettingsRow } from '~components/PanelSettingsRow/PanelSettingsRow';
import {
  featuresPanelLayerId,
  currentFeatureIdAtom,
  layerFeaturesCollectionAtom,
} from '../../atoms/layerFeaturesCollectionAtom';
import {
  ACAPS_DATA_HEADER,
  ACAPS_LAYER_ID,
  ACAPS_SIMPLE_LAYER_ID,
  FEATURESPANEL_MIN_HEIGHT,
  HOT_PROJECTS_HEADER,
  HOT_PROJECTS_LAYER_ID,
  OAM_HEADER,
  OAM_LAYER_ID,
} from '../../constants';
import { FullState } from './FullState';
import { ShortState } from './ShortState';
import s from './LayerFeaturesPanel.module.css';
import { EmptyState } from './EmptyState';
import type { FeatureCardCfg } from '../CardElements';
import type { SheetRef } from 'react-modal-sheet';
import type { LayerFeaturesPanelConfig } from '../../types/layerFeaturesPanel';

export function LayerFeaturesPanel() {
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

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

  const panelFeature = configRepo.get().features[AppFeature.LAYER_FEATURES_PANEL];
  const layerFeaturesPanelConfig =
    panelFeature && typeof panelFeature === 'object'
      ? (panelFeature as LayerFeaturesPanelConfig)
      : null;

  const [{ geometry: bboxFilter }] = useAtom(layerFeaturesFiltersAtom);
  const setBboxFilter = useAction(setBBoxAsGeometryForLayerFeatures);
  const resetBboxFilter = useAction(resetGeometryForLayerFeatures);

  const [featuresList] = useAtom(layerFeaturesCollectionAtom);

  const {
    panelState,
    panelControls,
    openFullState,
    togglePanel,
    closePanel,
    setPanelState,
  } = useShortPanelState({ isMobile });

  const isOpen = panelState !== 'closed';
  const isShort = panelState === 'short';

  const handleRefChange = useHeightResizer(
    (isOpen) => !isOpen && setPanelState('closed'),
    isOpen,
    FEATURESPANEL_MIN_HEIGHT,
    'lf_list',
  );

  useAutoCollapsePanel(isOpen, closePanel);

  const panelHeader = useMemo(() => {
    switch (featuresPanelLayerId) {
      case HOT_PROJECTS_LAYER_ID:
        return HOT_PROJECTS_HEADER;
      case ACAPS_LAYER_ID:
      case ACAPS_SIMPLE_LAYER_ID:
        return ACAPS_DATA_HEADER;
      case OAM_LAYER_ID:
        return OAM_HEADER;
      default:
        return undefined;
    }
  }, []);

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
      header={panelHeader}
      headerIcon={
        <div className={s.iconWrap}>
          <Legend24 />
        </div>
      }
      onHeaderClick={togglePanel}
      className={clsx(s.featuresPanel, isOpen ? s.show : s.collapse, 'knt-panel')}
      classes={{ ...panelClasses, headerTitle: s.headerTitle, header: s.header }}
      isOpen={isOpen}
      resize={isMobile || isShort ? 'none' : 'vertical'}
      contentClassName={s.panelBody}
      contentContainerRef={handleRefChange}
      customControls={panelControls}
      contentHeight={isShort ? 'min-content' : 'unset'}
      minContentHeight={isShort ? 'min-content' : FEATURESPANEL_MIN_HEIGHT}
    >
      {layerFeaturesPanelConfig?.showBboxFilterToggle && (
        <PanelSettingsRow>
          <BBoxFilterToggle
            currentFilter={bboxFilter}
            onCleanFilter={resetBboxFilter}
            onSetFilter={setBboxFilter}
          />
        </PanelSettingsRow>
      )}
      {panelContent}
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
          snapPoints={[1, 0.5]}
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
        className={clsx(s.panelIcon, isMobile ? '' : s.desktop, 'knt-panel-icon')}
        icon={<Legend24 />}
      />
    </>
  );
}
