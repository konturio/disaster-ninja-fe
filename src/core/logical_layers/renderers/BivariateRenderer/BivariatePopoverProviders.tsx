import React from 'react';
import { MapHexTooltip } from '~components/MapHexTooltip/MapHexTooltip';
import { invertClusters } from '~utils/bivariate';
import { getCellLabelByValue } from '~utils/bivariate/bivariateLegendUtils';
import { isNumber } from '~utils/common';
import { isFeatureVisible } from '../helpers/featureVisibilityCheck';
import { generateMCDAPopupTable } from '../MCDARenderer/popup';
import type { IMapPopoverContentProvider, MapPopoverOptions } from '~core/map/types';
import type { MapMouseEvent } from 'maplibre-gl';
import type {
  BivariateLegend,
  BivariateLegendStep,
} from '~core/logical_layers/types/legends';
import type { MCDALayerStyle } from '../stylesConfigs/mcda/types';

// Helper function from BivariateRenderer
function calcValueByNumeratorDenominator(
  properties: Record<string, any>,
  numerator: string,
  denominator: string,
): number | null {
  const numeratorValue = properties[numerator];
  const denominatorValue = properties[denominator];

  if (
    !isNumber(numeratorValue) ||
    !isNumber(denominatorValue) ||
    denominatorValue === 0
  ) {
    return null;
  }

  return numeratorValue / denominatorValue;
}

// Helper function to convert fill color to CSS color string
function convertFillColorToString(fillColor: any): string {
  if (Array.isArray(fillColor) && fillColor.length >= 3) {
    const [r, g, b, a = 1] = fillColor;
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
  }
  // Fallback for other color formats
  return 'rgba(128, 128, 128, 1)';
}

/**
 * Content provider for bivariate layer feature popups.
 * Handles hexagon tooltip display with bivariate values and colors.
 */
export class BivariatePopoverProvider implements IMapPopoverContentProvider {
  constructor(
    private sourceId: string,
    private legend: BivariateLegend,
  ) {}

  renderContent(mapEvent: MapMouseEvent): React.ReactNode | null {
    const features = mapEvent.target
      .queryRenderedFeatures(mapEvent.point)
      .filter((f) => f.source.includes(this.sourceId));

    if (!features.length || !this.legend || !features[0].geometry) return null;

    const [feature] = features;

    // Skip when color empty or feature not visible
    if (!isFeatureVisible(feature) || !feature.properties) return null;

    const [xNumerator, xDenominator] = this.legend.axis.x.quotient;
    const [yNumerator, yDenominator] = this.legend.axis.y.quotient;

    const xValue = calcValueByNumeratorDenominator(
      feature.properties,
      xNumerator,
      xDenominator,
    );
    const yValue = calcValueByNumeratorDenominator(
      feature.properties,
      yNumerator,
      yDenominator,
    );

    if (!xValue || !yValue) return null;

    const fillColor = feature.layer.paint?.['fill-color'];
    if (!fillColor) return null;

    const hexagonColor = convertFillColorToString(fillColor);
    const cells: BivariateLegendStep[] = invertClusters(this.legend.steps, 'label');
    const cellLabel = getCellLabelByValue(
      this.legend.axis.x.steps,
      this.legend.axis.y.steps,
      Number(xValue),
      Number(yValue),
    );
    const cellIndex = cells.findIndex((i) => i.label === cellLabel);

    return (
      <MapHexTooltip
        cellLabel={cells[cellIndex].label}
        cellIndex={cellIndex}
        axis={this.legend.axis}
        values={{ x: String(xValue), y: String(yValue) }}
        hexagonColor={hexagonColor}
      />
    );
  }

  getPopoverOptions(): MapPopoverOptions {
    return {
      placement: 'top',
      closeOnMove: true,
      className: 'bivariate-popup',
    };
  }
}

/**
 * Content provider for MCDA layer feature popups.
 * Handles MCDA calculation display and scoring information.
 */
export class MCDAPopoverProvider implements IMapPopoverContentProvider {
  constructor(
    private sourceId: string,
    private style: MCDALayerStyle,
  ) {}

  renderContent(mapEvent: MapMouseEvent): React.ReactNode | null {
    const features = mapEvent.target
      .queryRenderedFeatures(mapEvent.point)
      .filter((f) => f.source.includes(this.sourceId));

    // Don't show popup when click in empty place
    if (!features.length || !features[0].geometry) return null;

    const [feature] = features;

    // Don't show popup when click on feature that filtered by map style
    if (!isFeatureVisible(feature)) return null;

    // Generate MCDA popup content directly as React element
    return generateMCDAPopupTable(feature, this.style.config.layers);
  }

  getPopoverOptions(): MapPopoverOptions {
    return {
      placement: 'top',
      closeOnMove: true,
      className: 'mcda-popup',
    };
  }
}
