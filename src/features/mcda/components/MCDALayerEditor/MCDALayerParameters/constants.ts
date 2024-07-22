import { i18n } from '~core/localization';
import {
  sentimentDefault,
  sentimentReversed,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations/constants';
import type { SelectableItem } from '@konturio/ui-kit';

export const SENTIMENT_VALUES = {
  'bad-good': sentimentDefault,
  'good-bad': sentimentReversed,
};
export const NUMBER_FILTER = /[^.\-\d]/;
export const POSITIVE_NUMBER_FILTER = /[^.\d]/;
export const sentimentColors = { bad: '#D93A3A', good: '#29A301' };

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
  {
    title: `${i18n.t('mcda.layer_editor.outliers_options.clamp')}`,
    value: 'clamp',
  },
  { title: `${i18n.t('mcda.layer_editor.outliers_options.hide')}`, value: 'hide' },
  {
    title: `${i18n.t('mcda.layer_editor.outliers_options.dont_modify')}`,
    value: 'unmodified',
  },
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
  { title: `${i18n.t('mcda.layer_editor.max_min')}`, value: 'max-min' },
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
