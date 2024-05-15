import { Panel } from '@konturio/ui-kit';
import { BivariateMatrix24, Close24 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import BivariateMatrixContainer from '../BivariateMatrixContainer/BivariateMatrixContainer';
import s from './BivariatePanel.module.css';

export function BivariatePanel({ onConfirm }) {
  return (
    <Panel
      className={s.bivariatePanel}
      header={String(i18n.t('bivariate.panel.header'))}
      headerIcon={<BivariateMatrix24 />}
      customControls={[{ icon: <Close24 />, onWrapperClick: () => onConfirm(false) }]}
    >
      <div className={s.panelBody}>
        <BivariateMatrixContainer />
      </div>
    </Panel>
  );
}

export default BivariatePanel;
