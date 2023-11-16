import * as icons from '@konturio/default-icons';

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
  return <Icon width={width} height={height} />;
}
