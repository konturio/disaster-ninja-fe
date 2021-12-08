import { useAtom } from '@reatom/react';
import { createContext } from 'react';
import { logicalLayersRegistryAtom } from '~core/shared_state';
import { layersTreeAtom } from '~core/logical_layers/atoms/layersTree';
import { Layer } from '../Layer/Layer';
import { Category } from '../Category/Category';
import { Group } from '../Group/Group';
import type { LogicalLayerAtom } from '~core/logical_layers/createLogicalLayerAtom';

export const LogicalLayersRegistryContext = createContext<
  Record<string, LogicalLayerAtom>
>({});

export function LayersTree() {
  const [tree] = useAtom(layersTreeAtom);
  const [registry] = useAtom(logicalLayersRegistryAtom);

  return (
    <LogicalLayersRegistryContext.Provider value={registry}>
      <div>
        {tree.children.map((chn) => {
          if ('isCategory' in chn)
            return <Category key={chn.id} category={chn} />;
          if ('isGroup' in chn) return <Group key={chn.id} group={chn} />;
          return (
            <Layer
              key={chn.id}
              layerAtomId={chn.id}
              mutuallyExclusive={false}
            />
          );
        })}
      </div>
    </LogicalLayersRegistryContext.Provider>
  );
}
