import { Hexagon } from '~components/Hexagon/Hexagon';
import { i18n } from '~core/localization';
import { generateMCDALayersTableAndScore } from '../../MCDARenderer/popup';
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
          {i18n.t('multivariate.popup.base_header', {
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

  return (
    <>
      {hexagonLabel && hexagonColor ? (
        <Hexagon color={hexagonColor}>{hexagonLabel}</Hexagon>
      ) : (
        <></>
      )}
      {scoreTable}
      {baseTable}
    </>
  );
}
