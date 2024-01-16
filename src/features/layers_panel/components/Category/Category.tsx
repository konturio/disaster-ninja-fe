import { useCallback, useState } from 'react';
import { useAtom } from '@reatom/react-v2';
import { useAction } from '@reatom/react-v2';
import { FoldingWrap } from '~components/FoldingWrap/FoldingWrap';
import { mountedLayersByCategoryAtom } from '~features/layers_panel/atoms/mountedLayersByCategory';
import { Group } from '../Group/Group';
import { categoryDeselection } from '../../atoms/categoryDeselection';
import { DeselectControl } from '../DeselectControl/DeselectControl';
import s from './Category.module.css';
import type { CategoryWithSettings } from '~core/types/layers';

function CategoryMountedLayersCounter({ categoryId }: { categoryId: string }) {
  const [counters] = useAtom(mountedLayersByCategoryAtom);
  return <span className={s.mountedLayersCounter}>{counters[categoryId]}</span>;
}

export function Category({ category }: { category: CategoryWithSettings }) {
  // Temporary solution before redisign according to task 11553-unfold-all-layers-tree-in-layers-panel-by-default
  // const [isOpen, setOpenState] = useState(category.openByDefault ?? false);
  const [isOpen, setOpenState] = useState(true);
  const onCategoryDeselect = useAction(
    () => categoryDeselection.deselect(category.id),
    [category.id],
  );
  const toggleOpenState = useCallback(() => setOpenState((state) => !state), []);
  return (
    <div className={s.category}>
      <FoldingWrap
        open={isOpen}
        title={
          <div className={s.categoryTitle}>
            <span>{category.name}</span>
            {!category.mutuallyExclusive ? (
              <CategoryMountedLayersCounter categoryId={category.id} />
            ) : null}
          </div>
        }
        controls={
          category.mutuallyExclusive && <DeselectControl onClick={onCategoryDeselect} />
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
