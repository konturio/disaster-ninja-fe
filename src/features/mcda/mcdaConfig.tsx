import { nanoid } from 'nanoid';
import { showModal } from '~core/modal';
import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { i18n } from '~core/localization';
import { formatBivariateAxisUnit, type Axis } from '~utils/bivariate';
import {
  DEFAULT_GREEN,
  DEFAULT_RED,
  DEFAULT_YELLOW,
  sentimentDefault,
  sentimentReversed,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations/constants';
import { MCDAForm } from './components/MCDAForm';
import { generateMCDAId } from './utils/generateMCDAId';
import { DEFAULT_MCDA_NAME } from './constants';
import type {
  MCDAConfig,
  MCDALayer,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export async function editMCDAConfig(oldConfig: MCDAConfig): Promise<MCDAConfig | null> {
  const name = oldConfig.name;
  const oldLayers = oldConfig.layers ?? [];
  const axises = oldLayers.map((layer) => ({
    id: layer.id,
    label: layer.name,
  }));
  const input = await showModal(MCDAForm, {
    initialState: {
      name,
      axises,
    },
  });
  if (input === null) return null;

  const newLayers = createMCDALayersFromBivariateAxises(input.axises);
  const resultLayers = newLayers.reduce<MCDALayer[]>((acc, layer) => {
    // if there already was a layer with this id, reuse it
    const oldLayer = oldLayers.find((old) => old.id === layer.id);
    acc.push(oldLayer ?? layer);
    return acc;
  }, []);

  return {
    ...oldConfig,
    layers: resultLayers,
    name: input.name,
    id: generateMCDAId(input.name),
  };
}

export async function createMCDAConfig() {
  const input = await showModal(MCDAForm, {
    initialState: {
      name: '',
      axises: [],
    },
  });

  if (input === null) return null;

  const config = createDefaultMCDAConfig({
    name: input.name,
    layers: createMCDALayersFromBivariateAxises(input.axises),
  });
  return config;
}

function createDefaultMCDAConfig(overrides?: Partial<MCDAConfig>): MCDAConfig {
  const name = overrides?.name ?? DEFAULT_MCDA_NAME;

  return {
    version: 4,
    id: generateMCDAId(name),
    name,
    layers: overrides?.layers ?? [],
    colors: {
      type: 'sentiments',
      parameters: {
        bad: DEFAULT_RED,
        good: DEFAULT_GREEN,
        /* TODO: using midpoints for gradient customization is a temporary solution.
        It will probably be removed in the future in favor of working with Color Manager */
        midpoints: [{ value: 0.5, color: DEFAULT_YELLOW }],
      },
    },
    custom: true,
  };
}

function getRange(axis: Axis): [number, number] {
  const minStep = axis.steps.at(0)?.value;
  const maxStep = axis.steps.at(-1)?.value;
  if (typeof minStep === 'number' && typeof maxStep === 'number') {
    return [minStep, maxStep];
  } else {
    throw Error('incorrect_axis_step_format');
  }
}

function createMCDALayersFromBivariateAxises(axises: Axis[]): MCDALayer[] {
  return axises.reduce<MCDALayer[]>((acc, axis) => {
    const numeratorFirstSentiment = axis.quotients?.at(0)?.direction?.at(0);
    const sentimentDirection = numeratorFirstSentiment?.some(
      (sentiment) => sentiment === 'bad',
    )
      ? sentimentDefault
      : sentimentReversed;
    try {
      acc.push({
        id: axis.id,
        name: axis.label,
        axis: axis.quotient,
        indicators: axis.quotients ?? [],
        unit: formatBivariateAxisUnit(axis.quotients),
        range: getRange(axis),
        datasetRange: getRange(axis),
        sentiment: sentimentDirection,
        outliers: 'clamp',
        coefficient: 1,
        transformationFunction: axis.transformation?.transformation ?? 'no',
        transformation: axis.transformation,
        normalization: 'max-min',
      });
    } catch (e) {
      console.error(e);
      notificationServiceInstance.error({
        title: 'Error',
        description: i18n.t('mcda.error_bad_layer_data'),
      });
    }
    return acc;
  }, []);
}
