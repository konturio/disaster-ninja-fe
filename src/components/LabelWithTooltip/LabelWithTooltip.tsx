import s from './LabelWithTooltip.module.css';
import { Tooltip } from '~components/Tooltip/Tooltip';
import clsx from 'clsx';

interface LabelWithTooltipProps {
  text: string;
  description: string;
  className?: string;
}

export const LabelWithTooltip = ({
  text,
  description,
  className,
}: LabelWithTooltipProps) => (
  <div className={clsx(s.tooltip, className)}>
    {text}
    <Tooltip tipText={description} showedOnHover={true} />
  </div>
);
