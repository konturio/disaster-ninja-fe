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
      x: 130,
      y: 0,
      width: 135,
      height: 165,
      anchorY: 160,
    }
  },
  // required to show data
  getIcon: d => {
    console.log('%c⧭', 'color: #eeff00', d);
    if (d.isHidden) return null
    if (d.isSelected) return 'selectedIcon'
    return 'defaultIcon'
  },
  getPosition: d => d.coordinates,


  sizeScale: 15,
  getSize: d => 10,
  getColor: d => {
    return [120, 140, 0]
  },

  onClick: info => console.log(info),


  // onIconError: null,
  // sizeMaxPixels: Number.MAX_SAFE_INTEGER,
  // sizeMinPixels: 0,
  // sizeScale: 8,
  // sizeUnits: 'pixels',

  /* props inherited from Layer class */

  // autoHighlight: false,
  // coordinateOrigin: [0, 0, 0],
  // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
  // highlightColor: [0, 0, 128, 128],
  // modelMatrix: null,
  // opacity: 1,
  pickable: true,
  // visible: true,
  // wrapLongitude: false,
  _subLayerProps: {
    guides: {}
  }
}