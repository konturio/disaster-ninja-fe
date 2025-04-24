import { showModal } from '~core/modal';
import { DEFAULT_MCDA_COLORS_BY_SENTIMENT } from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations/constants';
import { createMCDALayersFromBivariateAxes } from '~utils/mcda/createMCDALayersFromBivariateAxes';
import { generateMCDAId } from '../../utils/mcda/generateMCDAId';
import { MCDAForm } from './components/MCDAForm';
import { DEFAULT_MCDA_NAME } from './constants';
import type {
  MCDAConfig,
  MCDALayer,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export async function editMCDAConfig(oldConfig: MCDAConfig): Promise<MCDAConfig | null> {
  const name = oldConfig.name;
  const oldLayers = oldConfig.layers ?? [];
  const axes = oldLayers.map((layer) => ({
    id: layer.id,
    label: layer.name,
  }));
  const input = await showModal(MCDAForm, {
    initialState: {
      name,
      axes,
    },
  });
  if (input === null) return null;

  const newLayers = createMCDALayersFromBivariateAxes(input.axes);
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
      axes: [],
    },
  });

  if (input === null) return null;

  const config = createDefaultMCDAConfig({
    name: input.name,
    layers: createMCDALayersFromBivariateAxes(input.axes),
  });
  return config;
}

export function createDefaultMCDAConfig(overrides?: Partial<MCDAConfig>): MCDAConfig {
  const name = overrides?.name ?? DEFAULT_MCDA_NAME;

  return {
    version: 4,
    id: generateMCDAId(name),
    name,
    layers: overrides?.layers ?? [],
    colors: DEFAULT_MCDA_COLORS_BY_SENTIMENT,
  };
}
