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
    marker: {
      x: 0,
      y: 0,
      width: 128,
      height: 165,
      anchorY: 160,
      // mask: true,
    }
  },
  // required to show data
  getIcon: d => {
    if (d.isHidden) return null
    return 'marker'
  },
  getPosition: d => d.coordinates,


  sizeScale: 15,
  getSize: d => 10,
  getColor: d => {

    console.log('%c⧭', 'color: #408059', d);
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