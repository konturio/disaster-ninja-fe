import { useCallback, useState } from 'react';
import { useAction } from '@reatom/react-v2';
import { FoldingWrap } from '~components/FoldingWrap/FoldingWrap';
import { Layer } from '../Layer/Layer';
import { groupDeselection } from '../../atoms/groupDeselection';
import { useMountedLayersByGroup } from '~features/layers_panel/hooks/useMountedLayersByGroup';
import { DeselectControl } from '../DeselectControl/DeselectControl';
import s from './Group.module.css';
import type { GroupWithSettings } from '~core/types/layers';

export function Group({
  group,
  mutuallyExclusive,
}: {
  group: GroupWithSettings;
  mutuallyExclusive?: boolean;
}) {
  // Temporary solution before redisign according to task 11553-unfold-all-layers-tree-in-layers-panel-by-default
  // const [isOpen, setOpenState] = useState(group.openByDefault);
  const [isOpen, setOpenState] = useState(true);
  const counter = useMountedLayersByGroup(group.id);
  const groupDeselectAction = useAction(
    () => groupDeselection.deselect(group.id),
    [group.id],
  );
  const toggleOpenState = useCallback(() => setOpenState((state) => !state), []);

  return (
    <div className={s.group}>
      <FoldingWrap
        open={isOpen}
        title={<span className={s.groupTitle}>{group.name}</span>}
        controls={
          group.mutuallyExclusive && counter > 0 && (
            <DeselectControl onClick={groupDeselectAction} />
          )
        }
        onClick={toggleOpenState}
      >
        <div className={s.childrenWrap}>
          {group.children.map((chn) => (
            <Layer
              key={chn.id}
              layerAtom={chn.atom}
              mutuallyExclusive={mutuallyExclusive || group.mutuallyExclusive}
            />
          ))}
        </div>
      </FoldingWrap>
    </div>
  );
}
