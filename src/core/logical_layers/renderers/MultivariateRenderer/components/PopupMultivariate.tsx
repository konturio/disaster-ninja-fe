import { getCellLabelByValue } from '~utils/bivariate/bivariateLegendUtils';
import { DEFAULT_MULTIBIVARIATE_STEPS } from '~utils/multivariate/constants';
import { Hexagon } from '~components/Hexagon/Hexagon';
import {
  generateMCDALayersTableAndScore,
  generateMCDAPopupTable,
} from '../../MCDARenderer/popup';
import { PopupMCDA } from '../../MCDARenderer/components/PopupMCDA';
import type { MultivariateLayerConfig } from '../types';

export function PopupMultivariate(
  feature: GeoJSON.Feature,
  config: MultivariateLayerConfig,
) {
  let hexagonColor: string | undefined;
  let hexagonLabel: string | undefined;
  const scoreMCDAAxes = config.score.config.layers;
  const { mcdaLayersTable: scoreAxesTable, resultMCDAScore: scoreResult } =
    generateMCDALayersTableAndScore(feature, scoreMCDAAxes);
  const scoreTable = (
    <>
      <div>Score:</div>
      <div>
        <PopupMCDA
          layers={scoreMCDAAxes}
          normalized={scoreAxesTable}
          resultMCDA={scoreResult}
        />
      </div>
    </>
  );
  let baseTable;
  if (config.base) {
    const baseMCDAAxes = config.base?.config.layers ?? [];
    const { mcdaLayersTable: baseAxesTable, resultMCDAScore: baseResult } =
      generateMCDALayersTableAndScore(feature, baseMCDAAxes);
    baseTable = (
      <>
        <div>Base:</div>
        <div>
          <PopupMCDA
            layers={baseMCDAAxes}
            normalized={baseAxesTable}
            resultMCDA={baseResult}
          />
        </div>
      </>
    );

    if (config.colors?.type === 'bivariate') {
      hexagonLabel = getCellLabelByValue(
        config.stepOverrides?.scoreSteps ?? DEFAULT_MULTIBIVARIATE_STEPS,
        config.stepOverrides?.baseSteps ?? DEFAULT_MULTIBIVARIATE_STEPS,
        scoreResult,
        baseResult,
      );
      hexagonColor = config.colors?.colors.find(
        (color) => color.id === hexagonLabel,
      )?.color;
    }
  }

  // strength
  let strengthTable;
  if (config.strength) {
    if (typeof config.strength === 'number') {
      strengthTable = <div>Strength: {config.strength}</div>;
    } else {
      const strengthMCDAAxes = config.strength.config.layers;
      strengthTable = (
        <>
          <div>Strength:</div>
          {generateMCDAPopupTable(feature, strengthMCDAAxes)}
        </>
      );
    }
  }
  let extrusionHeightTable;
  if (config.extrusionMax) {
    if (typeof config.extrusionMax === 'number') {
      extrusionHeightTable = <div>Extrusion height: {config.extrusionMax}</div>;
    } else {
      const extrusionHeightMCDAAxes = config.extrusionMax.config.layers;
      extrusionHeightTable = (
        <>
          <div>Extrusion height:</div>
          <div>{generateMCDAPopupTable(feature, extrusionHeightMCDAAxes)}</div>
        </>
      );
    }
  }

  return (
    <>
      {hexagonLabel && hexagonColor ? (
        <Hexagon color={hexagonColor}>{hexagonLabel}</Hexagon>
      ) : (
        <></>
      )}
      {scoreTable}
      {baseTable}
      {strengthTable}
      {extrusionHeightTable}
    </>
  );
}
