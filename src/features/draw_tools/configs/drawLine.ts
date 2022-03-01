import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { drawModes, iconLayer } from '../constants';
import { LocalDrawLineStringMode } from '../modes/drawLine';
import Icon from '../icons/iconAtlas.png';

export const drawLineDeckLayerConfig = {
  id: drawModes.DrawLineMode,
  type: EditableGeoJsonLayer,
  mode: LocalDrawLineStringMode,
  selectedFeatureIndexes: [],
  parameters: {
    depthTest: false, // skip z-buffer check
  },
  _subLayerProps: {
    guides: {
      getLineWidth: 4,
      getLineColor: [60, 120, 20, 120],
    },
  },

  editHandleType: 'icon',
  editHandleIconAtlas: Icon,
  editHandleIconMapping: iconLayer.iconMapping,
  editHandleIconSizeScale: iconLayer.sizeScale,
  getEditHandlePosition: (d) => d.coordinates,
  getEditHandleIconSize: () => 1.8,
  getEditHandleIcon: () => 'pointIcon',
};
