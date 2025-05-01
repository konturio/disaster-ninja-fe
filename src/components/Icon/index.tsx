import * as icons from '@konturio/default-icons';
import { forwardRef, useEffect } from 'react';
import type { SVGProps, MemoExoticComponent } from 'react';

type IconComponent = MemoExoticComponent<(props: SVGProps<SVGSVGElement>) => JSX.Element>;
type IconCollection = typeof icons;

type SVGIconProps = SVGProps<SVGSVGElement>;

interface IconProps extends Omit<SVGIconProps, 'ref'> {
  icon: keyof IconCollection;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(({ icon, ...svgProps }, ref) => {
  const KonturIcon = icons[icon] as IconComponent;

  useEffect(() => {
    if (!icons[icon]) console.error(`Icon "${icon}" not found`);
  }, [icon]);

  return KonturIcon ? <KonturIcon ref={ref} {...svgProps} /> : null;
});

Icon.displayName = 'SvgIcon';
