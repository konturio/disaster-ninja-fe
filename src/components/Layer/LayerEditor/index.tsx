import type { LayerEditor } from '~core/logical_layers/types/editors';

export function LayerEditor({
  layerId,
  model: Model,
}: {
  layerId: string;
  model: LayerEditor;
}) {
  return <Model.component layerId={layerId} />;
}
