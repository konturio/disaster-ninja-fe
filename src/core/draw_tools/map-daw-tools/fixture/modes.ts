const drawModes = [
  'ModifyMode',
  'ExtrudeMode',
  'RotateMode',
  'TranslateMode',
  'TransformMode',
  'ExtendLineStringMode',
  'SplitPolygonMode',
  'DuplicateMode',
  'DrawLineStringMode',
  'DrawPolygonMode',
  'Draw90DegreePolygonMode',
  'DrawPolygonByDraggingMode',
  'DrawRectangleMode',
  'DrawRectangleUsingThreePointsMode',
  'DrawCircleFromCenterMode',
  'DrawCircleByDiameterMode',
  'DrawEllipseByBoundingBoxMode',
  'DrawEllipseUsingThreePointsMode',
  'MeasureDistanceMode',
  'MeasureAreaMode',
  'MeasureAngleMode',
  'DownloadMode',
  'UploadMode',
  'SelectBoundaryMode',
  'ViewMode',
] as const;

type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

export type DrawModes = CreateMutable<typeof drawModes>;
export default drawModes;
