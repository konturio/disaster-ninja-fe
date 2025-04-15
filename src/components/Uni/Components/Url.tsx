import { ExternalLink16 } from '@konturio/default-icons';
import { formatsRegistry } from '../formatsRegistry';
import s from './Url.module.css';

export interface UrlProps {
  value?: string;

  label?: string;

  newTab?: boolean;

  className?: string;
}

/**
 * Url component for external links with formatting options
 */
export function Url(props: UrlProps) {
  const { value = '#', label, newTab = true, className } = props;

  const url = value;
  const displayText = label || (url ? formatsRegistry.url_domain(url) : '');

  return (
    <a
      href={url}
      className={`${s.url} ${className || ''}`}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
    >
      <span>{displayText}</span>
      {newTab && <ExternalLink16 className={s.icon} />}
    </a>
  );
}
