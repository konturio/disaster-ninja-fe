import { useState } from 'react';
import { FoldingWrap } from '~components/FoldingWrap/FoldingWrap';
import { Layer } from '../Layer/Layer';
import { BivariateLegend as BivariateLegendComponent } from '~components/BivariateLegend/BivariateLegend';
import s from './Group.module.css';
import { GroupWithSettings } from '~core/types/layers';
import { LogicalLayer } from '~core/logical_layers/createLogicalLayerAtom';

export function Group({
  group,
  mutuallyExclusive,
}: {
  group: GroupWithSettings;
  mutuallyExclusive?: boolean;
}) {
  const [delegatedLegend, delegateLegendRender] = useState<{
    layer: LogicalLayer;
    isHidden: boolean;
  } | null>(null);
  const [isOpen, setOpenState] = useState(group.openByDefault);

  return (
    <div className={s.group}>
      <FoldingWrap
        open={isOpen}
        label={<span className={s.groupTitle}>{group.name}</span>}
        onStateChange={(newState) => setOpenState(!newState)}
      >
        <div className={s.childrenWrap}>
          {group.children.map((chn) => (
            <Layer
              key={chn.id}
              layerAtom={chn.atom}
              mutuallyExclusive={mutuallyExclusive || group.mutuallyExclusive}
              delegateLegendRender={delegateLegendRender}
            />
          ))}
          {delegatedLegend && (
            <div className={s.bivariateLegendWrap}>
              <BivariateLegendComponent
                layer={delegatedLegend.layer}
                isHidden={delegatedLegend.isHidden}
              />
            </div>
          )}
        </div>
      </FoldingWrap>
    </div>
  );
}
