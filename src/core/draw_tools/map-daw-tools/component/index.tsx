import { useState, useEffect, useCallback } from 'react';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import * as NebulaModes from '@nebula.gl/edit-modes';
import { CustomMeasureDistanceMode } from '../customDrawModes/CustomMeasureDistanceMode';
import { CustomMeasureAreaMode } from '../customDrawModes/CustomMeasureAreaMode';
import { CustomDrawPolygonMode } from '../customDrawModes/CustomDrawPolygonMode';
import { CustomModifyMode } from '../customDrawModes/CustomModifyMode';
import { SelectBoundaryMode } from '../customDrawModes/SelectBoundaryMode';
import { useTriggers } from './useTriggers';
import { getModeDefaults } from './getModeDefaults';

// add cyrilic alphabet to character set
function getCyryllicCharacterSet() {
  const charSet: string[] = [];
  for (let i = 32; i <= 175; i++) {
    charSet.push(String.fromCharCode(i));
  }
  const cyrLettersBig =
    'А,Б,В,Г,Д,Е,Ё,Ж,З,И,Й,К,Л,М,Н,О,П,Р,С,Т,У,Ф,Х,Ц,Ч,Ш,Щ,Ъ,Ы,Ь,Э,Ю,Я';
  const cyrLettersSmall = cyrLettersBig.toLowerCase();

  return charSet
    .concat(cyrLettersBig.split(','))
    .concat(cyrLettersSmall.split(','));
}

// patch modes
const modes = { ...NebulaModes };
modes['MeasureDistanceMode'] = CustomMeasureDistanceMode as any;
modes['MeasureAreaMode'] = CustomMeasureAreaMode as any;
modes['DrawPolygonMode'] = CustomDrawPolygonMode as any;
modes['ModifyMode'] = CustomModifyMode as any;
modes['SelectBoundaryMode'] = SelectBoundaryMode as any;

interface NebulaRef {
  current: unknown;
}

type EditableLayer = {
  id: string;
  type: unknown;
};

export interface ModeConfig {
  [key: string]: any;
}

export interface RenderProps {
  editableLayer?: EditableLayer;
}

interface MapDrawToolsComponentProps {
  children: (props: RenderProps) => React.ReactElement;
  geoJSON: GeoJSON.GeoJSON;
  mode?: string;
  drawToolsRef?: NebulaRef;
  onEdit?: (editedData) => void;
  onModeChange?: (mode: string) => void;
  selectedFeatureIndexes?: number[];
  modeConfig?: ModeConfig;
  supportCyrillic?: boolean;
  onTriggerModeDataChange?: (data) => void;
  triggerOptions?: any;
}

const EMPTY_ARR = [];
const DEFAULT_MODE = 'ViewMode';

function hex2rgb(hex: string) {
  const value = parseInt(hex, 16);
  return [16, 8, 0].map((shift) => ((value >> shift) & 0xff) / 255);
}

const FEATURE_COLORS = [
  '00AEE4',
  'DAF0E3',
  '9BCC32',
  '07A35A',
  'F7DF90',
  'EA376C',
  '6A126A',
  'FCB09B',
  'B0592D',
  'C1B5E3',
  '9C805B',
  'CCDFE5',
].map(hex2rgb);

function getDeckColorForFeature(index: number, bright: number, alpha: number) {
  const length = FEATURE_COLORS.length;
  const color = FEATURE_COLORS[index % length].map((c) => c * bright * 255);

  return [...color, alpha * 255];
}

export default function MapDrawToolsComponent({
  children,
  geoJSON,
  onEdit,
  onModeChange,
  mode,
  modeConfig = {},
  drawToolsRef,
  selectedFeatureIndexes = EMPTY_ARR,
  supportCyrillic = false,
  onTriggerModeDataChange,
  triggerOptions,
}: MapDrawToolsComponentProps) {
  const [data, setData] = useState(geoJSON);
  // Sync data from prop and layer props
  useEffect(() => {
    setData(geoJSON);
  }, [geoJSON]);

  const [currentMode, setCurrentMode] = useState(DEFAULT_MODE);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>(
    selectedFeatureIndexes,
  );

  /**
   * TriggerModes it's some kind of "fake" modes,
   * where enabling mode just trigger some event and automatically off
   **/
  const triggerCallback = onTriggerModeDataChange
    ? (data) => {
        onTriggerModeDataChange(data);
        setData(data);
      }
    : setData;
  const isTriggerMode = useTriggers(
    mode,
    data,
    triggerCallback,
    triggerOptions,
  );

  let _subLayerProps: any = {};

  if (supportCyrillic) {
    _subLayerProps = {
      ..._subLayerProps,
      tooltips: {
        characterSet: getCyryllicCharacterSet(),
      },
    };
  }

  useEffect(() => {
    if (isTriggerMode(mode)) {
      setCurrentMode(DEFAULT_MODE);
      onModeChange && onModeChange(DEFAULT_MODE);
    } else {
      mode && setCurrentMode(mode);
    }
  }, [mode, setCurrentMode]);

  const onEditProp = useCallback((e) => {
    if (
      e.editType === 'selectFeature' &&
      e.editContext &&
      e.editContext.featureIndexes
    ) {
      setSelectedIndexes(e.editContext.featureIndexes);
    }

    if (onEdit) {
      onEdit(e);
      return;
    }

    setData(e.updatedData);
  }, []);

  // Check it onEdit exist - call it, else: self update data
  const [editableLayer, setEditableLayer] = useState<EditableLayer>();
  useEffect(() => {
    const DeckGLLayer = {
      id: 'editable-layer',
      type: EditableGeoJsonLayer,
      data: data || { type: 'FeatureCollection', features: [] },
      mode: modes[currentMode],
      selectedFeatureIndexes: selectedIndexes,
      onEdit: onEditProp,
      parameters: {
        // https://github.com/visgl/deck.gl/issues/4680
        depthTest: false, // https://luma.gl/docs/api-reference/gltools/parameter-setting#depth-test
      },
      _subLayerProps,
      ...(getModeDefaults(currentMode) || {}),
      modeConfig: modeConfig[currentMode],
      getFillColor: function (feature, isSelected) {
        const index =
          DeckGLLayer.data &&
          DeckGLLayer.data.features &&
          DeckGLLayer.data.features.length
            ? DeckGLLayer.data.features.indexOf(feature)
            : 0;
        return isSelected
          ? getDeckColorForFeature(index, 0.7, 0.7)
          : getDeckColorForFeature(index, 0.5, 0.7);
      },
      getLineColor: (feature, isSelected) => {
        const index =
          DeckGLLayer.data &&
          DeckGLLayer.data.features &&
          DeckGLLayer.data.features.length
            ? DeckGLLayer.data.features.indexOf(feature)
            : 0;
        return isSelected
          ? getDeckColorForFeature(index, 0.7, 1.0)
          : getDeckColorForFeature(index, 0.5, 1.0);
      },
    };

    setEditableLayer(DeckGLLayer);
  }, [data, currentMode, onEdit, selectedFeatureIndexes, setData]);

  useEffect(() => {
    /* If someone want get ref of draw tool */
    if (drawToolsRef) drawToolsRef.current = editableLayer;
  }, [editableLayer]);

  return children({ editableLayer });
}
