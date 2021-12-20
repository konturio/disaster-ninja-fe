import cn from 'clsx';
import { Checkbox, Radio } from '@k2-packages/ui-kit';
import s from './LayerControl.module.css';
import { NameWithSimpleLegend } from '~components/LegendPanel/components/NameWithSimpleLegend/NameWithSimpleLegend';
import { LayerLegend } from '~core/logical_layers/createLogicalLayerAtom';

interface LayerControl {
  inputType: 'radio' | 'checkbox' | 'not-interactive';
  name: string;
  isLoading?: boolean;
  isError?: boolean;
  enabled: boolean;
  hidden: boolean;
  controls?: JSX.Element[];
  onChange: ((e: React.ChangeEvent<HTMLInputElement>) => void) &
  React.ChangeEventHandler<HTMLInputElement>;
  legend?: LayerLegend
}

export function LayerControl({
  inputType,
  hidden,
  name,
  controls,
  enabled,
  onChange,
  legend,
  isLoading = false,
  isError = false,
}: LayerControl) {

  const InputIcon = (<>
    {inputType === 'checkbox' && (
      <Checkbox
        onChange={onChange}
        id={name}
        checked={enabled}
        className={s.layerInput}
      />
    )}
    {inputType === 'radio' && (
      <Radio
        onChange={onChange}
        id={name}
        checked={enabled}
        className={s.layerInput}
      />
    )}
    {inputType === 'not-interactive' && (
      <Checkbox
        onChange={onChange}
        id={name}
        checked={enabled}
        className={cn(s.layerInput, s.notInteractive)}
      />
    )}
  </>
  )


  return (
    <div
      className={cn(s.layerControl, {
        [s.hidden]: hidden,
        [s.loading]: isLoading,
        [s.error]: isError,
      })}
    >
      {legend?.type === 'simple' ?
        <NameWithSimpleLegend controlIcons={controls} inputElement={InputIcon} layerName={name} legend={legend} hasFolding />
        :
        <>
          {InputIcon}
          <div className={s.layerLabel}>
            <span>{name}</span>
          </div>
          <div className={s.controlsBar}>{controls}</div>
        </>
      }
    </div>
  );
}
