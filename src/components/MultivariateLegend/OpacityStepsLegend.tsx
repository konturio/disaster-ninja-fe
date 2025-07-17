import { SquareIcon } from '~components/SimpleLegend/icons/SquareIcon';
import { MultivariateLegendStep } from './MultivariateLegendStep';

export type OpacityStepType = {
  fillColor: string;
  label?: string;
};

export default function OpacityStepsLegend({
  lowMCDAScoreLayersDirections,
  highMCDAScoreLayersDirections,
}: {
  lowMCDAScoreLayersDirections: string[];
  highMCDAScoreLayersDirections: string[];
}) {
  return (
    <>
      <MultivariateLegendStep
        textLines={highMCDAScoreLayersDirections}
        icon={
          <SquareIcon size="normal" styles={{ 'fill-color': '#5AC87F33', width: '0' }} />
        }
      />
      <MultivariateLegendStep
        textLines={['']}
        icon={
          <SquareIcon size="normal" styles={{ 'fill-color': '#5AC87F66', width: '0' }} />
        }
      />
      <MultivariateLegendStep
        textLines={lowMCDAScoreLayersDirections}
        icon={
          <SquareIcon size="normal" styles={{ 'fill-color': '#5AC87FFF', width: '0' }} />
        }
      />
    </>
  );
}
