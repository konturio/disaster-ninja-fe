# MVA - Multivariate Analysis layer

MVA (Multivariate Analysis layer) - is a complex logical layer which can consist of several optional dimensions:

- `score`
- `base` ("compare")
- `text` ("label")
- `opacity` ("hide area")
- `extrusion` ("3D")

Depending on dimensions, several visual layers can be created on the map:

- fill layer, which can be have several color modes:
  - MCDA coloring (either `score` or `base` dimension is present). MCDA coloring is a linear gradient
  - Bivariate coloring (both `score` and `base` dimensions are present). Bivariate coloring uses a limited number of color classes, each with it's value range.
  - Monochrome coloring (neither `score` nor `base` dimensions are present; `opacity` or `extrusion` are present)
- text layer
- 3D (extrusion) layer
- opacity (pseudolayer, applies to fill layer)

## How to use

To start using this feature user needs:

- feature flag "multivariate_layer" is turned on for current user

### Activation

In toolbar, user can click "Create analysis layer" (analysis creation dialog pops up) or "Upload analysis layer" (config file upload) button.

### JSON structure

See `MultivariateLayerConfig` type for up-to date details.

1. `version` - will be used for config versioning.
2. `id` - id of the logical layer.
3. `score` - Score dimension. Contains MCDA layer config. Final MCDA score a feature is used for coloring.
4. `base` - Base (Compare) dimension. Contains MCDA layer config. Final MCDA score of a feature is used for coloring.
5. `stepOverrides` - only used for bivariate coloring. Defines value ranges for bivariate colors
6. `opacity` - Opacity dimension. Contains MCDA layer config. Final score is used to apply different levels of opacity to different features.
7. `text` - Text (Label) dimension. Can either display text based on MCDA config or using MapLibre expression.

- `mcdaValue` - Contains MCDA layer config. The output depends on `mcdaMode`
- `mcdaMode` property:
  - `score` - Single line of text (total MCDA score)
  - `layers` - One line of text for each of the MCDA axes (layers) in MCDA config
- `expressionValue` - optional property, can contain MapLibre expression, for custom outputs and calculations. `mcdaValue` overwrites this.
- `formatString` - optional string template. Replaces `{value}` and `{unit}` with MCDA axis value and unit accordingly. If not present, `{value} {unit}` template is used.
- `precision` - optional, number. How many numbers is retained after the decimal point.
- `paintOverrides` and `layoutOverrides` - optional, can be used to customize MapLibre paint and layer specification. See for more at [MapLibre Symbol layer style specification](https://maplibre.org/maplibre-style-spec/layers/#symbol)

8. `extrusion` - If present, extruded 3D shapes are rendered based for each of the features.

- `height` - Contains MCDA layer config. Final score is used to apply different height to different features.
- `maxHeight` - number in meters. Defines the biggest height of 3D shape. `maxHeight` is the height of mcda score === `1`

9. `colors` - Defines colors used by fill layer. Can be either `BivariateColorConfig` or `MCDAColorConfig`
10. `staticOpacity` - value in [0; 1] range. Can be used to make fill layer more transparent.

## MultivariateRenderer

Currently, the logic of creating all the physical Maplibre layers is contained in `src/core/logical_layers/renderers/MultivariateRenderer/MultivariateRenderer.tsx`.

## Further development notes

### MultivariateLayerConfig optimization

Generated MVA config currently contains a lot of unused/duplicated data, most of it in MCDA layer configs.

- `MultivariateDimension` type can be a `MCDAConfig` instead of `MCDALayerStyleConfig`
- `colors` property from MCDAConfig is not used in MVA
- `MCDAConfig` needs further optimnizations
  - having `id` in `MCDAConfig` is questionable
  - `transformationFunction` and `transformation` properties in `MCDALayer`. `transformationFunction` is deprecated and contained within `transformation`, so it should be removed from root level.
  - `AxisTransformationWithPoints` - `points` array is only used to show debug MCDA values distribution chart.

### MVA creation dialog

More user-friendly creation dialog should to be implemented.
