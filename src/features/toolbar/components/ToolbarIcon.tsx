import * as icons from '@konturio/default-icons';
import { useEffect } from 'react';

export function ToolbarIcon({
  width,
  height,
  icon,
}: {
  width: number;
  height: number;
  icon: string;
}) {
  const Icon = icons[icon];
  useEffect(() => {
    if (!Icon) console.error(`Icon "${icon}" not found`);
  }, [icon, Icon]);
  return Icon ? <Icon width={width} height={height} /> : null;
}
