import { clsx } from 'clsx';
import { isValidUniElement, UniElementsMap } from './Elements';
import s from './UniCard.module.css';
import type { UniElementId, UniCardCfg } from './Elements';

export function UniCard({
  feature,
  isActive,
  onClick,
}: {
  feature: UniCardCfg;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <div className={clsx(s.card, isActive && s.selected)} onClick={onClick} tabIndex={0}>
      {feature.items.map((item, idx) => {
        // Normalize string shorthand to object format
        const normalizedItem = Object.entries(item).reduce(
          (acc, [key, value]) => {
            // String shorthand normalization
            if (typeof value === 'string') {
              acc[key as UniElementId] = { value };
            }
            // Array shorthand normalization (e.g., labels: ['A', 'B'])
            else if (
              Array.isArray(value)
              // && value.every((item) => typeof item === 'string')
            ) {
              // acc[key as UniElementId] = { value: value.map((v) => ({ value: v })) };
              acc[key as UniElementId] = { value };
            }
            // Preserve object syntax
            else {
              acc[key as UniElementId] = value;
            }
            return acc;
          },
          {} as Record<UniElementId, any>,
        );
        console.log({ idx, item, normalizedItem });

        const [elementType] = Object.keys(normalizedItem) as UniElementId[];
        if (!elementType || !isValidUniElement(normalizedItem, elementType)) {
          console.warn('Invalid UniCard item:', normalizedItem);
          return null;
        }

        const Component = UniElementsMap[elementType];
        const props = normalizedItem[elementType];
        return <Component key={`${elementType}-${idx}`} {...props} />;
      })}
    </div>
  );
}
