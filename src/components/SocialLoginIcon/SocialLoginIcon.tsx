import clsx from 'clsx';
import s from './SocialLoginIcon.module.css';
import googleIcon from './google_icon.png';
import githubIcon from './github_icon.png';
import osmIcon from './osm_icon.png';

interface SocialLoginIconProps {
  type: 'google' | 'github' | 'osm';
  className?: string;
}

const ICON_SOURCES = {
  google: googleIcon,
  github: githubIcon,
  osm: osmIcon,
};

export function SocialLoginIcon({ type, className }: SocialLoginIconProps) {
  return (
    <img alt={type} className={clsx(s.socialIcon, className)} src={ICON_SOURCES[type]} />
  );
}
