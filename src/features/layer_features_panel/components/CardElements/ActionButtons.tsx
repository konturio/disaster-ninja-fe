import { ExternalLink16 } from '@konturio/default-icons';
import s from './ActionButtons.module.css';

export interface ActionItem {
  title: string;
  type: 'external_link' | 'fsa';
  data: string;
}

export function ActionButtons({ items }: { items: ActionItem[] }) {
  return (
    <div className={s.actions}>
      {items.map(({ title, type, data }, i): JSX.Element => {
        let el;

        if (type == 'external_link') {
          el = (
            <a key={i} href={data} target="_blank" rel="noreferrer">
              <ExternalLink16 />
              {title}
            </a>
          );
        }

        return el;
      })}
    </div>
  );
}
