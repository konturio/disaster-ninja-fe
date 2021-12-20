import { useState } from 'react';
import { FoldingWrap } from '~components/FoldingWrap/FoldingWrap';
import { Layer } from '../Layer/Layer';
import { BIVARIATE_GROUP_ID } from '~features/layers_panel/constants';
import { LayersBivariateLegend } from '../LayersBivariateLegend/LayersBivariateLegend';
import s from './Group.module.css'
import { GroupWithSettings } from '~core/types/layers';

export function Group({
  group,
  mutuallyExclusive,
}: {
  group: GroupWithSettings;
  mutuallyExclusive?: boolean;
}) {
  const [isOpen, setOpenState] = useState(group.openByDefault);

  return (
    <div className={s.group}>
      <FoldingWrap
        open={isOpen}
        label={<span>{group.name}</span>}
        onStateChange={(newState) => setOpenState(!newState)}
      >
        <div className={s.childrenWrap}>
          {group.children.map((chn) => (
            <Layer
              key={chn.id}
              layerAtomId={chn.id}
              mutuallyExclusive={mutuallyExclusive || group.mutuallyExclusive}
            />
          ))}
          {group.id === BIVARIATE_GROUP_ID && <LayersBivariateLegend ids={group.children.map(c => c.id)} />}
        </div>
      </FoldingWrap>
    </div>
  );
}
