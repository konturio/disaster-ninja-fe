# Multivariate Analysis Layer Config Interface (v1)

This document describes the structure of the `MultivariateLayerConfig` TypeScript interface used to configure multivariate analysis layers. These layers combine MCDA, bivariate colouring, text labels, opacity masks and 3D extrusions.

## Interface definition

```typescript
import type { ExpressionSpecification, SymbolLayerSpecification } from 'maplibre-gl';

export interface MultivariateLayerConfig {
  version: 0;
  id: string;
  name: string;
  score: MultivariateDimension; // main MCDA dimension
  base?: MultivariateDimension; // comparison dimension for bivariate style
  stepOverrides?: {
    baseSteps?: Step[];
    scoreSteps?: Step[];
  };
  opacity?: MultivariateDimension | number; // MCDA layer or static value
  text?: {
    expressionValue?: ExpressionSpecification;
    mcdaValue?: MultivariateDimension;
    mcdaMode?: 'score' | 'layers';
    formatString?: string;
    precision?: number;
    paintOverrides?: SymbolLayerSpecification['paint'];
    layoutOverrides?: SymbolLayerSpecification['layout'];
  };
  extrusion?: {
    height: MultivariateDimension;
    maxHeight: number;
  };
  colors?: {
    type: 'bivariate' | 'mcda';
    colors: ColorTheme | ColorsBySentiments | ColorsByMapLibreExpression;
  };
}
```

See [`src/core/logical_layers/renderers/MultivariateRenderer/types.ts`](../src/core/logical_layers/renderers/MultivariateRenderer/types.ts) for the source definition.

### Required fields

- **version** – configuration schema version (currently only `0`).
- **id** – unique identifier for the layer. Usually generated with `generateMultivariateId()`.
- **name** – human‑readable layer name shown in the UI.
- **score** – MCDA dimension describing how to calculate the main score.

### Optional fields

- **base** – additional MCDA dimension used to produce bivariate colouring when present alongside `score`.
- **stepOverrides** – custom steps for score and base dimensions.
- **opacity** – either a static number (0–1) or an MCDA dimension controlling hex opacity.
- **text** – parameters for rendering labels. May display MCDA results or use a MapLibre expression.
- **extrusion** – enables 3D cylinders using a MCDA dimension and maximum height.
- **colors** – colour scheme, either `mcda` or `bivariate`.

## Creating a configuration

Use `createMultivariateConfig()` from `src/features/multivariate_layer/helpers/createMultivariateConfig.ts` to build a valid configuration from selected MCDA layers and optional overrides. The result can be saved to a file and loaded later via the "Upload analysis layer" control (enabled by the `multivariate_analysis` feature flag).

## Usage

A `MultivariateLayerConfig` object is passed to `createMultivariateLayer()` which registers the renderer, legend and editor for the layer. If the configuration contains both `score` and `base` dimensions, a bivariate colour matrix is used. Otherwise, MCDA colours are applied. Opacity, text and extrusion dimensions are optional and are rendered if provided.
