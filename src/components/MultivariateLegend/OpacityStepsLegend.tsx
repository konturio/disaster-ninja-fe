import { SquareIcon } from '~components/SimpleLegend/icons/SquareIcon';
import { MultivariateLegendStep } from './MultivariateLegendStep';

const OPACITY_COLORS = {
  LOW: '#5AC87F33',
  MEDIUM: '#5AC87F66',
  HIGH: '#5AC87FFF',
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
        textLines={lowMCDAScoreLayersDirections}
        icon={
          <SquareIcon
            size="normal"
            styles={{ 'fill-color': OPACITY_COLORS.LOW, width: '0' }}
          />
        }
        lineKey="opacity-low"
      />
      <MultivariateLegendStep
        textLines={['']}
        icon={
          <SquareIcon
            size="normal"
            styles={{ 'fill-color': OPACITY_COLORS.MEDIUM, width: '0' }}
          />
        }
      />
      <MultivariateLegendStep
        textLines={highMCDAScoreLayersDirections}
        icon={
          <SquareIcon
            size="normal"
            styles={{ 'fill-color': OPACITY_COLORS.HIGH, width: '0' }}
          />
        }
        lineKey="opacity-high"
      />
    </>
  );
}
