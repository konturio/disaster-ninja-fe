import { PopupTooltipTrigger } from '~components/PopupTooltipTrigger';
import { LAYERS_PANEL_FEATURE_ID } from '~features/layers_panel/constants';
import s from './MCDALayerParameterRow.module.css';

export type MCDALayerParameterRowProps = {
  name: string;
  infoText: string;
  children?: JSX.Element | JSX.Element[];
  onTitleDoubleClicked?: () => void;
};

export function MCDALayerParameterRow({
  name,
  infoText,
  children,
  onTitleDoubleClicked,
}: MCDALayerParameterRowProps) {
  return (
    <div className={s.inputLine}>
      <span className={s.inputLinelabel} onDoubleClick={onTitleDoubleClicked}>
        {name}
        <PopupTooltipTrigger
          className={s.infoButton}
          tipText={infoText}
          tooltipId={LAYERS_PANEL_FEATURE_ID}
        />
      </span>
      <div className={s.inputContainer}>{children}</div>
    </div>
  );
}
