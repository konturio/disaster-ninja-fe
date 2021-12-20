import { IconLayer } from "@deck.gl/layers";
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
  iconMapping: {
    defaultIcon: {
      x: 0,
      y: 0,
      width: 128,
      height: 165,
      anchorY: 160,
      // mask: true,
    },
    selectedIcon: {
      x: 128,
      y: 0,
      width: 128,
      height: 165,
      anchorY: 160,
    }
  },
  // required to show data
  getIcon: d => {
    if (d.isHidden) return null
    if (d.isSelected) return 'selectedIcon'
    return 'defaultIcon'
  },
  getPosition: d => d.coordinates,


  sizeScale: 6,
  getSize: d => 10,
  onClick: info => console.log(info),


  pickable: true,
  _subLayerProps: {
    guides: {}
  }
}