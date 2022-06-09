import clsx from 'clsx';
import s from './SocialLoginIcon.module.css';

interface SocialLoginIconProps {
  type: 'google' | 'github' | 'osm';
  className?: string;
}

const ICON_SOURCES = {
  google: 'assets/google_icon.png',
  github: 'assets/github_icon.png',
  osm: 'assets/osm_icon.png',
};

export function SocialLoginIcon({ type, className }: SocialLoginIconProps) {
  return (
    <img
      alt={type}
      className={clsx(s.socialIcon, className)}
      src={ICON_SOURCES[type]}
    />
  );
}
