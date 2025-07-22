import { DimensionStep } from './DimensionStep';
import icon3DLegendLow from './icons/3d_legend_low.svg';
import icon3DLegendMed from './icons/3d_legend_med.svg';
import icon3DLegendHigh from './icons/3d_legend_high.svg';
import s from './ExtrusionLegend.module.css';

export type OpacityStepType = {
  fillColor: string;
  label?: string;
};

export default function ExtrusionStepsLegend({
  lowMCDAScoreLayersDirections,
  highMCDAScoreLayersDirections,
}: {
  lowMCDAScoreLayersDirections: string[];
  highMCDAScoreLayersDirections: string[];
}) {
  return (
    <>
      <DimensionStep
        textLines={highMCDAScoreLayersDirections}
        icon={<img src={icon3DLegendLow} className={s.extruisionIcon} />}
      />
      <DimensionStep
        textLines={['']}
        icon={<img src={icon3DLegendMed} className={s.extruisionIcon} />}
      />
      <DimensionStep
        textLines={lowMCDAScoreLayersDirections}
        icon={<img src={icon3DLegendHigh} className={s.extruisionIcon} />}
      />
    </>
  );
}
