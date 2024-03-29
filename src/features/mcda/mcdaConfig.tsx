import { nanoid } from 'nanoid';
import { showModal } from '~core/modal';
import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { i18n } from '~core/localization';
import { formatBivariateAxisUnit, type Axis } from '~utils/bivariate';
import { MCDAForm } from './components/MCDAForm';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import type {
  MCDAConfig,
  MCDALayer,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export async function editMCDAConfig(
  layerState: LogicalLayerState,
): Promise<MCDAConfig | null> {
  const name = layerState.id;
  const axises =
    layerState.style?.config?.layers?.map((layer) => ({
      id: layer.id,
      label: layer.name,
    })) ?? [];
  const input = await showModal(MCDAForm, {
    initialState: {
      name,
      axises,
    },
  });

  if (input === null) return null;

  const newLayers = createMCDALayersFromBivariateAxises(input.axises);
  const oldLayers = layerState.style?.config?.layers ?? [];
  const resultLayers = newLayers.reduce<MCDALayer[]>((acc, layer) => {
    const oldLayer = oldLayers.find((old) => old.id === layer.id);
    acc.push(oldLayer ?? layer);
    return acc;
  }, []);

  const config = createDefaultMCDAConfig({
    id: input.name,
    layers: resultLayers,
  });
  return { ...config };
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
    id: input.name,
    layers: createMCDALayersFromBivariateAxises(input.axises),
  });
  return config;
}

function createDefaultMCDAConfig(overrides?: Partial<MCDAConfig>): MCDAConfig {
  return {
    version: 4,
    id: `${overrides?.id ?? 'mcda-layer'}_${nanoid(4)}`,
    layers: overrides?.layers ?? [],
    colors: {
      type: 'sentiments',
      parameters: {
        bad: 'rgba(228, 26, 28, 0.5)',
        good: 'rgba(90, 200, 127, 0.5)',
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
    try {
      acc.push({
        id: axis.id,
        name: axis.label,
        axis: axis.quotient,
        unit: formatBivariateAxisUnit(axis.quotients),
        range: getRange(axis),
        sentiment: ['bad', 'good'],
        coefficient: 1,
        transformationFunction: 'no',
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isMCDAConfig(json: any): json is MCDAConfig {
  // TODO: full check using ajv
  return (
    json.id &&
    json?.layers?.length &&
    json?.version >= 4 &&
    (json?.colors?.type === 'sentiments' || json?.colors?.type === 'mapLibreExpression')
  );
}
