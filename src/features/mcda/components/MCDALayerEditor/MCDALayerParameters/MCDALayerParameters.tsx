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
import { Sentiments } from '../Sentiments';
import { MCDALayerParameterRow } from './MCDALayerParameterRow/MCDALayerParameterRow';
import s from './MCDALayerParameters.module.css';
import {
  MCDA_LAYER_DEFAULTS as DEFAULTS,
  NUMBER_FILTER,
  POSITIVE_NUMBER_FILTER,
  SENTIMENT_VALUES,
  normalizationOptions,
  outliersOptions,
  sentimentColors,
  sentimentsOptions,
  transformOptions,
} from './constants';
import type {
  MCDALayer,
  OutliersPolicy,
  TransformationFunction,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { Normalization } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { AxisTransformation, AxisTransformationWithPoints } from '~utils/bivariate';

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
  const [transform, setTransform] = useState<TransformationFunction>(
    DEFAULTS.transform as TransformationFunction,
  );
  const [normalization, setNormalization] = useState<Normalization>(
    DEFAULTS.normalization as Normalization,
  );
  const [transformationsStatistics, setTransformationsStatistics] = useState<Map<
    TransformationFunction,
    AxisTransformationWithPoints
  > | null>(null);

  const [rangeFromError, setRangeFromError] = useState('');
  const [rangeToError, setRangeToError] = useState('');

  useEffect(() => {
    setRangeFrom(layer.range?.at(0)?.toString() ?? '');
    setRangeTo(layer.range?.at(1)?.toString() ?? '');
    setSentiment(layer.sentiment.at(0) === 'good' ? 'good-bad' : 'bad-good');
    setCoefficient(layer.coefficient.toString());
    setTransform(layer.transformationFunction);
    setNormalization(layer.normalization);
    setOutliers(layer.outliers ?? DEFAULTS.outliers);
  }, [layer]);

  const [axes] = useAtom((ctx) => ctx.spy(availableBivariateAxesAtom));

  const { axisDatasetRange, defaultTransformation } = useMemo(() => {
    let axisDatasetRange: string[] | null = null;
    let defaultTransformation: AxisTransformation | undefined;
    if (!axes.loading) {
      const relatedAxis = axes?.data?.find((axis) => axis.id === layer.id);
      const steps = relatedAxis?.steps;
      const min = steps?.at(0)?.value;
      const max = steps?.at(-1)?.value;
      axisDatasetRange =
        isNumber(min) && isNumber(max) ? [min.toString(), max.toString()] : null;
      defaultTransformation = relatedAxis?.transformation;
    }
    return { axisDatasetRange, defaultTransformation };
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

  useEffect(() => {
    const rangeFromNum = Number(rangeFrom);
    const rangeToNum = Number(rangeTo);
    let errorFrom = '';
    let errorTo = '';
    if (!isNumber(rangeFromNum)) {
      errorFrom = i18n.t('mcda.layer_editor.errors.range_must_be_a_number');
    }
    if (!isNumber(rangeToNum)) {
      errorTo = i18n.t('mcda.layer_editor.errors.range_must_be_a_number');
    }
    if (Number(rangeFrom) > Number(rangeTo)) {
      errorFrom = i18n.t('mcda.layer_editor.errors.range_from_cannot_be_bigger');
    }
    if (!rangeTo) {
      errorTo = i18n.t('mcda.layer_editor.errors.range_cannot_be_empty');
    }
    if (!rangeFrom) {
      errorFrom = i18n.t('mcda.layer_editor.errors.range_cannot_be_empty');
    }
    setRangeFromError(errorFrom);
    setRangeToError(errorTo);
  }, [rangeFrom, rangeTo]);

  /** CALLBACKS */
  const onSaveLayer = useCallback(() => {
    const rangeNum = [Number(rangeFrom), Number(rangeTo)];
    const coefficientNum = Number(coefficient);
    const updatedLayer: MCDALayer = {
      id: layer.id,
      name: layer.name,
      axis: layer.axis,
      indicators: layer.indicators,
      unit: layer.unit,
      range: [
        isNumber(rangeNum[0]) ? rangeNum[0] : 0,
        isNumber(rangeNum[1]) ? rangeNum[1] : 1000,
      ],
      sentiment: SENTIMENT_VALUES[sentiment],
      outliers,
      coefficient: isNumber(coefficientNum) ? coefficientNum : 1,
      transformationFunction: transform,
      normalization,
      datasetRange: layer.datasetRange,
    };
    setEditMode(false);
    onLayerEdited(updatedLayer);
  }, [
    coefficient,
    layer.axis,
    layer.datasetRange,
    layer.id,
    layer.indicators,
    layer.name,
    layer.unit,
    normalization,
    onLayerEdited,
    outliers,
    rangeFrom,
    rangeTo,
    sentiment,
    transform,
  ]);

  const onCancel = useCallback(() => {
    setEditMode(false);
  }, []);

  const setToFullDatasetRange = useCallback(() => {
    if (!axes.loading) {
      if (axisDatasetRange) {
        setRangeFrom(axisDatasetRange[0]);
        setRangeTo(axisDatasetRange[1]);
      } else {
        console.error(
          `Couldn\'nt find default range for ${layer.id}. Using app defaults instead`,
        );
        setRangeFrom(DEFAULTS.range[0]);
        setRangeTo(DEFAULTS.range[1]);
      }
    }
  }, [axes.loading, axisDatasetRange, layer]);

  const setToSigmaRange = useCallback(
    (numberOfSigmas: number) => {
      // TODO: BE should be returning non-transformed values!
      const reverseTransformations = {
        no: (x) => x,
        cube_root: (x) => x * x * x,
        square_root: (x) => Math.sign(x) * Math.abs(x * x),
        log: (x) => Math.pow(10, x) - 1 + parseFloat(axisDatasetRange?.[0] ?? '0'),
        log_epsilon: (x) =>
          Math.pow(10, x) - Number.EPSILON + parseFloat(axisDatasetRange?.[0] ?? '0'),
      };
      const selectedTransformationStatistics = transformationsStatistics?.get(transform);
      if (!axes.loading) {
        if (selectedTransformationStatistics) {
          // console.log({ layer, selectedTransformationStatistics });
          if (numberOfSigmas === 3) {
            setRangeFrom(
              reverseTransformations[selectedTransformationStatistics.transformation](
                selectedTransformationStatistics.lowerBound,
              ).toFixed(5),
            );
            setRangeTo(
              reverseTransformations[selectedTransformationStatistics.transformation](
                selectedTransformationStatistics.upperBound,
              ).toFixed(5),
            );
          } else {
            const mean = reverseTransformations[
              selectedTransformationStatistics.transformation
            ](selectedTransformationStatistics.mean);
            const stddev = reverseTransformations[
              selectedTransformationStatistics.transformation
            ](selectedTransformationStatistics.stddev);
            // TODO: the resulting mean and stddev don't look correct. Sometimes mean + 3*stddev is > than dataset range!
            // console.log({ defT: defaultTransformation.transformation, mean, stddev });
            setRangeFrom((mean - numberOfSigmas * stddev).toFixed(5));
            setRangeTo((mean + numberOfSigmas * stddev).toFixed(5));
          }
        } else {
          console.error(
            `Couldn\'nt find defaultTransformation to set sigma range for ${layer.id}.`,
          );
        }
      }
    },
    [axes.loading, axisDatasetRange, layer, transform, transformationsStatistics],
  );

  const editLayer = useCallback(async () => {
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
      setEditMode(true);
    }
  }, [layer.indicators]);

  return (
    <div className={s.editor}>
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
        {!editMode ? (
          // Static mode
          <div>
            <Sentiments
              left={sentiments.left}
              right={sentiments.right}
              units={layer.unit}
            />
            <div className={s.nonDefaultValues}>
              {nonDefaultValues.map((v, index) => (
                <div key={`nonDefault${index}`}>{`${v.paramName}: ${v.value}`}</div>
              ))}
            </div>
          </div>
        ) : (
          // Edit mode
          <div className={s.layerEditContainer}>
            {/* RANGE */}
            <MCDALayerParameterRow
              name={i18n.t('mcda.layer_editor.range')}
              infoText={i18n.t('mcda.layer_editor.tips.range')}
            >
              <div className={s.rangeInputContainer}>
                <Input
                  className={s.rangeInputRoot}
                  classes={{
                    inputBox: s.rangeInputBox,
                    error: s.hiddenError,
                  }}
                  type="text"
                  value={rangeFrom}
                  onChange={(event) => {
                    const value = event.target.value.replace(NUMBER_FILTER, '');
                    setRangeFrom(value);
                  }}
                  error={rangeFromError}
                />
                <span className={s.inputRangeDivider}>{'-'}</span>
                <Input
                  className={s.rangeInputRoot}
                  classes={{
                    inputBox: s.rangeInputBox,
                    error: s.hiddenError,
                  }}
                  type="text"
                  value={rangeTo}
                  onChange={(event) => {
                    const value = event.target.value.replace(NUMBER_FILTER, '');
                    setRangeTo(value);
                  }}
                  error={rangeToError}
                />
              </div>
              <Text type="short-m" className={s.error}>
                {rangeFromError ? rangeFromError : rangeToError}
              </Text>
              <div className={s.rangeTextButtonsContainer}>
                <span
                  className={clsx(s.rangeTextButtons, {
                    [s.textButtonDisabled]: axes.loading,
                  })}
                  onClick={setToFullDatasetRange}
                >
                  {i18n.t('mcda.layer_editor.range_buttons.full_range')}
                </span>
                <span
                  className={clsx(s.rangeTextButtons, {
                    [s.textButtonDisabled]: axes.loading,
                  })}
                  onClick={() => setToSigmaRange(3)}
                >
                  {i18n.t('mcda.layer_editor.range_buttons.3_sigma')}
                </span>
                <span
                  className={clsx(s.rangeTextButtons, s.error, {
                    [s.textButtonDisabled]: axes.loading,
                  })}
                  onClick={() => setToSigmaRange(2)}
                >
                  {i18n.t('mcda.layer_editor.range_buttons.2_sigma')}
                </span>
                <span
                  className={clsx(s.rangeTextButtons, s.error, {
                    [s.textButtonDisabled]: axes.loading,
                  })}
                  onClick={() => setToSigmaRange(1)}
                >
                  {i18n.t('mcda.layer_editor.range_buttons.1_sigma')}
                </span>
              </div>
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
            {/* SENTIMENT */}
            <MCDALayerParameterRow
              name={i18n.t('mcda.layer_editor.sentiment')}
              infoText={i18n.t('mcda.layer_editor.tips.sentiment')}
            >
              <Select
                className={s.selectInput}
                classes={{
                  menu: s.selectInputBox,
                }}
                value={sentiment}
                onChange={(e) => {
                  setSentiment(e.selectedItem?.value as string);
                }}
                items={sentimentsOptions}
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
            >
              <Select
                className={s.selectInput}
                classes={{
                  menu: s.selectInputBox,
                }}
                value={transform}
                onChange={(e) => {
                  setTransform(e.selectedItem?.value as TransformationFunction);
                }}
                items={transformOptions}
              />
              <div className={s.debugInfoContainer}>
                <div className={s.debugText}>
                  skew: {transformationsStatistics?.get(transform)?.skew}
                </div>
                <div className={s.debugText}>
                  mean: {transformationsStatistics?.get(transform)?.mean}
                </div>
                <div className={s.debugText}>
                  sdev: {transformationsStatistics?.get(transform)?.stddev}
                </div>
                <div className={s.debugText}>
                  lbnd: {transformationsStatistics?.get(transform)?.lowerBound}
                </div>
                <div className={s.debugText}>
                  ubnd: {transformationsStatistics?.get(transform)?.upperBound}
                </div>
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
