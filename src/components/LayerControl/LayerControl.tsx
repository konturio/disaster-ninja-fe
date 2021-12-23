import cn from 'clsx';
import s from './LayerControl.module.css';
import { LayerLegend } from '~core/logical_layers/createLogicalLayerAtom';
import { LayerInput } from '../LayerInput/LayerInput';

interface LayerControl {
  inputType: 'radio' | 'checkbox' | 'not-interactive';
  name: string;
  icon?: JSX.Element | false;
  isLoading?: boolean;
  isError?: boolean;
  enabled: boolean;
  hidden: boolean;
  controls?: JSX.Element[];
  onChange: ((e: React.ChangeEvent<HTMLInputElement>) => void) &
    React.ChangeEventHandler<HTMLInputElement>;
  legend?: LayerLegend;
  className?: string;
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
      onClick={(e) => console.log('LayerControl', e)}
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
        id={name}
        type={inputType}
        enabled={enabled}
        label={Label}
        onChange={onChange}
      />
      <div className={s.controlsBar}>{controls}</div>
    </div>
  );
}
