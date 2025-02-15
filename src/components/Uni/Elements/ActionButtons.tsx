import { SimpleTooltip } from '@konturio/floating';
import { Icon } from '~components/Icon';
import s from './ActionButtons.module.css';

export type ActionItem =
  | {
      type: 'external_link';
      title: string;
      data: string;
    }
  | {
      type: 'fsa';
      title: string;
      icon?: Parameters<typeof Icon>[0]['icon'];
      data: string;
    };

export function ActionButtons({ value }: { value: ActionItem[] }) {
  return (
    <div className={s.actions}>
      {value.map((props, i) => {
        if (props.type == 'external_link') {
          return (
            <a key={i} href={props.data || '#'} target="_blank" rel="noreferrer">
              <Icon icon="ExternalLink16" />
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

        return null;
      })}
    </div>
  );
}

export type IconListItem = {
  title: string;
  icon: Parameters<typeof Icon>[0]['icon'];
  alt?: string;
  data?: string;
};
export function IconList({ value }: { value: IconListItem[] }) {
  return (
    <div className={s.actions}>
      {value.map((props, i) => (
        <ListItem key={i} {...props} />
      ))}
    </div>
  );
}

function ListItem(props) {
  const { alt, icon, title } = props;
  const comp = (
    <div className={'uni_iconlist_item'}>
      {icon && <Icon icon={icon} />} {title}
    </div>
  );
  const res = alt ? (
    <SimpleTooltip content={alt} placement="top">
      {comp}
    </SimpleTooltip>
  ) : (
    comp
  );
  return res;
}
