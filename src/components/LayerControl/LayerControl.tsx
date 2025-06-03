import cn from 'clsx';
import { LayerInput } from '../LayerInput/LayerInput';
import s from './LayerControl.module.css';
import type { LayerLegend } from '~core/logical_layers/types/legends';

interface LayerControl {
  inputType: 'radio' | 'checkbox' | 'not-interactive';
  id: string;
  name: string;
  icon?: JSX.Element | false;
  isLoading?: boolean;
  isError?: boolean;
  enabled: boolean;
  hidden: boolean;
  controls?: JSX.Element[];
  onChange?: (isChecked: boolean) => void;
  legend?: LayerLegend;
  className?: string;
}

export function LayerControl({
  inputType,
  id,
  icon,
  hidden,
  name,
  controls,
  enabled,
  onChange,
  isLoading = false,
  isError = false,
  className,
}: LayerControl) {
  const Label = (
    <div className={s.layerLabel}>
      {icon && <div className={s.layerLabelIcon}>{icon}</div>}
      <span>{name}</span>
    </div>
  );

  return (
    <div
      className={cn(
        s.layerControl,
        {
          [s.hidden]: hidden,
          [s.loading]: isLoading,
          [s.error]: isError,
        },
        className,
      )}
    >
      <LayerInput
        id={id}
        type={inputType}
        enabled={enabled}
        label={Label}
        onChange={onChange}
      />
      <div className={s.controlsBar}>{controls}</div>
    </div>
  );
}
