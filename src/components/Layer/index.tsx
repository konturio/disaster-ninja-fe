import { useMemo } from 'react';
import {
  SimpleLegend,
  SimpleLegendStep as SimpleLegendStepComponent,
} from '~components/SimpleLegend/SimpleLegend';
import { LayerControl } from '~components/LayerControl/LayerControl';
import { BivariateLegend } from '~components/BivariateLegend/BivariateLegend';
import { FoldingWrap } from '~components/FoldingWrap/FoldingWrap';
import type { SimpleLegendStep } from '~core/logical_layers/types/legends';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';

function MultiStepLegend({ layerState }: { layerState: LogicalLayerState }) {
  if (!layerState.legend) return null;
  switch (layerState.legend.type) {
    case 'simple':
      return <SimpleLegend legend={layerState.legend} isHidden={!layerState.isVisible} />;

    case 'bivariate':
      return (
        <div>
          <BivariateLegend
            name={layerState.settings?.name ?? ''}
            meta={layerState.meta}
            legend={layerState.legend}
            isHidden={!layerState.isVisible}
          />
        </div>
      );
    default:
      return null;
  }
}

export function Layer({
  layerState,
  mutuallyExclusive,
  controlElements,
  onChange,
  canFold = true,
  childrenWithIndent = true,
}: {
  layerState: LogicalLayerState;
  controlElements: JSX.Element[];
  mutuallyExclusive?: boolean;
  onChange?: (isChecked: boolean) => void;
  canFold?: boolean;
  childrenWithIndent?: boolean;
}) {
  const hasOneStepLegend =
    layerState.legend?.type === 'simple' && layerState.legend.steps?.length === 1;

  const hasMultiStepLegend =
    (layerState.legend?.type === 'simple' && layerState.legend.steps?.length > 1) ||
    layerState.legend?.type === 'bivariate';

  const inputType = useMemo(() => {
    switch (mutuallyExclusive) {
      case true:
        return 'radio';

      case false:
        return 'checkbox';

      default:
        return 'not-interactive';
    }
  }, [mutuallyExclusive]);

  const Control = (
    <LayerControl
      isError={layerState.error !== null}
      isLoading={layerState.isLoading}
      onChange={onChange}
      enabled={layerState.isEnabled}
      hidden={!layerState.isVisible}
      name={layerState.settings?.name || layerState.id}
      icon={
        hasOneStepLegend && (
          <SimpleLegendStepComponent
            step={layerState.legend!.steps[0] as SimpleLegendStep}
            onlyIcon={true}
          />
        )
      }
      inputType={inputType}
      controls={controlElements}
    />
  );

  return hasMultiStepLegend ? (
    <FoldingWrap
      title={Control}
      open={layerState.isMounted}
      childrenWithIndent={childrenWithIndent}
      withCollapseIndicator={canFold}
    >
      <MultiStepLegend layerState={layerState} />
    </FoldingWrap>
  ) : (
    Control
  );
}
