import { Hexagon } from '~components/Hexagon/Hexagon';
import { i18n } from '~core/localization';
import { isNumber } from '~utils/common';
import {
  generateMCDALayersTableAndScore,
  generateMCDAPopupTable,
} from '../../MCDARenderer/popup';
import { PopupMCDA } from '../../MCDARenderer/components/PopupMCDA';
import { getDimensionLevelsAndHexagonParams } from '../helpers/multivariatePopupHelpers';
import s from './PopupMultivariate.module.css';
import type { MultivariateLayerConfig } from '../types';

function Dimension({
  title,
  tableContent,
}: {
  title: string;
  tableContent: JSX.Element;
}) {
  return (
    <div className={s.dimension}>
      <div className={s.dimensionTitle}>{title}</div>
      <div>{tableContent}</div>
    </div>
  );
}

export function PopupMultivariate(
  feature: GeoJSON.Feature,
  config: MultivariateLayerConfig,
) {
  let hexagonColor: string | undefined;
  let hexagonLabel: string | undefined;
  let scoreBivariateLevel: string | undefined;
  let baseBivariateLevel: string | undefined;

  let scoreContent: ReturnType<typeof generateMCDALayersTableAndScore> | undefined;
  let baseContent: ReturnType<typeof generateMCDALayersTableAndScore> | undefined;

  if (config.score?.config?.layers?.length) {
    scoreContent = generateMCDALayersTableAndScore(feature, config.score.config.layers);
  }

  if (config.base?.config?.layers?.length) {
    baseContent = generateMCDALayersTableAndScore(feature, config.base.config.layers);
  }

  if (
    config.colors?.type === 'bivariate' &&
    isNumber(scoreContent?.resultMCDAScore) &&
    isNumber(baseContent?.resultMCDAScore)
  ) {
    const levelsAndHexagonParams = getDimensionLevelsAndHexagonParams(
      config.colors,
      config.stepOverrides,
      scoreContent.resultMCDAScore,
      baseContent.resultMCDAScore,
    );
    hexagonLabel = levelsAndHexagonParams.hexagonLabel;
    hexagonColor = levelsAndHexagonParams.hexagonColor;
    scoreBivariateLevel = levelsAndHexagonParams.scoreLevelLabel;
    baseBivariateLevel = levelsAndHexagonParams.baseLevelLabel;
  }

  return (
    <>
      {hexagonLabel && hexagonColor ? (
        <Hexagon color={hexagonColor}>{hexagonLabel}</Hexagon>
      ) : (
        <></>
      )}
      {scoreContent && (
        <Dimension
          title={i18n.t('multivariate.popup.score_header', {
            level: scoreBivariateLevel ? `(${scoreBivariateLevel})` : '',
          })}
          tableContent={
            <PopupMCDA
              layers={scoreContent.layers}
              normalized={scoreContent.mcdaLayersTable}
              resultMCDA={scoreContent.resultMCDAScore}
            />
          }
        />
      )}
      {baseContent && (
        <Dimension
          title={i18n.t('multivariate.popup.compare_header', {
            level: baseBivariateLevel ? `(${baseBivariateLevel})` : '',
          })}
          tableContent={
            <PopupMCDA
              layers={baseContent.layers}
              normalized={baseContent.mcdaLayersTable}
              resultMCDA={baseContent.resultMCDAScore}
            />
          }
        />
      )}
      {config.opacity && (
        <Dimension
          title={i18n.t('multivariate.hide_area')}
          tableContent={
            typeof config.opacity === 'number' ? (
              <div>{config.opacity}</div>
            ) : (
              generateMCDAPopupTable(feature, config?.opacity?.config.layers ?? [])
            )
          }
        />
      )}
      {config.extrusion?.height?.config?.layers?.length && (
        <Dimension
          title={i18n.t('multivariate.3d')}
          tableContent={generateMCDAPopupTable(
            feature,
            config.extrusion?.height?.config?.layers,
          )}
        />
      )}
    </>
  );
}
