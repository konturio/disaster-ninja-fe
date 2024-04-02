import { TooltipTrigger } from '~components/TooltipTrigger';
import { LAYERS_PANEL_FEATURE_ID } from '~features/layers_panel/constants';
import s from './MCDALayerParameterRow.module.css';

export type MCDALayerParameterRowProps = {
  name: string;
  tipText?: string;
  children?: JSX.Element | JSX.Element[];
};

export function MCDALayerParameterRow({
  name,
  tipText,
  children,
}: MCDALayerParameterRowProps) {
  return (
    <div className={s.inputLine}>
      <span className={s.inputLinelabel}>
        {name}
        {tipText && (
          <TooltipTrigger
            className={s.infoButton}
            tipText={tipText}
            tooltipId={LAYERS_PANEL_FEATURE_ID}
          />
        )}
      </span>
      <div className={s.inputContainer}>{children}</div>
    </div>
  );
}
