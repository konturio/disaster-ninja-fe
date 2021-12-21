import cn from 'clsx';
import { Checkbox, Radio } from '@k2-packages/ui-kit';
import s from './LayerControl.module.css';

interface LayerControl {
  inputType: 'radio' | 'checkbox' | 'not-interactive';
  name: string;
  icon?: JSX.Element;
  isLoading?: boolean;
  isError?: boolean;
  enabled: boolean;
  hidden: boolean;
  controls?: JSX.Element[];
  onChange: ((e: React.ChangeEvent<HTMLInputElement>) => void) &
    React.ChangeEventHandler<HTMLInputElement>;
}

export function LayerControl({
  inputType,
  icon,
  hidden,
  name,
  controls,
  enabled,
  onChange,
  isLoading = false,
  isError = false,
}: LayerControl) {
  const Label = (
    <div className={s.layerLabel}>
      {icon && <div className={s.layerLabelIcon}>{icon}</div>}
      <span>{name}</span>
    </div>
  );

  return (
    <div
      className={cn(s.layerControl, {
        [s.hidden]: hidden,
        [s.loading]: isLoading,
        [s.error]: isError,
      })}
    >
      {inputType === 'checkbox' && (
        <Checkbox
          onChange={onChange}
          id={name}
          checked={enabled}
          label={Label}
          className={s.layerInput}
        />
      )}
      {inputType === 'radio' && (
        <Radio
          onChange={onChange}
          id={name}
          checked={enabled}
          label={Label}
          className={s.layerInput}
        />
      )}
      {inputType === 'not-interactive' && (
        <Checkbox
          onChange={onChange}
          id={name}
          checked={enabled}
          label={Label}
          className={cn(s.layerInput, s.notInteractive)}
        />
      )}
      <div className={s.controlsBar}>{controls}</div>
    </div>
  );
}
