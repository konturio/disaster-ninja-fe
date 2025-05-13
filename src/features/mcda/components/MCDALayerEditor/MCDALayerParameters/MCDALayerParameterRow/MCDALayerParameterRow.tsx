import { InfoPopover } from '~components/Overlays';
import s from './MCDALayerParameterRow.module.css';

export type MCDALayerParameterRowProps = {
  name?: string;
  infoText?: string;
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
        {infoText && <InfoPopover className={s.infoButton} content={infoText} />}
      </span>
      <div className={s.inputContainer}>{children}</div>
    </div>
  );
}
