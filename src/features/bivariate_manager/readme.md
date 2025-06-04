## Bivariate Manager

Bivariate manager is a tool for analyzing and finding new insights from a set of suggested layers.

Some terms:

Indicator - any value at a cell. For example, a number of people at hexagon cell.

Axis - a pair of indicators where one is divided by another one. For example, a number of people per square kilometer in a hexagon cell.

Numerator (in axis) - a dividend indicator in axis.

Denominator (in axis) - a divisor indicator in axis.

### How to activate

It requires feature `bivariate_manager` turned on.

### What's inside

1. bivariateStatisticsResourceAtom
   Loads data from `/bivariate_matrix`, if focusedGeometry is empty - make a full world data request.

2. bivariateNumeratorsAtom

   Extracts all available numerators with denominators after `bivariateStatisticsResourceAtom` is loaded.

3. bivariateCorrelationMatrixAtom

   Creates matrix from `bivariateNumeratorsAtom` and fills it will rates from `bivariateStatisticsResourceAtom` response.

4. bivariateMatrixSelectionAtom

   Selection in matrix component processed here.

   - `runPreselection` is called when you open matrix, to set up initial selection (in case if bivariate layer was selected before matrix opening)
   - `setMatrixSelection` happens after selection of x and y layers pair, it creates a legend, colorTheme and a layer, then registers it in layersRegistryAtom and activates it.

5. bivariateColorThemeUtils

   Important part of bivariate, that is used for colorTheme and legend generation. It includes logic of setting colors for legend (A1 - C3) and painting rules for mapbox using these colors.

   How layer coloring works:

   In `bivariateMatrixSelectionAtom.setMatrixSelection` calls `generateColorThemeAndBivariateStyle` method, that returns colorTheme and bivariateStyle.

   - colorTheme is {id: "A1", color: "rgba(232,232,157,0.5)"}[] format
   - bivariateStyle is needed for producing tiles source

   Then colorTheme is used to produce a legend. (`<BivariateLegend/>` component data)

The resulting legend is converted by `legendToMultivariateStyle` inside `BivariateRenderer` (now a thin wrapper over `MultivariateRenderer`).
That class handles creating MapLibre layers with the proper style rules for every legend step.

For reference use [mapbox documentation](https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/)
