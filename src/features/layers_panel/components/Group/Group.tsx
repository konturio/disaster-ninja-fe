import { useCallback, useMemo, useState } from 'react';
import { useAction } from '@reatom/react-v2';
import { FoldingWrap } from '~components/FoldingWrap/FoldingWrap';
import { BivariateLegend as BivariateLegendComponent } from '~components/BivariateLegend/BivariateLegend';
import { debounce } from '~utils/common';
import { Layer } from '../Layer/Layer';
import { groupDeselection } from '../../atoms/groupDeselection';
import { DeselectControl } from '../DeselectControl/DeselectControl';
import s from './Group.module.css';
import type { GroupWithSettings } from '~core/types/layers';
import type { LayerMeta } from '~core/logical_layers/types/meta';
import type { LayerLegend } from '~core/logical_layers/types/legends';

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
  // Temporary solution before redisign according to task 11553-unfold-all-layers-tree-in-layers-panel-by-default
  // const [isOpen, setOpenState] = useState(group.openByDefault);
  const [isOpen, setOpenState] = useState(true);
  const groupDeselectAction = useAction(
    () => groupDeselection.deselect(group.id),
    [group.id],
  );

  function onGroupDeselect() {
    groupDeselectAction();
    delegateLegendRender(null);
  }

  /**
   * OWhen layer unmounted it remove delegated legend,
   * next layer can delegate his render right after it.
   * To avoid flickering and renders count I debounce this renders
   */
  const debouncedLegendRenderer = useMemo(() => {
    return debounce(delegateLegendRender, 300);
  }, [delegateLegendRender]);

  return (
    <div className={s.group}>
      <FoldingWrap
        open={isOpen}
        title={<span className={s.groupTitle}>{group.name}</span>}
        controls={
          group.mutuallyExclusive && <DeselectControl onClick={onGroupDeselect} />
        }
        onStateChange={(newState) => setOpenState(!newState)}
      >
        <div className={s.childrenWrap}>
          {group.children.map((chn) => (
            <Layer
              key={chn.id}
              layerAtom={chn.atom}
              mutuallyExclusive={mutuallyExclusive || group.mutuallyExclusive}
              delegateLegendRender={debouncedLegendRenderer}
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
