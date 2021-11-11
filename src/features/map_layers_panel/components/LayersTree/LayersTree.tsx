import { useMemo, useState } from 'react';
import { useAction, useAtom } from '@reatom/react';
import type { LogicalLayerAtom } from '../../types';
import { LayerControl } from '../LayerControl/LayerControl';
import { ICategory, IGroup } from './types';
import { createTree } from './createTree';

export function LayersTree({ layers }: { layers: LogicalLayerAtom[] }) {
  const tree = useMemo(() => createTree(layers), [layers]);
  return (
    <div>
      {tree.map((chn) => {
        if ('isCategory' in chn) return <Category category={chn} />;
        if ('isGroup' in chn) return <Group group={chn} />;
        return <Layer key={chn.id} layerAtom={chn} />;
      })}
    </div>
  );
}

function Category({ category }: { category: ICategory }) {
  // const categorySettings = useCategorySettings(category.id);
  // const enabledLayersCount = useCategoryEnabledLayersCount(category.id);
  // const [isOpen, setOpenState] = useState(
  //   categorySettings.openByDefault ?? false,
  // );
  return (
    <div>
      {category.children.map((group) => (
        <Group key={group.id} group={group} />
      ))}
    </div>
  );
}

function Group({ group }: { group: IGroup }) {
  // const groupSettings = useGroupSettings(group.id);
  const [isOpen, setOpenState] = useState(
    /*groupSettings.openByDefault ?? */ false,
  );
  return (
    <Collapse
      open={isOpen}
      label={<span>{'groupSettings.name'}</span>}
      onStateChange={(newState) => setOpenState(!newState)}
    >
      {group.children.map((chn) => (
        <Layer key={chn.id} layerAtom={chn} />
      ))}
    </Collapse>
  );
}

function Collapse({
  open,
  onStateChange,
  children,
  label,
}: {
  open: boolean;
  onStateChange: (newState: boolean) => void;
  children: JSX.Element | JSX.Element[];
  label: JSX.Element;
}) {
  return (
    <div>
      <div onClick={() => onStateChange(open)}>
        <button>{open ? '-' : '+'}</button>
        <div>{label}</div>
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}

function Layer({ layerAtom }: { layerAtom: LogicalLayerAtom }) {
  const [layer] = useAtom(layerAtom);
  const onChange = useAction(
    () => (layer.isMounted ? layerAtom.unmount() : layerAtom.mount()),
    [layer.isMounted],
  );
  return (
    <LayerControl
      isError={layer.isError}
      isLoading={layer.isLoading}
      onChange={onChange}
      enabled={layer.isMounted}
      hidden={!layer.isVisible}
      name={layer.layer.name || layer.id}
      inputType={'checkbox'}
    />
  );
}
