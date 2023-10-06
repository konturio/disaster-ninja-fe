export const DRAW_TOOLS_LAYER_ID = 'draw-tools';

export const DOWNLOAD_GEOMETRY_CONTROL_ID = 'DownloadGeometry';
export const DOWNLOAD_GEOMETRY_CONTROL_NAME = 'Download Custom Geometry';

export const drawModes = {
  DrawPolygonMode: 'DrawPolygonMode',
  DrawLineMode: 'DrawLineMode',
  DrawPointMode: 'DrawPointMode',
  ModifyMode: 'ModifyMode',
} as const;

export type DrawModeType = keyof typeof drawModes;
export const createDrawingLayers = ['DrawPolygonMode', 'DrawLineMode', 'DrawPointMode'];
export const editDrawingLayers = ['ModifyMode'];
export const iconLayer = {
  iconMapping: {
    selectedIcon: {
      x: 0,
      y: 0,
      width: 128,
      height: 165,
      anchorY: 160,
    },
    defaultIcon: {
      x: 128,
      y: 0,
      width: 128,
      height: 165,
      anchorY: 160,
    },
    pointIcon: {
      x: 0,
      y: 165,
      width: 20,
      height: 20,
      anchorY: 10,
    },
  },
  sizeScale: 6,
  size: 6,
};
