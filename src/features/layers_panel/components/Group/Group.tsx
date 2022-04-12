import { useState } from 'react';
import { FoldingWrap } from '~components/FoldingWrap/FoldingWrap';
import { Layer } from '../Layer/Layer';
import { groupDeselection } from '../../atoms/groupDeselection';
import { BivariateLegend as BivariateLegendComponent } from '~components/BivariateLegend/BivariateLegend';
import s from './Group.module.css';
import { GroupWithSettings } from '~core/types/layers';
import { LayerMeta } from '~core/logical_layers/types/meta';
import { LayerLegend } from '~core/logical_layers/types/legends';
import { useAction } from '@reatom/react';
import { DeselectControl } from '../DeselectControl/DeselectControl';

export function Group({
  group,
  mutuallyExclusive,
}: {
  group: GroupWithSettings;
  mutuallyExclusive?: boolean;
}) {
  const [delegatedLegend, delegateLegendRender] = useState<{
    meta: LayerMeta | null;
    legend: LayerLegend | null;
    name: string;
    isHidden: boolean;
  } | null>(null);
  const [isOpen, setOpenState] = useState(group.openByDefault);
  const groupDeselectAction = useAction(
    () => groupDeselection.deselect(group.id),
    [group.id],
  );

  function onGroupDeselect() {
    groupDeselectAction();
    delegateLegendRender(null);
  }

  return (
    <div className={s.group}>
      <FoldingWrap
        open={isOpen}
        title={<span className={s.groupTitle}>{group.name}</span>}
        controls={
          group.mutuallyExclusive && (
            <DeselectControl onClick={onGroupDeselect} />
          )
        }
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
                name={delegatedLegend.name}
                meta={delegatedLegend.meta}
                legend={delegatedLegend.legend}
                isHidden={delegatedLegend.isHidden}
              />
            </div>
          )}
        </div>
      </FoldingWrap>
    </div>
  );
}
