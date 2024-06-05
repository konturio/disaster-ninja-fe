import { PopupTooltipTrigger } from '~components/PopupTooltipTrigger';
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
    <PopupTooltipTrigger tipText={description} showedOnHover={true} />
  </Label>
);
