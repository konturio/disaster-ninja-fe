import cn from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActionsBarBTN, Tooltip } from '@konturio/ui-kit';
import { DoubleChevronLeft24, DoubleChevronRight24 } from '@konturio/default-icons';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { i18n } from '~core/localization';
import s from './SideBar.module.css';

const wasClosed = 'sidebarClosed';

type ToggleButtonProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ToggleButton({ isOpen, setIsOpen }: ToggleButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [isMobile, setIsOpen]);

  const toggleIsOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
    setIsTooltipOpen(false);
  }, []);

  // store locally user preferation to close sidebar
  useEffect(() => {
    if (!isOpen) localStorage.setItem(wasClosed, 'true');
    else localStorage.removeItem(wasClosed);
  }, [isOpen]);

  if (isOpen)
    return (
      <div
        className={cn(s.buttonWrap, s.togglerButton)}
        onClick={toggleIsOpen}
        tabIndex={-1}
      >
        <ActionsBarBTN iconBefore={<DoubleChevronLeft24 />} className={s.controlButton}>
          <span className={s.modeName}>{i18n.t('sidebar.collapse')}</span>
        </ActionsBarBTN>
      </div>
    );

  return (
    <div
      ref={ref}
      onClick={toggleIsOpen}
      className={cn(s.buttonWrap, s.togglerButton)}
      onPointerLeave={() => setIsTooltipOpen(false)}
      onPointerEnter={() => setIsTooltipOpen(true)}
    >
      <ActionsBarBTN iconBefore={<DoubleChevronRight24 />} className={s.controlButton} />

      <Tooltip triggerRef={ref} placement="right" open={isTooltipOpen} hoverBehavior>
        {i18n.t('sidebar.expand')}
      </Tooltip>
    </div>
  );
}
