import { useCallback } from 'react';
import { useAction, useAtom } from '@reatom/react-v2';
import { FoldingWrap } from '~components/FoldingWrap/FoldingWrap';
import { useMountedLayersByGroup } from '~features/layers_panel/hooks/useMountedLayersByGroup';
import { Layer } from '../Layer/Layer';
import { groupDeselection } from '../../atoms/groupDeselection';
import { layersTreeOpenStateAtom } from '../../atoms/openState';
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
  const [openMap] = useAtom(layersTreeOpenStateAtom);
  const counter = useMountedLayersByGroup(group.id);
  const isOpen = openMap.get(group.id) ?? true;
  const setOpen = useAction(layersTreeOpenStateAtom.set);
  const groupDeselectAction = useAction(
    () => groupDeselection.deselect(group.id),
    [group.id],
  );
  const toggleOpenState = useCallback(
    () => setOpen(group.id, !isOpen),
    [setOpen, group.id, isOpen],
  );

  return (
    <div className={s.group}>
      <FoldingWrap
        open={isOpen}
        title={<span className={s.groupTitle}>{group.name}</span>}
        controls={
          group.mutuallyExclusive &&
          counter > 0 && <DeselectControl onClick={groupDeselectAction} />
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
