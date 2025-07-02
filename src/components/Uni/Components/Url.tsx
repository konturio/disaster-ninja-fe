import { ExternalLink16 } from '@konturio/default-icons';
import clsx from 'clsx';
import { useCallback } from 'react';
import { compileStringTemplate } from '~utils/template/stringTemplate';
import { Icon } from '~components/Icon';
import { formatsRegistry } from '../formatsRegistry';
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
  const compiledTemplate = urlTemplate ? compileStringTemplate(urlTemplate) : null;

  const displayText = label || (value ? formatsRegistry.url_domain(value) : '');
  const url = compiledTemplate ? compiledTemplate({ value }) : value;

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
