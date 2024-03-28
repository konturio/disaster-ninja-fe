import { Edit16 } from '@konturio/default-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Select, Text } from '@konturio/ui-kit';
import { useAtom } from '@reatom/npm-react';
import clsx from 'clsx';
import { i18n } from '~core/localization';
import { TooltipTrigger } from '~components/TooltipTrigger';
import { LAYERS_PANEL_FEATURE_ID } from '~features/layers_panel/constants';
import { isNumber } from '~utils/common';
import { bivariateStatisticsResourceAtom } from '~core/resources/bivariateStatisticsResource';
import { Sentiments } from '../Sentiments';
import { MCDAParameter } from '../MCDAParameter/MCDAParameter';
import s from './style.module.css';
import type {
  MCDAConfig,
  MCDALayer,
  TransformationFunction,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { Normalization } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { SelectableItem } from '@konturio/ui-kit';

export type MCDALayerLegendProps = {
  layer: MCDALayer;
  onLayerEdited: (editedMCDALayer: MCDALayer) => void;
};

const RANGE_DEFAULT = ['0', '1'];
const SENTIMENT_VALUES = {
  'bad-good': ['bad', 'good'],
  'good-bad': ['good', 'bad'],
};

const sentimentsOptions: SelectableItem[] = [
  {
    title: `${i18n.t('mcda.bad')} \u2192 ${i18n.t('mcda.good')}`,
    value: 'bad-good',
  },
  {
    title: `${i18n.t('mcda.good')} \u2192 ${i18n.t('mcda.bad')}`,
    value: 'good-bad',
  },
];
const outliersOptions: SelectableItem[] = [
  { title: `${i18n.t('mcda.layer_editor.as_values_on_limits')}`, value: '1' },
  { title: `${i18n.t('mcda.layer_editor.exclude')}`, value: '2' },
];
const transformOptions: SelectableItem[] = [
  { title: `${i18n.t('mcda.layer_editor.no')}`, value: 'no' },
  {
    title: `${i18n.t('mcda.layer_editor.natural_logarithm')}`,
    value: 'natural_logarithm',
  },
  { title: `${i18n.t('mcda.layer_editor.square_root')}`, value: 'square_root' },
];
const normalizationOptions: SelectableItem[] = [
  { title: `${i18n.t('mcda.layer_editor.no')}`, value: 'no' },
  { title: `${i18n.t('mcda.layer_editor.max-min')}`, value: 'max-min' },
];

const NUMBER_FILTER = /[^.\-\d]/;
const POSITIVE_NUMBER_FILTER = /[^.\d]/;
const sentimentColors = { bad: 'red', good: 'green' };

export function MCDALayerDetails({ layer, onLayerEdited }: MCDALayerLegendProps) {
  const [editMode, setEditMode] = useState(false);

  const [axes] = useAtom((ctx) => ctx.spy(bivariateStatisticsResourceAtom.v3atom));

  const axisDefaultRange = useMemo(() => {
    if (!axes.loading) {
      const relatedAxis = axes?.data?.axis.find((axis) => axis.id === layer.id);
      const steps = relatedAxis?.steps;
      const min = steps?.at(0)?.value;
      const max = steps?.at(-1)?.value;
      if (isNumber(min) && isNumber(max)) {
        return [min.toString(), max.toString()];
      }
    }
    return null;
  }, [axes?.data?.axis, axes?.loading, layer.id]);

  const [sentiment, setSentiment] = useState(sentimentsOptions[0].value as string);
  const [range, setRange] = useState(RANGE_DEFAULT);
  const [outliers, setOutliers] = useState(outliersOptions[0].value as string);
  const [coefficient, setCoefficient] = useState('');
  const [transform, setTransform] = useState<TransformationFunction>(
    transformOptions[0].value as TransformationFunction,
  );
  const [normalization, setNormalization] = useState<Normalization>(
    normalizationOptions[0].value as Normalization,
  );

  useEffect(() => {
    setRange(layer.range.map((v) => v.toString()) ?? RANGE_DEFAULT);
    setSentiment(layer.sentiment.at(0) === 'good' ? 'good-bad' : 'bad-good');
    setCoefficient(layer.coefficient.toString() ?? '1.0');
    setTransform(layer.transformationFunction);
    setNormalization(layer.normalization);
  }, [axisDefaultRange, layer]);

  const onSaveLayer = useCallback(() => {
    const rangeNum = [parseFloat(range[0]), parseFloat(range[1])];
    const coefficientNum = parseFloat(coefficient);
    const updatedLayer: MCDALayer = {
      id: layer.id,
      name: layer.name,
      axis: layer.axis,
      unit: layer.unit,
      range: [
        isNumber(rangeNum[0]) ? rangeNum[0] : 0,
        isNumber(rangeNum[1]) ? rangeNum[1] : 1000,
      ],
      sentiment: SENTIMENT_VALUES[sentiment],
      coefficient: isNumber(coefficientNum) ? coefficientNum : 1,
      transformationFunction: transform,
      normalization,
    };
    setEditMode(false);
    onLayerEdited(updatedLayer);
  }, [coefficient, layer, normalization, onLayerEdited, range, sentiment, transform]);

  const onCancel = useCallback(() => {
    setEditMode(false);
  }, []);

  const onResetLimits = useCallback(() => {
    if (!axes.loading) {
      if (axisDefaultRange) {
        setRange(axisDefaultRange);
      } else {
        console.error(
          `Couldn\'nt find default range for ${layer.id}. Using app defaults instead`,
        );
        setRange(RANGE_DEFAULT);
      }
    }
  }, [axes.loading, axisDefaultRange, layer]);

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

  return (
    <div className={s.editor}>
      <div key={layer.id} className={s.layer}>
        <div className={s.layerHeader}>
          <div>{layer.name}</div>
          <div className={s.layerButtons}>
            {!editMode && (
              <div
                className={s.editButton}
                onClick={() => {
                  setEditMode(true);
                }}
              >
                <Edit16 />
              </div>
            )}
            <TooltipTrigger
              className={s.infoButton}
              tipText={''}
              tooltipId={LAYERS_PANEL_FEATURE_ID}
            />
          </div>
        </div>
        {!editMode ? (
          // Static mode
          <Sentiments
            left={sentiments.left}
            right={sentiments.right}
            units={layer.unit}
          />
        ) : (
          // Edit mode
          <div className={s.layerEditContainer}>
            {/* RANGE */}
            <MCDAParameter name={i18n.t('mcda.layer_editor.range')} tipText="">
              <Input
                classes={{
                  inputBox: s.textInputBox,
                }}
                type="text"
                value={range[0]}
                onChange={(event) => {
                  const value = event.target.value.replace(NUMBER_FILTER, '');
                  setRange((oldValue) => [value, oldValue[1]]);
                }}
              />
              <span className={s.inputRangeDivider}>{'-'}</span>
              <Input
                classes={{
                  inputBox: s.textInputBox,
                }}
                type="text"
                value={range[1]}
                onChange={(event) => {
                  const value = event.target.value.replace(NUMBER_FILTER, '');
                  setRange((oldValue) => [oldValue[0], value]);
                }}
              />
            </MCDAParameter>
            <div
              className={clsx(s.resetLimits, { [s.textButtonDisabled]: axes.loading })}
              onClick={onResetLimits}
            >
              {i18n.t('mcda.layer_editor.reset_limits_to_default')}
            </div>
            {/* OUTLIERS */}
            <MCDAParameter name={i18n.t('mcda.layer_editor.outliers')} tipText="">
              <Select
                className={s.selectInput}
                classes={{
                  menu: s.selectInputBox,
                }}
                value={outliers}
                onChange={(e) => {
                  setOutliers(e.selectedItem?.value as string);
                }}
                items={outliersOptions}
                disabled={true}
              />
            </MCDAParameter>
            {/* SENTIMENT */}
            <MCDAParameter name={i18n.t('mcda.layer_editor.sentiment')} tipText="">
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
            </MCDAParameter>
            {/* WEIGHT */}
            <MCDAParameter name={i18n.t('mcda.layer_editor.weight')} tipText="">
              <Input
                classes={{
                  inputBox: s.textInputBox,
                }}
                type="text"
                value={coefficient}
                onChange={(event) => {
                  const value = event.target.value.replace(POSITIVE_NUMBER_FILTER, '');
                  setCoefficient(value);
                }}
              />
            </MCDAParameter>
            {/* TRANSFORM */}
            <MCDAParameter name={i18n.t('mcda.layer_editor.transform')} tipText="">
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
            </MCDAParameter>
            {/* NORMALIZE */}
            <MCDAParameter name={i18n.t('mcda.layer_editor.normalize')} tipText="">
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
            </MCDAParameter>
            <div className={s.editorButtonsContainer}>
              <Button size="small" className={s.saveButton} onClick={onSaveLayer}>
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
