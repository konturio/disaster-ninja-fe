import { useAtom } from '@reatom/react';
import { layersTreeAtom } from '~core/logical_layers/atoms/layersTree';
import { featureStatus } from '~core/featureStatus';
import { AppFeature } from '~core/auth/types';
import { Layer } from '../Layer/Layer';
import { Category } from '../Category/Category';
import { Group } from '../Group/Group';
import s from './LayersTree.module.css';

let markedReady = false;

export function LayersTree() {
  const [tree] = useAtom(layersTreeAtom);

  if (!markedReady) {
    featureStatus.markReady(AppFeature.MAP_LAYERS_PANEL);
    markedReady = true;
  }

  return (
    <div className={s.layersTree}>
      {tree.children.map((chn) => {
        if ('isCategory' in chn)
          return <Category key={chn.id} category={chn} />;
        if ('isGroup' in chn) return <Group key={chn.id} group={chn} />;
        return (
          <Layer key={chn.id} layerAtom={chn.atom} mutuallyExclusive={false} />
        );
      })}
    </div>
  );
}
