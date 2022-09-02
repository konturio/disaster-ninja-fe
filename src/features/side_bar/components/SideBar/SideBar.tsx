import { useAction, useAtom } from '@reatom/react';
import { ActionsBar, ActionsBarBTN } from '@konturio/ui-kit';
import { nanoid } from 'nanoid';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { DoubleChevronLeft24, DoubleChevronRight24 } from '@konturio/default-icons';
import { modesControlsAtom } from '~core/modes/modesControls';
import { APP_ROUTES } from '~core/app_config/appRoutes';
import { MODES_LABELS } from '~core/modes/constants';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { i18n } from '~core/localization';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import s from './SideBar.module.css';

export function SideBar() {
  const [controls] = useAtom(modesControlsAtom);
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const setTooltip = useAction(currentTooltipAtom.setCurrentTooltip);
  const resetTooltip = useAction(currentTooltipAtom.resetCurrentTooltip);

  function onMouseEnter(target: HTMLDivElement, title: string) {
    // place tooltip right and vertically aligned to the element
    !isOpen &&
      setTooltip({
        popup: title,
        position: { x: target.offsetLeft + 40, y: target.offsetTop },
        hoverBehavior: true,
      });
  }

  function onMouseLeave() {
    resetTooltip();
  }

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile, setIsOpen]);

  const toggleIsOpen = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, [setIsOpen]);

  return (
    <ActionsBar>
      {Object.values(controls).map((control) => {
        return (
          <Link
            key={nanoid(4)}
            className={s.sidebarItemContainer}
            to={APP_ROUTES[control.id]}
            tabIndex={-1}
          >
            <div
              className={s.buttonWrap}
              onClick={() => control.onClick()}
              onPointerLeave={onMouseLeave}
              onPointerEnter={(e) =>
                onMouseEnter(e.target as HTMLDivElement, control.title)
              }
            >
              <ActionsBarBTN
                active={control.active}
                iconBefore={control.icon}
                value={control.id}
                className={s.controlButton}
              >
                {isOpen ? (
                  <span className={s.modeName}>{MODES_LABELS[control.id]}</span>
                ) : null}
              </ActionsBarBTN>
            </div>
          </Link>
        );
      })}

      <div className={s.togglerContainer}>
        <div className={s.toggler}>
          {isOpen ? (
            <div className={s.buttonWrap} onClick={toggleIsOpen} tabIndex={-1}>
              <ActionsBarBTN
                iconBefore={<DoubleChevronLeft24 />}
                className={s.controlButton}
              >
                <span className={s.modeName}>{i18n.t('sidebar.collapse')}</span>
              </ActionsBarBTN>
            </div>
          ) : (
            <div className={s.buttonWrap} onClick={toggleIsOpen}>
              <ActionsBarBTN
                iconBefore={<DoubleChevronRight24 />}
                className={s.controlButton}
              />
            </div>
          )}
        </div>
      </div>
    </ActionsBar>
  );
}
