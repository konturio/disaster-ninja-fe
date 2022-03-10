import { Checkbox, Radio, LineItem } from '@k2-packages/ui-kit';
import s from './LayerInput.module.css';

export interface LayerInput {
  id: string;
  enabled: boolean;
  type: 'checkbox' | 'radio' | 'not-interactive';
  label?: React.ReactChild | React.ReactChild[];
  onChange?: ((e: React.ChangeEvent<HTMLInputElement>) => void) &
    React.ChangeEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
}

function CheckboxLayerInput({
  id,
  onChange,
  onClick,
  enabled,
  label,
}: LayerInput) {
  return (
    <Checkbox
      onChange={onChange}
      onClick={onClick}
      id={id}
      checked={enabled}
      label={label}
      className={s.layerInput}
    />
  );
}

function RadioLayerInput({
  id,
  onChange,
  onClick,
  enabled,
  label,
}: LayerInput) {
  return (
    <Radio
      onChange={onChange}
      onClick={onClick}
      id={id}
      checked={enabled}
      label={label}
      className={s.layerInput}
    />
  );
}

export function LayerInput(props: LayerInput) {
  switch (props.type) {
    case 'checkbox':
      return <CheckboxLayerInput {...props} />;

    case 'radio':
      return <RadioLayerInput {...props} />;

    case 'not-interactive':
    default:
      return <LineItem label={props.label} className={s.layerInput} />;
  }
}
