import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { drawModes } from "../constants";
import { LocalEditableGeojsonLayer } from "../layers/LocalEditableGeojsonLayer";
import { LocalModifyMode } from "../modes/modifyMode";
import Icon from '../icons/iconAtlas.png'
import app_config from "~core/app_config";


export const modifyDeckLayerConfig = {
  id: drawModes.ModifyMode,
  type: LocalEditableGeojsonLayer,
  mode: LocalModifyMode,
  parameters: {
    depthTest: false, // skip z-buffer check
    pickingRadius: 750
  },
  _subLayerProps: {
    tooltips: {
      // getSize: () => 20,
    },
    guides: {
      getFillColor: [30, 60, 20, 120],
      getLineWidth: 2,
      getLineColor: [20, 20, 10, 140],
    },
    geojson: {
      getFillColor: (a) => {
        if (a?.geometry?.type === 'Point') return null
        if (a?.properties?.temporary) return [40, 150, 20, 70]
        return [60, 20, 20, 100]
      },
      getLineColor: (a) => {
        if (a?.geometry?.type === 'Point') return null
        if (a?.properties?.temporary) return [60, 120, 20, 120]
        return [150, 10, 20, 180]
      },
      stroked: true
    },
  },
  // editHandleType: 'icon',  //starts search for icons. However it's unknown where to put these props https://deck.gl/docs/api-reference/layers/icon-layer

  editHandleType: 'icon',
  editHandleIconAtlas: Icon,
  editHandleIconMapping: app_config.iconLayer.iconMapping,
  editHandleIconSizeScale: 6,
  getEditHandleIcon: d => {
    return 'selectedIcon'
  },
  getEditHandleIconSize: 6,
  getEditHandlePosition: d => d.coordinates,
  pickable: true,

  geojsonIcons: {
    iconAtlas: Icon,
    iconMapping: app_config.iconLayer.iconMapping,
    // required to show data
    getIcon: d => {
      if (d.properties.isHidden) return null
      if (d.properties.isSelected) return null
      return 'defaultIcon'
    },
    getPosition: d => d.coordinates,
  
  
    sizeScale: app_config.iconLayer.sizeScale,
    getSize: app_config.iconLayer.getSize,
  
  
    pickable: true,
    _subLayerProps: {
      guides: {}
    }

  }
}


// https://deck.gl/docs/api-reference/layers/geojson-layer#data