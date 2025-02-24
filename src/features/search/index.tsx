import { Button, Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { Search24 } from '@konturio/default-icons';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { i18n } from '~core/localization';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import { SearchBar } from '~features/search/componets/SearchBar/SearchBar';
import s from './styles.module.css';

export function Search() {
  const { isOpen, closePanel, openFullState } = useShortPanelState({
    skipShortState: true,
  });
  useAutoCollapsePanel(isOpen, closePanel);

  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  useEffect(() => {
    if (isOpen && isMobile) {
      inputRef?.current?.focus(); // triggers phone keyboard
    }
  }, [isOpen, isMobile]);

  return (
    <>
      <Panel
        className={clsx(s.searchPanel, { [s.collapse]: !isOpen }, 'knt-panel')}
        contentClassName={s.contentContainer}
        isOpen={isOpen}
        contentHeight="100%"
        modal={{ showInModal: isMobile, onModalClick: () => null }}
      >
        <div className={s.searchWrapper}>
          <SearchBar
            onItemSelect={isMobile ? closePanel : undefined}
            searchBarClass={s.searchBar}
            ref={inputRef}
          />
          <Button onClick={closePanel} variant="invert" className={s.cancelButton}>
            <Text type="short-m">{i18n.t('cancel')}</Text>
          </Button>
        </div>
      </Panel>
      <PanelIcon
        icon={<Search24 />}
        className={clsx(s.panelIcon, 'knt-panel-icon')}
        clickHandler={openFullState}
      />
    </>
  );
}
