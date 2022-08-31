import { Tabs } from '@konturio/ui-kit';
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from '@konturio/ui-kit/tslib/Tabs/components';
import { ColumnWidth16, Tags16, TwoXTwo16 } from '@konturio/default-icons';
import { ColorLegendsView } from '~views/BivariateManager/sub_views/ColorLegends/ColorLegendsView';
import { i18n } from '~core/localization';
import style from './BivariateManager.module.css';

export function BivariateManagerPage() {
  const tabsClasses = {
    selected: style.SelectedTab,
  };

  return (
    <Tabs
      defaultIndex={1}
      className={style.pageContainer}
      orientation="vertical"
    >
      <TabList className={style.Nav}>
        <Tab className={style.Tab} classes={tabsClasses}>
          <div className={style.TabItem}>
            <span className={style.TabIcon}>
              <ColumnWidth16 />
            </span>
            {i18n.t('bivariate.color_manager.sentiments_tab')}
          </div>
        </Tab>
        <Tab className={style.Tab} classes={tabsClasses}>
          <div className={style.TabItem}>
            <span className={style.TabIcon}>
              <TwoXTwo16 />
            </span>
            {i18n.t('bivariate.color_manager.color_legends_tab')}
          </div>
        </Tab>
        <Tab className={style.Tab} classes={tabsClasses}>
          <div className={style.TabItem}>
            <span className={style.TabIcon}>
              <Tags16 />
            </span>
            {i18n.t('bivariate.color_manager.layers_tab')}
          </div>
        </Tab>
      </TabList>

      <TabPanels className={style.TabPanels}>
        <TabPanel>Sentiments</TabPanel>
        <TabPanel>
          <ColorLegendsView />
        </TabPanel>
        <TabPanel>Layers (indicators)</TabPanel>
      </TabPanels>
    </Tabs>
  );
}
