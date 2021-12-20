import { TranslationService as i18n } from '~core/localization';
import { Panel, Text } from '@k2-packages/ui-kit';
import { LayersTree } from '../LayersTree/LayersTree';
import s from './MapLayersPanel.module.css';

export function MapLayerPanel() {
  return (
    <Panel
      className={s.panel}
      header={<Text type="heading-l">{i18n.t('Layers')}</Text>}
      classes={{
        header: s.header,
      }}
    >
      <div className={s.scrollable}>
        <LayersTree />
      </div>
    </Panel>
  );
}
