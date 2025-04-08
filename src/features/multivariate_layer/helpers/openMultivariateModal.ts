import { showModal } from '~core/modal';
import { MultivariateAnalysisForm } from '../components/MultivariateAnalysisForm';
import type { MultivariateLayerConfig } from '~core/logical_layers/renderers/MultivariateRenderer/types';

export async function openMultivariateModal(initialConfig?: MultivariateLayerConfig) {
  const result = await showModal(MultivariateAnalysisForm, { initialConfig });
  return result;
}
