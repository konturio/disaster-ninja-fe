import { useState } from 'react';
import { useAtom } from '@reatom/react';
import { FoldingWrap } from '~components/FoldingWrap/FoldingWrap';
import { mountedLayersByCategoryAtom } from '~features/layers_panel/atoms/mountedLayersByCategory';
import { Group } from '../Group/Group';
import { CategoryWithSettings } from '~core/types/layers';
import { TranslationService as i18n } from '~core/localization';
import { useAction } from '@reatom/react';
import s from './Category.module.css';
import { categoryDeselection } from '../../atoms/categoryDeselection';

function CategoryMountedLayersCounter({ categoryId }: { categoryId: string }) {
  const [counters] = useAtom(mountedLayersByCategoryAtom);
  return <span className={s.mountedLayersCounter}>{counters[categoryId]}</span>;
}

export function Category({ category }: { category: CategoryWithSettings }) {
  const [isOpen, setOpenState] = useState(category.openByDefault ?? false);
  const onGroupDeselect = useAction(
    () => categoryDeselection.deselect(category.id),
    [category.id],
  );
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
          category.mutuallyExclusive && (
            <button onClick={onGroupDeselect} className={s.categoryControl}>
              {i18n.t('Deselect')}
            </button>
          )
        }
        onStateChange={(newState) => setOpenState(!newState)}
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
