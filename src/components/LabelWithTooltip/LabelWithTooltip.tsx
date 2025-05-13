import { InfoOutline16 } from '@konturio/default-icons';
import { SimpleTooltip } from '@konturio/floating';
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
    <SimpleTooltip content={description}>
      <span style={{ display: 'inline-block' }}>
        <InfoOutline16 />
      </span>
    </SimpleTooltip>
  </Label>
);
