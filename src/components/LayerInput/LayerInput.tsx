import { Checkbox, Radio, LineItem } from '@k2-packages/ui-kit';
import s from './LayerInput.module.css';

export interface LayerInput {
  id: string;
  enabled: boolean;
  type: 'checkbox' | 'radio' | 'not-interactive';
  label?: React.ReactChild | React.ReactChild[];
  onChange?: ((e: React.ChangeEvent<HTMLInputElement>) => void) &
    React.ChangeEventHandler<HTMLInputElement>;
}

export function LayerInput({ id, type, onChange, enabled, label }: LayerInput) {
  if (type === 'checkbox') {
    return (
      <Checkbox
        onChange={onChange}
        id={id}
        checked={enabled}
        label={label}
        className={s.layerInput}
      />
    );
  }

  if (type === 'radio') {
    return (
      <Radio
        onChange={onChange}
        id={id}
        checked={enabled}
        label={label}
        className={s.layerInput}
      />
    );
  }

  if (type === 'not-interactive') {
    return <LineItem label={label} className={s.layerInput} />;
  }

  return null;
}
