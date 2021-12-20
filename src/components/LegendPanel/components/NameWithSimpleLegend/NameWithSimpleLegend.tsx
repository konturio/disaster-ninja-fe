import { LayerLegend } from '~core/logical_layers/createLogicalLayerAtom';
import { Text } from '@k2-packages/ui-kit';
import { InlineLegend } from '../InlineLegend/InlineLegend';
import { MultiStepLegend } from '../MultiStepLegend/MultiStepLegend';
import s from './NameWithSimpleLegend.module.css';
import { FoldingWrap } from '~components/FoldingWrap/FoldingWrap';
import { useState } from 'react';

type NameWithLegendProps = {
  layerName: string,
  inputElement?: JSX.Element;
  controlIcons?: JSX.Element[];
  legend?: LayerLegend,
  hasFolding?: boolean
};

export function NameWithSimpleLegend({
  inputElement,
  controlIcons,
  layerName,
  legend,
  hasFolding = false
}: NameWithLegendProps) {

  const [isOpen, setIsOpen] = useState(false)

  if (legend?.type === 'bivariate') return null;

  const InputWrap = () => {
    if (inputElement)
      return (
        <div className={s.layerInput}>
          {inputElement}
        </div>
      );
    return null;
  };

  const ControlIcons = () => {
    if (!controlIcons?.length) return null
    return (<div className={s.controlIcons}>
      {controlIcons.map((control, i) => <div key={i}>{control}</div>)}
    </div>)
  }


  if (!legend) {
    return (
      <div className={s.nameWithLegend}>
        <div className={s.headline}>
          <InputWrap />

          <Text type="long-m">
            <span className={s.layerName}>{layerName}</span>
          </Text>

          <ControlIcons />

        </div>
      </div>
    );
  }

  // case multi-step legend
  if (legend.steps.length > 1 && hasFolding)
    return (
      <div className={s.nameWithLegend}>
        <FoldingWrap open={isOpen} onStateChange={state => setIsOpen(!state)} absoluteIndicator
          label={<div className={s.headline}>
            <InputWrap />

            <Text type="long-m">
              <span className={s.layerName}>{layerName}</span>
            </Text>

            <ControlIcons />
          </div>}>

          <MultiStepLegend legend={legend} />
        </FoldingWrap>
      </div>
    );

  if (legend.steps.length > 1)
    return (
      <div className={s.nameWithLegend}>
        <div className={s.headline}>
          <InputWrap />

          <Text type="long-m">
            <span className={s.layerName}>{layerName}</span>
          </Text>

          <ControlIcons />
        </div>
        <MultiStepLegend legend={legend} />
      </div>
    );

  // case one-step legend
  return (
    <div className={s.nameWithLegend}>
      <div className={s.headline}>
        <InputWrap />

        <InlineLegend legend={legend} className={s.inlineIcon} />

        <Text type="short-m">
          <span className={s.layerName}>{layerName}</span>
        </Text>

        <ControlIcons />
      </div>
    </div>
  );
}
