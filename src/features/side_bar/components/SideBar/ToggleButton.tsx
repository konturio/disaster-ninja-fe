import clsx from 'clsx';
import { useCallback, useEffect } from 'react';
import { ActionsBarBTN } from '@konturio/ui-kit';
import { DoubleChevronLeft24, DoubleChevronRight24 } from '@konturio/default-icons';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { i18n } from '~core/localization';
import { Tooltip, TooltipTrigger, TooltipContent } from '~core/tooltips';
import s from './SideBar.module.css';

const wasClosed = 'sidebarClosed';

type ToggleButtonProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ToggleButton({ isOpen, setIsOpen }: ToggleButtonProps) {
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [isMobile, setIsOpen]);

  const toggleIsOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // store locally user preferation to close sidebar
  useEffect(() => {
    if (!isOpen) localStorage.setItem(wasClosed, 'true');
    else localStorage.removeItem(wasClosed);
  }, [isOpen]);

  if (isOpen)
    return (
      <div onClick={toggleIsOpen} tabIndex={-1}>
        <ActionsBarBTN
          iconBefore={<DoubleChevronLeft24 />}
          className={clsx(s.navButton, s.sidebarButton)}
        >
          {i18n.t('sidebar.collapse')}
        </ActionsBarBTN>
      </div>
    );

  return (
    <Tooltip placement="right" offset={6}>
      <div onClick={toggleIsOpen}>
        <TooltipTrigger>
          <ActionsBarBTN
            iconBefore={<DoubleChevronRight24 />}
            className={clsx(s.navButton, s.sidebarButton)}
          />
        </TooltipTrigger>
      </div>
      <TooltipContent>{i18n.t('sidebar.expand')}</TooltipContent>
    </Tooltip>
  );
}
