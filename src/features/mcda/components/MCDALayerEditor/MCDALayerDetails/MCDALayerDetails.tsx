import { Edit16 } from '@konturio/default-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Select, Text } from '@konturio/ui-kit';
import clsx from 'clsx';
import { i18n } from '~core/localization';
import { TooltipTrigger } from '~components/TooltipTrigger';
import { LAYERS_PANEL_FEATURE_ID } from '~features/layers_panel/constants';
import { Sentiments } from '../Sentiments';
import { MCDAParameter } from '../MCDAParameter/MCDAParameter';
import s from './style.module.css';
import type { SelectableItem } from '@konturio/ui-kit';
import type {
  MCDAConfig,
  MCDALayer,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export type MCDALayerLegendProps = {
  layer: MCDALayer;
  mcdaConfig: MCDAConfig;
  onLayerEdited: (editedMCDALayer: MCDALayer) => void;
};

const rangeDefault = ['0', '1000'];
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

export function MCDALayerDetails({
  layer,
  mcdaConfig,
  onLayerEdited,
}: MCDALayerLegendProps) {
  const [editMode, setEditMode] = useState(false);

  const [sentiment, setSentiment] = useState(sentimentsOptions[0].value as string);
  const [range, setRange] = useState(rangeDefault);
  const [outliers, setOutliers] = useState(outliersOptions[0].value as string);
  const [coefficient, setCoefficient] = useState('');
  const [transform, setTransform] = useState<string>(transformOptions[0].value as string);
  const [normalization, setNormalization] = useState(
    normalizationOptions[0].value as string,
  );

  useEffect(() => {
    setRange(layer.range.map((v) => v.toString()) ?? rangeDefault);
    setSentiment(layer.sentiment.at(0) === 'good' ? 'good-bad' : 'bad-good');
    setCoefficient(layer.coefficient.toString() ?? '1.0');
    setTransform(layer.transformationFunction);
    setNormalization(layer.normalization);
  }, [layer]);

  const onSaveLayer = useCallback(() => {
    const newLayer: MCDALayer = {
      id: 'population|area_km2',
      name: 'Population (ppl/km²)',
      axis: ['population', 'area_km2'],
      unit: 'ppl/km²',
      range: [0, 1000],
      sentiment: ['bad', 'good'],
      coefficient: 1,
      transformationFunction: 'no',
      normalization: 'max-min',
    };
    onLayerEdited(newLayer);
    setEditMode(false);
  }, [onLayerEdited]);

  const onCancel = useCallback(() => {
    setEditMode(false);
  }, []);

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
            <MCDAParameter name={i18n.t('mcda.layer_editor.range')} tipText="TBD">
              <Input
                className={clsx(s.input, s.textInput)}
                type="text"
                value={range[0]}
                onChange={(event) => {
                  const value = event.target.value.replace(NUMBER_FILTER, '');
                  setRange((oldValue) => [value, oldValue[1]]);
                }}
              />
              <span className={s.inputRangeDivider}>{'-'}</span>
              <Input
                className={clsx(s.input, s.textInput)}
                type="text"
                value={range[1]}
                onChange={(event) => {
                  const value = event.target.value.replace(NUMBER_FILTER, '');
                  setRange((oldValue) => [oldValue[0], value]);
                }}
              />
            </MCDAParameter>
            <div
              className={s.resetLimits}
              onClick={() => {
                setRange(rangeDefault);
              }}
            >
              {i18n.t('mcda.layer_editor.reset_limits_to_default')}
            </div>
            {/* OUTLIERS */}
            <MCDAParameter name={i18n.t('mcda.layer_editor.outliers')} tipText="TBD">
              <Select
                className={s.inputSelect}
                value={outliers}
                onChange={(e) => {
                  setOutliers(e.selectedItem?.value as string);
                }}
                items={outliersOptions}
                disabled={true}
              />
            </MCDAParameter>
            {/* SENTIMENT */}
            <MCDAParameter name={i18n.t('mcda.layer_editor.sentiment')} tipText="TBD">
              <Select
                className={s.inputSelect}
                value={sentiment}
                onChange={(e) => {
                  setSentiment(e.selectedItem?.value as string);
                }}
                items={sentimentsOptions}
              />
            </MCDAParameter>
            {/* WEIGHT */}
            <MCDAParameter name={i18n.t('mcda.layer_editor.weight')} tipText="TBD">
              <Input
                className={clsx(s.input, s.textInput)}
                type="text"
                value={coefficient}
                onChange={(event) => {
                  const value = event.target.value.replace(POSITIVE_NUMBER_FILTER, '');
                  setCoefficient(value);
                }}
              />
            </MCDAParameter>
            {/* TRANSFORM */}
            <MCDAParameter name={i18n.t('mcda.layer_editor.transform')} tipText="TBD">
              <Select
                className={s.inputSelect}
                value={transform}
                onChange={(e) => {
                  setTransform(e.selectedItem?.value as string);
                }}
                items={transformOptions}
              />
            </MCDAParameter>
            {/* NORMALIZE */}
            <MCDAParameter name={i18n.t('mcda.layer_editor.normalize')} tipText="TBD">
              <Select
                className={s.inputSelect}
                value={normalization}
                onChange={(e) => {
                  setNormalization(e.selectedItem?.value as string);
                }}
                items={normalizationOptions}
              />
            </MCDAParameter>
            <span>
              <Button size="tiny" className={s.saveButton} onClick={onSaveLayer}>
                <Text type="short-m">{i18n.t('mcda.layer_editor.save_changes')}</Text>
              </Button>
              <Button size="tiny" variant="invert-outline" onClick={onCancel}>
                <Text type="short-m">{i18n.t('cancel')}</Text>
              </Button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
