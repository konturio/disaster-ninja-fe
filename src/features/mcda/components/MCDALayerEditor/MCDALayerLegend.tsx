import { Edit16 } from '@konturio/default-icons';
import { useCallback, useEffect, useState } from 'react';
import { Button, Input, Select, Text } from '@konturio/ui-kit';
import clsx from 'clsx';
import { i18n } from '~core/localization';
import { TooltipTrigger } from '~components/TooltipTrigger';
import { LAYERS_PANEL_FEATURE_ID } from '~features/layers_panel/constants';
import s from './style.module.css';
import { Sentiments } from './Sentiments';
import { MCDAParameter } from './MCDAParameter/MCDAParameter';
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
const sentiments: SelectableItem[] = [
  { title: `${i18n.t('mcda.bad')} \u2192 ${i18n.t('mcda.good')}`, value: 1 },
  { title: `${i18n.t('mcda.good')} \u2192 ${i18n.t('mcda.bad')}`, value: 2 },
];
const outliersOptions: SelectableItem[] = [
  { title: `${i18n.t('mcda.layer_editor.as_values_on_limits')}`, value: 1 },
  { title: `${i18n.t('mcda.layer_editor.exclude')}`, value: 2 },
];
const transformOptions: SelectableItem[] = [
  { title: `${i18n.t('mcda.layer_editor.no')}`, value: 1 },
  { title: `${i18n.t('mcda.layer_editor.natural_logarithm')}`, value: 2 },
  { title: `${i18n.t('mcda.layer_editor.square_root')}`, value: 3 },
];
const normalizationOptions: SelectableItem[] = [
  { title: `${i18n.t('mcda.layer_editor.no')}`, value: 1 },
  { title: `${i18n.t('mcda.layer_editor.min-max')}`, value: 2 },
];

const NUMBER_FILTER = /[^.\-\d]/;
const POSITIVE_NUMBER_FILTER = /[^.\d]/;

export function MCDALayerLegend({
  layer,
  mcdaConfig,
  onLayerEdited,
}: MCDALayerLegendProps) {
  const [editMode, setEditMode] = useState(false);

  const [sentiment, setSentiment] = useState(sentiments[0]);
  const [range, setRange] = useState(rangeDefault);
  const [outliers, setOutliers] = useState(outliersOptions[0]);
  const [weight, setWeight] = useState('1.0');
  const [transform, setTransform] = useState(transformOptions[0]);
  const [normalization, setNormalization] = useState(normalizationOptions[0]);

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
              tipText={'A'}
              tooltipId={LAYERS_PANEL_FEATURE_ID}
            />
            {/* <div className={s.infoButton} onClick={() => {}}>
              <InfoOutline16 />
            </div> */}
          </div>
        </div>
        {!editMode ? (
          // Static mode
          <Sentiments
            right={{
              label: layer.sentiment.at(0)!, // Sentiments name needed instead of id
              color: 'red',
              value: String(layer.range.at(0)),
            }}
            left={{
              label: layer.sentiment.at(1)!,
              color: 'green',
              value: String(layer.range.at(1)),
            }}
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
                value={outliers.value}
                onChange={(e) => {
                  setSentiment(e.selectedItem ?? outliers[0]);
                }}
                items={outliersOptions}
                disabled={true}
              />
            </MCDAParameter>
            {/* SENTIMENT */}
            <MCDAParameter name={i18n.t('mcda.layer_editor.sentiment')} tipText="TBD">
              <Select
                className={s.inputSelect}
                value={sentiment.value}
                onChange={(e) => {
                  setSentiment(e.selectedItem ?? sentiments[0]);
                }}
                items={sentiments}
              />
            </MCDAParameter>
            {/* WEIGHT */}
            <MCDAParameter name={i18n.t('mcda.layer_editor.weight')} tipText="TBD">
              <Input
                className={clsx(s.input, s.textInput)}
                type="text"
                value={weight}
                onChange={(event) => {
                  const value = event.target.value.replace(POSITIVE_NUMBER_FILTER, '');
                  setWeight(value);
                }}
              />
            </MCDAParameter>
            {/* TRANSFORM */}
            <MCDAParameter name={i18n.t('mcda.layer_editor.transform')} tipText="TBD">
              <Select
                className={s.inputSelect}
                value={transform.value}
                onChange={(e) => {
                  setSentiment(e.selectedItem ?? transform[0]);
                }}
                items={transformOptions}
              />
            </MCDAParameter>
            {/* NORMALIZE */}
            <MCDAParameter name={i18n.t('mcda.layer_editor.normalize')} tipText="TBD">
              <Select
                className={s.inputSelect}
                value={normalization.value}
                onChange={(e) => {
                  setSentiment(e.selectedItem ?? normalization[0]);
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
