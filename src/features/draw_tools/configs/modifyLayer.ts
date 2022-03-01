import { drawModes, iconLayer } from '../constants';
import { LocalEditableGeojsonLayer } from '../layers/LocalEditableGeojsonLayer';
import { LocalModifyMode } from '../modes/modifyMode';
import Icon from '../icons/iconAtlas.png';

export const modifyDeckLayerConfig = {
  id: drawModes.ModifyMode,
  type: LocalEditableGeojsonLayer,
  mode: LocalModifyMode,
  parameters: {
    depthTest: false, // skip z-buffer check
    pickingRadius: 200,
  },
  _subLayerProps: {
    guides: {
      getFillColor: [30, 60, 20, 120],
      getLineWidth: 2,
      getLineColor: [20, 20, 10, 140],
    },
    geojson: {
      getFillColor: (a) => {
        if (a?.geometry?.type === 'Point') return null;
        if (a?.properties?.temporary) return [40, 150, 20, 70];
        return [0, 204, 255, 40];
      },
      getLineColor: (a) => {
        if (a?.geometry?.type === 'Point') return null;
        if (a?.properties?.temporary) return [60, 120, 20, 120];
        return [12, 155, 237, 255];
      },
      stroked: true,
    },
  },

  editHandleType: 'icon',
  editHandleIconAtlas: Icon,
  editHandleIconMapping: iconLayer.iconMapping,
  editHandleIconSizeScale: iconLayer.sizeScale,
  getEditHandlePosition: (d) => d.coordinates,

  geojsonIcons: {
    iconAtlas: Icon,
    iconMapping: iconLayer.iconMapping,
    // required to show data
    // getIcon: 'iconname', - described later in drawModeLayer
    getPosition: (d) => d.coordinates,

    sizeScale: iconLayer.sizeScale,
    getSize: () => iconLayer.size,

    pickable: true,
    _subLayerProps: {
      guides: {},
    },
  },
};
