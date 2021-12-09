import { useState } from 'react';
import { Collapse } from '../Collapse/Collapse';
import { GroupWithSettings } from '../../types';
import { Layer } from '../Layer/Layer';

export function Group({
  group,
  mutuallyExclusive,
}: {
  group: GroupWithSettings;
  mutuallyExclusive?: boolean;
}) {
  const [isOpen, setOpenState] = useState(group.openByDefault);

  return (
    <Collapse
      open={isOpen}
      label={<span>{group.name}</span>}
      onStateChange={(newState) => setOpenState(!newState)}
    >
      {group.children.map((chn) => (
        <Layer
          key={chn.id}
          layerAtomId={chn.id}
          mutuallyExclusive={mutuallyExclusive || group.mutuallyExclusive}
        />
      ))}
    </Collapse>
  );
}
