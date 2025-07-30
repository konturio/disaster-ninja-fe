import { useCallback } from 'react';
import { useAtom as useAtomV2 } from '@reatom/react-v2';
import { useAtom } from '@reatom/npm-react';
import { useAction } from '@reatom/react-v2';
import { FoldingWrap } from '~components/FoldingWrap/FoldingWrap';
import { mountedLayersByCategoryAtom } from '~features/layers_panel/atoms/mountedLayersByCategory';
import { Group } from '../Group/Group';
import { categoryDeselection } from '../../atoms/categoryDeselection';
import { DeselectControl } from '../DeselectControl/DeselectControl';
import { layersTreeOpenStateAtom } from '../../atoms/openState';
import s from './Category.module.css';
import type { CategoryWithSettings } from '~core/types/layers';

export function Category({ category }: { category: CategoryWithSettings }) {
  const [openMap] = useAtomV2(layersTreeOpenStateAtom);
  const [counters] = useAtom(mountedLayersByCategoryAtom);
  const isOpen = openMap.get(category.id) ?? true;
  const setOpen = useAction(layersTreeOpenStateAtom.set);
  const onCategoryDeselect = useAction(
    () => categoryDeselection.deselect(category.id),
    [category.id],
  );
  const toggleOpenState = useCallback(
    () => setOpen(category.id, !isOpen),
    [setOpen, category.id, isOpen],
  );
  return (
    <div className={s.category}>
      <FoldingWrap
        open={isOpen}
        title={
          <div className={s.categoryTitle}>
            <span>{category.name}</span>
            {!category.mutuallyExclusive ? (
              // counter text
              <span className={s.mountedLayersCounter}>{counters[category.id]}</span>
            ) : null}
          </div>
        }
        controls={
          category.mutuallyExclusive &&
          (counters[category.id] ?? 0) > 0 && (
            <DeselectControl onClick={onCategoryDeselect} />
          )
        }
        onClick={toggleOpenState}
      >
        {category.children.map((group) => (
          <Group
            key={group.id}
            group={group}
            mutuallyExclusive={category.mutuallyExclusive}
          />
        ))}
      </FoldingWrap>
    </div>
  );
}
