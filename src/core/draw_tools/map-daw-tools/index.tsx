import React, { forwardRef } from 'react';
import MapDrawToolsComponent from './component';
import icons from './modesIcons';
import type { RenderProps, ModeConfig } from './component';
export { icons };

interface NebulaRef {
  current: unknown;
}

export interface Modes {
  // Edit modes
  ModifyMode?: boolean;
  ExtrudeMode?: boolean; // TODO: add icon
  RotateMode?: boolean;
  TranslateMode?: boolean; // TODO: add icon
  TransformMode?: boolean; // TODO: add icon
  ExtendLineStringMode?: boolean; // TODO: add icon
  SplitPolygonMode?: boolean;

  // drawModes
  DuplicateMode?: boolean;
  DrawLineStringMode?: boolean;
  DrawPolygonMode?: boolean;
  Draw90DegreePolygonMode?: boolean;
  DrawPolygonByDraggingMode?: boolean;
  DrawRectangleMode?: boolean;
  DrawRectangleUsingThreePointsMode?: boolean;
  DrawCircleFromCenterMode?: boolean;
  DrawCircleByDiameterMode?: boolean;
  DrawEllipseByBoundingBoxMode?: boolean;
  DrawEllipseUsingThreePointsMode?: boolean;

  // measureModes
  MeasureDistanceMode?: boolean;
  MeasureAreaMode?: boolean;
  MeasureAngleMode?: boolean;

  // TriggerModes
  DownloadMode?: boolean;
  UploadMode?: boolean;

  // Selection Modes
  SelectBoundaryMode?: boolean;

  ViewMode?: boolean;
}

interface MapDrawToolsProps {
  children: (renderProps: RenderProps) => React.ReactElement;
  geoJSON: GeoJSON.GeoJSON;
  mode?: keyof Modes;
  onEdit?: (editedData) => void;
  selectedFeatureIndexes?: number[];
  drawToolsRef?: NebulaRef;
  onModeChange?: (mode: string) => void;
  modeConfig?: ModeConfig;
  supportCyrillic?: boolean;
  onTriggerModeDataChange?: (data) => void;
  triggerOptions?: any;
}

function MapDrawTools(
  {
    children,
    geoJSON,
    mode = 'ViewMode',
    modeConfig,
    onEdit,
    selectedFeatureIndexes,
    onModeChange,
    supportCyrillic = false,
    onTriggerModeDataChange,
    triggerOptions,
  }: MapDrawToolsProps,
  ref,
) {
  return (
    <MapDrawToolsComponent
      drawToolsRef={ref}
      geoJSON={geoJSON}
      mode={mode}
      onEdit={onEdit}
      selectedFeatureIndexes={selectedFeatureIndexes}
      onModeChange={onModeChange}
      modeConfig={modeConfig}
      supportCyrillic={supportCyrillic}
      onTriggerModeDataChange={onTriggerModeDataChange}
      triggerOptions={triggerOptions}
    >
      {children}
    </MapDrawToolsComponent>
  );
}

export default forwardRef(MapDrawTools);
