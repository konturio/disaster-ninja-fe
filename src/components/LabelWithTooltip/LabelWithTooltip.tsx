import { TooltipTrigger } from '~components/TooltipTrigger';
import { Label } from '~components/Label/Label';

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
  <Label className={className}>
    {text}
    <TooltipTrigger tipText={description} showedOnHover={true} />
  </Label>
);
