import { TooltipTrigger } from '~components/TooltipTrigger';
import { LAYERS_PANEL_FEATURE_ID } from '~features/layers_panel/constants';
import s from './style.module.css';

export type MCDAParameterProps = {
  name: string;
  tipText?: string;
  children?: JSX.Element | JSX.Element[];
};

export function MCDAParameter({ name, tipText, children }: MCDAParameterProps) {
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
