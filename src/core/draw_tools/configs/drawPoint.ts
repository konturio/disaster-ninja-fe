import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { drawModes } from '../constants';
import { LocalDrawPointMode } from '../modes/drawPoint';

export const drawPointDeckLayerConfig = {
  id: drawModes.DrawPointMode,
  type: EditableGeoJsonLayer,
  mode: LocalDrawPointMode,
  selectedFeatureIndexes: [],
  _subLayerProps: {
    guides: {},
  },
};
