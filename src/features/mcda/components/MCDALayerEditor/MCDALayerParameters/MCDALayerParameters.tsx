import { Prefs16 } from '@konturio/default-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Select, Text } from '@konturio/ui-kit';
import { useAtom } from '@reatom/npm-react';
import clsx from 'clsx';
import { i18n } from '~core/localization';
import { LAYERS_PANEL_FEATURE_ID } from '~features/layers_panel/constants';
import { isNumber } from '~utils/common';
import { LayerActionIcon } from '~components/LayerActionIcon/LayerActionIcon';
import { LayerInfo } from '~components/LayerInfo/LayerInfo';
import { availableBivariateAxesAtom } from '~features/mcda/atoms/availableBivariateAxisesAtom';
import { getAxisTransformations } from '~core/api/mcda';
import { KonturSpinner } from '~components/LoadingSpinner/KonturSpinner';
import { Sentiments } from '../Sentiments';
import MCDARangeControls from '../MCDARangeControls/MCDARangeControls';
import { MCDALayerParameterRow } from './MCDALayerParameterRow/MCDALayerParameterRow';
import s from './MCDALayerParameters.module.css';
import {
  MCDA_LAYER_DEFAULTS as DEFAULTS,
  POSITIVE_NUMBER_FILTER,
  SENTIMENT_VALUES,
  normalizationOptions,
  outliersOptions,
  sentimentColors,
  sentimentsOptions,
  transformOptions,
} from './constants';
import MCDATransformationDebugInfo from './MCDATransformationDebugInfo/MCDATransformationDebugInfo';
import type {
  MCDALayer,
  OutliersPolicy,
  TransformationFunction,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { Normalization } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { AxisTransformationWithPoints } from '~utils/bivariate';

export type MCDALayerLegendProps = {
  layer: MCDALayer;
  onLayerEdited: (editedMCDALayer: MCDALayer) => void;
};

export function MCDALayerParameters({ layer, onLayerEdited }: MCDALayerLegendProps) {
  const [editMode, setEditMode] = useState(false);
  const [sentiment, setSentiment] = useState(DEFAULTS.sentiment as string);
  const [rangeFrom, setRangeFrom] = useState(DEFAULTS.range[0]);
  const [rangeTo, setRangeTo] = useState(DEFAULTS.range[1]);
  const [outliers, setOutliers] = useState(DEFAULTS.outliers as OutliersPolicy);
  const [coefficient, setCoefficient] = useState(DEFAULTS.coefficient.toString());
  const [transformationFunction, setTransformationFunction] =
    useState<TransformationFunction>(DEFAULTS.transform as TransformationFunction);
  const [normalization, setNormalization] = useState<Normalization>(
    DEFAULTS.normalization as Normalization,
  );
  const [transformationsStatistics, setTransformationsStatistics] = useState<Map<
    TransformationFunction,
    AxisTransformationWithPoints
  > | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const [rangeFromError, setRangeFromError] = useState('');
  const [rangeToError, setRangeToError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setRangeFrom(layer.range?.at(0)?.toString() ?? '');
    setRangeTo(layer.range?.at(1)?.toString() ?? '');
    setSentiment(layer.sentiment.at(0) === 'good' ? 'good-bad' : 'bad-good');
    setCoefficient(layer.coefficient.toString());
    setTransformationFunction(
      layer.transformation?.transformation ?? layer.transformationFunction,
    );
    setNormalization(layer.normalization);
    setOutliers(layer.outliers ?? DEFAULTS.outliers);
  }, [layer]);

  const [axes] = useAtom((ctx) => ctx.spy(availableBivariateAxesAtom));

  const { axisDatasetRange } = useMemo(() => {
    let axisDatasetRange: string[] | null = null;
    if (!axes.loading) {
      const relatedAxis = axes?.data?.find((axis) => axis.id === layer.id);
      if (relatedAxis?.datasetStats) {
        axisDatasetRange = [
          relatedAxis.datasetStats.minValue?.toString(),
          relatedAxis.datasetStats.maxValue?.toString(),
        ];
      } else {
        // TODO: remove this else case once all MCDA presets have datasetStats
        const steps = relatedAxis?.steps;
        const min = steps?.at(0)?.value;
        const max = steps?.at(-1)?.value;
        axisDatasetRange =
          isNumber(min) && isNumber(max) ? [min.toString(), max.toString()] : null;
      }
    }
    return { axisDatasetRange };
  }, [axes?.data, axes?.loading, layer.id]);

  const mcdaLayerHint: LayerInfo[] = useMemo(() => {
    const description = layer.indicators?.[0]?.description;
    const copyrightsCombined: string[] = [];
    layer?.indicators?.forEach((indicator) => {
      if (indicator.copyrights) {
        for (const copyright of indicator.copyrights) {
          // only add if this copyright isn't included yet
          if (!copyrightsCombined.find((v) => v === copyright)) {
            copyrightsCombined.push(copyright);
          }
        }
      }
    });
    return [
      {
        description,
        copyrights: copyrightsCombined,
      },
    ];
  }, [layer?.indicators]);

  const nonDefaultValues = useMemo(() => {
    const result: { paramName: string; value: unknown }[] = [];
    if (layer.coefficient !== DEFAULTS.coefficient) {
      result.push({
        paramName: i18n.t('mcda.layer_editor.weight'),
        value: layer.coefficient,
      });
    }
    if (layer.transformationFunction !== DEFAULTS.transform) {
      result.push({
        paramName: i18n.t('mcda.layer_editor.transformation'),
        value: layer.transformationFunction,
      });
    }
    if (layer.normalization !== DEFAULTS.normalization) {
      result.push({
        paramName: i18n.t('mcda.layer_editor.normalization'),
        value: layer.normalization,
      });
    }
    if (layer.outliers !== DEFAULTS.outliers) {
      result.push({
        paramName: i18n.t('mcda.layer_editor.outliers'),
        value: layer.outliers,
      });
    }
    return result;
  }, [layer]);

  const sentiments = useMemo(() => {
    const isGoodLeft = layer.sentiment[0] === 'good';
    return {
      left: {
        label: layer.sentiment.at(0)!, // Sentiments name needed instead of id
        color: isGoodLeft ? sentimentColors.good : sentimentColors.bad,
        value: String(layer.range.at(0)),
      },
      right: {
        label: layer.sentiment.at(1)!,
        color: isGoodLeft ? sentimentColors.bad : sentimentColors.good,
        value: String(layer.range.at(1)),
      },
    };
  }, [layer]);

  /** VALIDATION */
  const coefficientError: string | undefined = useMemo(() => {
    const coefficientNum = Number(coefficient);
    if (!coefficient) {
      return i18n.t('mcda.layer_editor.errors.weight_cannot_be_empty');
    } else if (!isNumber(coefficientNum)) {
      return i18n.t('mcda.layer_editor.errors.weight_must_be_a_number');
    }
    return undefined;
  }, [coefficient]);

  /** CALLBACKS */
  const onSaveLayer = useCallback(() => {
    const rangeNum = [Number(rangeFrom), Number(rangeTo)];
    const coefficientNum = Number(coefficient);
    const updatedLayer: MCDALayer = {
      ...layer,
      range: [
        isNumber(rangeNum[0]) ? rangeNum[0] : 0,
        isNumber(rangeNum[1]) ? rangeNum[1] : 1000,
      ],
      sentiment: SENTIMENT_VALUES[sentiment],
      outliers,
      coefficient: isNumber(coefficientNum) ? coefficientNum : 1,
      transformationFunction,
      transformation: transformationsStatistics?.get(transformationFunction),
      normalization,
    };
    setEditMode(false);
    onLayerEdited(updatedLayer);
  }, [
    coefficient,
    layer,
    normalization,
    onLayerEdited,
    outliers,
    rangeFrom,
    rangeTo,
    sentiment,
    transformationFunction,
    transformationsStatistics,
  ]);

  const onCancel = useCallback(() => {
    setEditMode(false);
  }, []);

  const onReverseSentiment = useCallback(() => {
    const newSentiment = (
      sentiment === sentimentsOptions[0].value
        ? sentimentsOptions[1].value
        : sentimentsOptions[0].value
    ) as string;

    const updatedLayer: MCDALayer = {
      ...layer,
      sentiment: SENTIMENT_VALUES[newSentiment],
    };
    if (editMode) {
      onCancel();
    }
    onLayerEdited(updatedLayer);
  }, [editMode, layer, onCancel, onLayerEdited, sentiment]);

  const editLayer = useCallback(async () => {
    setEditMode(true);
    setIsLoading(true);
    try {
      const transformationsStatisticsDTO = await getAxisTransformations(
        layer.indicators[0].name,
        layer.indicators[1].name,
      );
      setTransformationsStatistics(
        new Map(transformationsStatisticsDTO?.map((t) => [t.transformation, t])),
      );
    } catch {
      throw new Error("Couldn't fetch transformations statistics data.");
    } finally {
      setIsLoading(false);
    }
  }, [layer.indicators]);

  return (
    <div>
      <div key={layer.id} className={s.layer}>
        <div className={s.layerHeader}>
          <div>{layer.name}</div>
          <div className={s.layerButtons}>
            {!editMode && (
              <LayerActionIcon
                onClick={editLayer}
                hint={i18n.t('layer_actions.tooltips.edit')}
                className={s.editButton}
              >
                <Prefs16 />
              </LayerActionIcon>
            )}
            <LayerInfo
              className={s.infoButton}
              layersInfo={mcdaLayerHint}
              tooltipId={LAYERS_PANEL_FEATURE_ID}
            />
          </div>
        </div>
        <div>
          <Sentiments
            left={sentiments.left}
            right={sentiments.right}
            units={layer.unit}
          />
          <div>
            <Button variant="invert-outline" size="tiny" onClick={onReverseSentiment}>
              {sentiment === sentimentsOptions[0].value
                ? i18n.t('mcda.layer_editor.reverse_to_good_bad')
                : i18n.t('mcda.layer_editor.reverse_to_bad_good')}
            </Button>
          </div>
        </div>
        {!editMode ? (
          // Static mode
          <div className={s.nonDefaultValues}>
            {nonDefaultValues.map((v, index) => (
              <div key={`nonDefault${index}`}>{`${v.paramName}: ${v.value}`}</div>
            ))}
          </div>
        ) : (
          // Edit mode
          <div className={s.layerEditContainer}>
            {/* RANGE */}
            <MCDALayerParameterRow
              name={i18n.t('mcda.layer_editor.range')}
              infoText={i18n.t('mcda.layer_editor.tips.range')}
            >
              <MCDARangeControls
                rangeFrom={rangeFrom}
                rangeTo={rangeTo}
                setRangeFrom={setRangeFrom}
                setRangeTo={setRangeTo}
                rangeFromError={rangeFromError}
                rangeToError={rangeToError}
                setRangeFromError={setRangeFromError}
                setRangeToError={setRangeToError}
                axisDatasetRange={axisDatasetRange}
                layer={layer}
              />
            </MCDALayerParameterRow>
            {/* OUTLIERS */}
            <MCDALayerParameterRow
              name={i18n.t('mcda.layer_editor.outliers')}
              infoText={i18n.t('mcda.layer_editor.tips.outliers')}
            >
              <Select
                className={s.selectInput}
                classes={{
                  menu: s.selectInputBox,
                }}
                value={outliers}
                onChange={(e) => {
                  setOutliers(e.selectedItem?.value as OutliersPolicy);
                }}
                items={outliersOptions}
              />
            </MCDALayerParameterRow>
            {/* WEIGHT */}
            <MCDALayerParameterRow
              name={i18n.t('mcda.layer_editor.weight')}
              infoText={i18n.t('mcda.layer_editor.tips.weight')}
            >
              <Input
                classes={{
                  inputBox: s.textInputBox,
                  error: s.hiddenError,
                }}
                type="text"
                value={coefficient}
                onChange={(event) => {
                  const value = event.target.value.replace(POSITIVE_NUMBER_FILTER, '');
                  setCoefficient(value);
                }}
                error={coefficientError}
              />
              <Text
                type="short-m"
                className={clsx(s.error, !coefficientError && s.invisible)}
              >
                {coefficientError}
              </Text>
            </MCDALayerParameterRow>
            {/* TRANSFORM */}
            <MCDALayerParameterRow
              name={i18n.t('mcda.layer_editor.transform')}
              infoText={i18n.t('mcda.layer_editor.tips.transform')}
              onTitleDoubleClicked={() => setShowDebugInfo((prevValue) => !prevValue)}
            >
              <div className={s.transformSelectionRow}>
                <Select
                  className={s.selectInput}
                  disabled={!transformationsStatistics}
                  classes={{
                    menu: s.selectInputBox,
                  }}
                  value={transformationFunction}
                  onChange={(e) => {
                    setTransformationFunction(
                      e.selectedItem?.value as TransformationFunction,
                    );
                  }}
                  items={transformOptions}
                />
                {isLoading && <KonturSpinner size={30} />}
              </div>
            </MCDALayerParameterRow>
            {/* NORMALIZE */}
            <MCDALayerParameterRow
              name={i18n.t('mcda.layer_editor.normalize')}
              infoText={i18n.t('mcda.layer_editor.tips.normalize')}
            >
              <Select
                className={s.selectInput}
                classes={{
                  menu: s.selectInputBox,
                }}
                value={normalization}
                onChange={(e) => {
                  setNormalization(e.selectedItem?.value as Normalization);
                }}
                items={normalizationOptions}
              />
            </MCDALayerParameterRow>
            {showDebugInfo ? (
              <MCDATransformationDebugInfo
                transformationsStatistics={transformationsStatistics}
                selectedTransformationFunction={transformationFunction}
              />
            ) : (
              <></>
            )}
            <div className={s.editorButtonsContainer}>
              <Button
                size="small"
                className={s.saveButton}
                onClick={onSaveLayer}
                disabled={!!rangeFromError || !!rangeToError || !!coefficientError}
              >
                <Text type="short-m">{i18n.t('mcda.layer_editor.save_changes')}</Text>
              </Button>
              <Button size="small" variant="invert-outline" onClick={onCancel}>
                <Text type="short-m">{i18n.t('cancel')}</Text>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
