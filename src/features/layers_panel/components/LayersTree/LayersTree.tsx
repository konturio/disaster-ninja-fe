import { useAtom } from '@reatom/npm-react';
import { layersTreeAtom } from '~core/logical_layers/atoms/layersTree';
import { Layer } from '../Layer/Layer';
import { Category } from '../Category/Category';
import { Group } from '../Group/Group';
import s from './LayersTree.module.css';

export function LayersTree() {
  const [tree] = useAtom(layersTreeAtom);

  return (
    <div className={s.layersTree}>
      {tree.children.map((chn) => {
        if ('isCategory' in chn) return <Category key={chn.id} category={chn} />;
        if ('isGroup' in chn) return <Group key={chn.id} group={chn} />;
        return (
          <div key={chn.id} className={s.topLevelGroup}>
            <Layer layerAtom={chn.atom} mutuallyExclusive={false} />
          </div>
        );
      })}
    </div>
  );
}
