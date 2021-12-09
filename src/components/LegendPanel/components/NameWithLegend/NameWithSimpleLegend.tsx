import { useMemo } from 'react';
import { LogicalLayer } from '~core/logical_layers/createLogicalLayerAtom';
import { Text } from '@k2-packages/ui-kit';
import { InlineLegend } from '../StepIcons/InlineLegend';
import { MultiStepsLegend } from '../StepIcons/MultiStepsLegend';
import { Checkbox } from '@k2-packages/ui-kit';
import s from './NameWithSimpleLegend.module.css';
import { Tooltip } from '~components/Tooltip/Tooltip';

type NameWithLegendProps = {
  layer: LogicalLayer;
  hasCheckBox: boolean;
  onCheckBoxChange?: () => void;
  checkBoxCheked?: boolean;
  extraIcons?: JSX.Element[];
};

export function NameWithSimpleLegend({
  layer,
  hasCheckBox,
  onCheckBoxChange,
  checkBoxCheked,
  extraIcons,
}: NameWithLegendProps) {
  const tipText = useMemo(() => {
    if (!layer.legend || layer.legend.type === 'bivariate') return '';
    let message = '';
    if (layer.description) message = layer.description;

    if (layer.copyright) message += '\n' + layer.copyright;

    return message;
  }, [layer.legend]);

  if (layer.legend?.type === 'bivariate' || !layer.name) return null;

  const CheckBoxElement = () => {
    if (hasCheckBox)
      return (
        <Checkbox
          onChange={onCheckBoxChange}
          id={layer.id}
          checked={checkBoxCheked}
          label={layer.name}
          className={s.layerInput}
        />
      );
    return null;
  };

  if (!layer.legend)
    return (
      <div className={s.nameWithLegend}>
        <div className={s.headline}>
          <CheckBoxElement />

          <Text type="long-m">
            <span className={s.layerName}>{layer.name}</span>
          </Text>

          {extraIcons && [...extraIcons]}

          <Tooltip className={s.tooltip} tipText={tipText} />
        </div>
      </div>
    );

  // case multi-step legend
  if (layer.legend.steps.length > 1)
    return (
      <div className={s.nameWithLegend}>
        <div className={s.headline}>
          <CheckBoxElement />

          <Text type="long-m">
            <span className={s.layerName}>{layer.name}</span>
          </Text>

          <div className={s.extraIcons}>{extraIcons && [...extraIcons]}</div>

          <Tooltip className={s.tooltip} tipText={tipText} />
        </div>
        <MultiStepsLegend legend={layer.legend} />
      </div>
    );

  // case one-step legend
  return (
    <div className={s.nameWithLegend}>
      <div className={s.headline}>
        <CheckBoxElement />

        <InlineLegend legend={layer.legend} />

        <Text type="short-m">
          <span className={s.layerName}>{layer.name}</span>
        </Text>

        <div className={s.extraIcons}>{extraIcons && [...extraIcons]}</div>

        <Tooltip className={s.tooltip} tipText={tipText} />
      </div>
    </div>
  );
}
