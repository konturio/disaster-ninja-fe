import { clsx } from 'clsx';
import { CardElementsMap } from '../CardElements';
import s from './LayerFeaturesCard.module.css';
import type { FeatureCardCfg } from '../CardElements';

export function LayerFeaturesCard({
  feature,
  isActive,
  onClick,
}: {
  feature: FeatureCardCfg;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <div className={clsx(s.card, isActive && s.selected)} onClick={onClick} tabIndex={0}>
      {feature.items.map(({ type, ...k }, idx) => {
        if (CardElementsMap[type]) {
          const Component = CardElementsMap[type] as () => JSX.Element;
          return <Component key={idx} {...k} />;
        }
      })}
    </div>
  );
}
