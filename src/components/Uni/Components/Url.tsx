import { ExternalLink16 } from '@konturio/default-icons';
import clsx from 'clsx';
import { compileStringTemplate } from '~utils/template/stringTemplate';
import { formatsRegistry } from '../formatsRegistry';
import s from './Url.module.css';

export interface UrlProps {
  value?: string;
  label?: string;
  newTab?: boolean;
  className?: string;
  urlTemplate?: string;
}

/**
 * Url component for external links with formatting options
 */
export function Url(props: UrlProps) {
  const { value = '#', label, newTab = true, className, urlTemplate } = props;
  const compiledTemplate = urlTemplate ? compileStringTemplate(urlTemplate) : null;

  const displayText = label || (value ? formatsRegistry.url_domain(value) : '');
  const url = compiledTemplate ? compiledTemplate({ value }) : value;

  return (
    <a
      href={url}
      className={clsx(s.url, className)}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      <span>{displayText}</span>
      {newTab && <ExternalLink16 className={s.icon} />}
    </a>
  );
}
