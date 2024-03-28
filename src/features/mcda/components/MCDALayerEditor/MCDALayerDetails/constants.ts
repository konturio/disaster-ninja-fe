import { i18n } from '~core/localization';
import type { SelectableItem } from '@konturio/ui-kit';

export const SENTIMENT_VALUES = {
  'bad-good': ['bad', 'good'],
  'good-bad': ['good', 'bad'],
};
export const NUMBER_FILTER = /[^.\-\d]/;
export const POSITIVE_NUMBER_FILTER = /[^.\d]/;
export const sentimentColors = { bad: 'red', good: 'green' };

export const sentimentsOptions: SelectableItem[] = [
  {
    title: `${i18n.t('mcda.bad')} \u2192 ${i18n.t('mcda.good')}`,
    value: 'bad-good',
  },
  {
    title: `${i18n.t('mcda.good')} \u2192 ${i18n.t('mcda.bad')}`,
    value: 'good-bad',
  },
];

export const outliersOptions: SelectableItem[] = [
  { title: `${i18n.t('mcda.layer_editor.as_values_on_limits')}`, value: '1' },
  { title: `${i18n.t('mcda.layer_editor.exclude')}`, value: '2' },
];

export const transformOptions: SelectableItem[] = [
  { title: `${i18n.t('mcda.layer_editor.no')}`, value: 'no' },
  {
    title: `${i18n.t('mcda.layer_editor.natural_logarithm')}`,
    value: 'natural_logarithm',
  },
  { title: `${i18n.t('mcda.layer_editor.square_root')}`, value: 'square_root' },
];

export const normalizationOptions: SelectableItem[] = [
  { title: `${i18n.t('mcda.layer_editor.max-min')}`, value: 'max-min' },
  { title: `${i18n.t('mcda.layer_editor.no')}`, value: 'no' },
];

export const MCDA_LAYER_DEFAULTS = {
  range: ['0', '1'],
  sentiment: sentimentsOptions[0].value,
  outliers: outliersOptions[0].value,
  coefficient: 1,
  transform: transformOptions[0].value,
  normalization: normalizationOptions[0].value,
};
