import { Button, Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { Search16 } from '@konturio/default-icons';
import { SearchBar } from '~features/search/componets/SearchBar/SearchBar';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { i18n } from '~core/localization';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import s from './styles.module.css';

export function Search() {
  const { isOpen, closePanel, openFullState } = useShortPanelState({
    skipShortState: true,
  });
  useAutoCollapsePanel(isOpen, closePanel);

  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  return (
    <>
      <Panel
        className={s.searchPanel}
        contentClassName={s.contentClassName}
        isOpen={isOpen}
        contentHeight="100%"
        modal={{ showInModal: isMobile, onModalClick: () => null }}
      >
        <div className={s.searchWrapper}>
          <SearchBar
            onItemSelect={isMobile ? closePanel : undefined}
            searchBarClass={s.searchBar}
          />
          <Button onClick={closePanel} variant="invert" className={s.cancelButton}>
            <Text type="short-m">{i18n.t('cancel')}</Text>
          </Button>
        </div>
      </Panel>
      <PanelIcon
        icon={<Search16 />}
        className={s.panelIcon}
        clickHandler={openFullState}
      ></PanelIcon>
    </>
  );
}
