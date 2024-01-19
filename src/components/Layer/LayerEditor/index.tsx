import type { LayerEditor } from '~core/logical_layers/types/editors';

export function LayerEditor({ model }: { model: LayerEditor }) {
  return <model.component />;
}
