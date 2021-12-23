import { IconLayer } from "@deck.gl/layers";
import app_config from "~core/app_config";
import { drawModes } from "../constants";
import Icon from '../icons/iconAtlas.png'

export const showIconDeckLayerConfig = {
  id: drawModes.ShowIcon,
  type: IconLayer,
  /**
  * Data format:
  * [
  *   { coordinates: [-122.466233, 37.684638] },
  *   ...
  * ]
  * source https://deck.gl/docs/api-reference/layers/icon-layer
  */

  // required by class
  iconAtlas: Icon,
  iconMapping: app_config.iconLayer.iconMapping,
  // required to show data
  getIcon: d => {
    if (d.isHidden) return null
    if (d.isSelected) return 'selectedIcon'
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