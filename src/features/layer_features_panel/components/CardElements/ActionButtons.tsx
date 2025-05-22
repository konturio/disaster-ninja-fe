import { ExternalLink16 } from '@konturio/default-icons';
import { Icon } from '~components/Icon';
import s from './ActionButtons.module.css';

export type ActionItem =
  | {
      type: 'external_link';
      title: string;
      icon?: Parameters<typeof Icon>[0]['icon'];
      data: string;
    }
  | {
      type: 'fsa';
      title: string;
      icon?: Parameters<typeof Icon>[0]['icon'];
      data: string;
    }
  | {
      type: 'icl';
      title: string;
      icon: Parameters<typeof Icon>[0]['icon'];
      alt?: string;
      data?: string;
    };

export function ActionButtons({ items }: { items: ActionItem[] }) {
  return (
    <div className={s.actions}>
      {items.map((props, i) => {
        if (props.type == 'external_link') {
          return (
            <a key={i} href={props.data || '#'} target="_blank" rel="noreferrer">
              {props.icon ? <Icon icon={props.icon} /> : <ExternalLink16 />}
              {props.title}
            </a>
          );
        }

        if (props.type == 'fsa') {
          return (
            <a key={i} href={props.data || '#'}>
              {props.icon && <Icon icon={props.icon} />}
              {props.title}
            </a>
          );
        }

        if (props.type == 'icl') {
          return (
            <a key={i} href={props.data || '#'} title={props.alt}>
              <Icon icon={props.icon} /> {props.title}
            </a>
          );
        }

        return null;
      })}
    </div>
  );
}
