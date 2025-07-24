import { PrismHigh, PrismLow, PrismMed } from '@konturio/default-icons';
import { MultivariateLegendStep } from './MultivariateLegendStep';

export default function ExtrusionStepsLegend({
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
        icon={<PrismLow />}
        lineKey="extrusion-low"
      />
      <MultivariateLegendStep textLines={['']} icon={<PrismMed />} />
      <MultivariateLegendStep
        textLines={highMCDAScoreLayersDirections}
        icon={<PrismHigh />}
        lineKey="extrusion-high"
      />
    </>
  );
}
