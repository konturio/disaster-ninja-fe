import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { drawModes } from '../constants';
import { LocalDrawPolygonMode } from '../modes/drawPolygon';
import Icon from '../icons/iconAtlas.png';
import app_config from '~core/app_config';

export const drawPolyDeckLayerConfig = {
  id: drawModes.DrawPolygonMode,
  type: EditableGeoJsonLayer,
  mode: LocalDrawPolygonMode,
  selectedFeatureIndexes: [],
  parameters: {
    depthTest: false, // skip z-buffer check
  },
  _subLayerProps: {
    guides: {
      getFillColor: [40, 150, 20, 70],
      getLineWidth: 3,
      getLineColor: [60, 120, 20, 120],
    },
  },
  modeConfig: {
    multipoint: true,
    disableSelfIntersections: true
  },

  editHandleType: 'icon',
  editHandleIconAtlas: Icon,
  editHandleIconMapping: app_config.iconLayer.iconMapping,
  editHandleIconSizeScale: app_config.iconLayer.sizeScale,
  getEditHandlePosition: d => d.coordinates,
  getEditHandleIconSize:() => 1.8,
  getEditHandleIcon: () => "pointIcon",
}
