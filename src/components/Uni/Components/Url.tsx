import { ExternalLink16 } from '@konturio/default-icons';
import clsx from 'clsx';
import { useCallback } from 'react';
import { Icon } from '~components/Icon';
import { formatsRegistry } from '../formatsRegistry';
import { applyValueToTemplate } from '../helpers/applyValueToTemplate';
import s from './Url.module.css';

export interface UrlProps {
  value?: string;
  label?: string;
  newTab?: boolean;
  className?: string;
  urlTemplate?: string;
  icon?: Parameters<typeof Icon>[0]['icon'];
}

/**
 * Url component for external links with formatting options
 */
export function Url(props: UrlProps) {
  const { value = '#', label, newTab = true, className, urlTemplate } = props;
  const url = urlTemplate ? applyValueToTemplate(urlTemplate, value) : value;
  const displayText = label || (url ? formatsRegistry.url_domain(url) : '');

  const LinkIcon = useCallback(
    () =>
      props.icon ? (
        <Icon icon={props.icon} className={s.icon} />
      ) : (
        <ExternalLink16 className={s.icon} />
      ),
    [props.icon],
  );

  return (
    <a
      href={url}
      className={clsx(s.url, className)}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      {(newTab || props.icon) && <LinkIcon />}
      <span>{displayText}</span>
    </a>
  );
}
