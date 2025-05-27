import { Hexagon } from '~components/Hexagon/Hexagon';
import { i18n } from '~core/localization';
import {
  generateMCDALayersTableAndScore,
  generateMCDAPopupTable,
} from '../../MCDARenderer/popup';
import { PopupMCDA } from '../../MCDARenderer/components/PopupMCDA';
import { getDimensionLevelsAndHexagonParams } from '../helpers/multivariatePopupHelpers';
import s from './PopupMultivariate.module.css';
import type { MultivariateLayerConfig } from '../types';

export function PopupMultivariate(
  feature: GeoJSON.Feature,
  config: MultivariateLayerConfig,
) {
  let hexagonColor: string | undefined;
  let hexagonLabel: string | undefined;
  let scoreBivariateLevel: string | undefined;
  let baseBivariateLevel: string | undefined;
  const scoreMCDAAxes = config.score.config.layers;
  const { mcdaLayersTable: scoreAxesTable, resultMCDAScore: scoreResult } =
    generateMCDALayersTableAndScore(feature, scoreMCDAAxes);
  let baseTable;
  if (config.base) {
    const baseMCDAAxes = config.base?.config.layers ?? [];
    const { mcdaLayersTable: baseAxesTable, resultMCDAScore: baseResult } =
      generateMCDALayersTableAndScore(feature, baseMCDAAxes);

    if (config.colors?.type === 'bivariate') {
      const levelsAndHexagonParams = getDimensionLevelsAndHexagonParams(
        config.colors,
        config.stepOverrides,
        scoreResult,
        baseResult,
      );
      hexagonLabel = levelsAndHexagonParams.hexagonLabel;
      hexagonColor = levelsAndHexagonParams.hexagonColor;
      scoreBivariateLevel = levelsAndHexagonParams.scoreLevelLabel;
      baseBivariateLevel = levelsAndHexagonParams.baseLevelLabel;
    }

    baseTable = (
      <>
        <div>
          {i18n.t('multivariate.popup.compare_header', {
            level: baseBivariateLevel ? `(${baseBivariateLevel})` : '',
          })}
        </div>
        <div>
          <PopupMCDA
            layers={baseMCDAAxes}
            normalized={baseAxesTable}
            resultMCDA={baseResult}
          />
        </div>
      </>
    );
  }
  const scoreTable = (
    <div className={s.dimension}>
      <div>
        {i18n.t('multivariate.popup.score_header', {
          level: scoreBivariateLevel ? `(${scoreBivariateLevel})` : '',
        })}
      </div>
      <div>
        <PopupMCDA
          layers={scoreMCDAAxes}
          normalized={scoreAxesTable}
          resultMCDA={scoreResult}
        />
      </div>
    </div>
  );

  // opacity
  let opacityTable;
  if (config.opacity) {
    if (typeof config.opacity === 'number') {
      opacityTable = (
        <div>{`${i18n.t('multivariate.hide_area')}: ${config.opacity}`}</div>
      );
    } else {
      const opacityMCDAAxes = config.opacity.config.layers;
      opacityTable = (
        <>
          <div>{`${i18n.t('multivariate.hide_area')}`}</div>
          {generateMCDAPopupTable(feature, opacityMCDAAxes)}
        </>
      );
    }
  }

  // extrusion
  let extrusionTable;
  if (config.extrusion) {
    const extrusionMCDAAxes = config.extrusion.height.config.layers;
    opacityTable = (
      <>
        <div>{`${i18n.t('multivariate.3d')}`}</div>
        {generateMCDAPopupTable(feature, extrusionMCDAAxes)}
      </>
    );
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
      {opacityTable}
      {extrusionTable}
    </>
  );
}
