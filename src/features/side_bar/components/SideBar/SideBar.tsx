import { useAction, useAtom } from '@reatom/react';
import { ActionsBar, ActionsBarBTN, Logo } from '@konturio/ui-kit';
import { nanoid } from 'nanoid';
import sortBy from 'lodash/sortBy';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { DoubleChevronLeft24, DoubleChevronRight24 } from '@konturio/default-icons';
import clsx from 'clsx';
import { modesControlsAtom } from '~core/modes/modesControls';
import { APP_ROUTES } from '~core/app_config/appRoutes';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { i18n } from '~core/localization';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { searchStringAtom } from '~core/url_store/atoms/urlStore';
import { SidebarAppIcon } from '../AppIcon/AppIcon';
import s from './SideBar.module.css';
const wasClosed = 'sidebarClosed';

export function SideBar() {
  const [controls] = useAtom(modesControlsAtom);
  const [isOpen, setIsOpen] = useState(localStorage.getItem(wasClosed) ? false : true);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const setTooltip = useAction(currentTooltipAtom.setCurrentTooltip);
  const resetTooltip = useAction(currentTooltipAtom.resetCurrentTooltip);
  const [searchString] = useAtom(searchStringAtom);

  function onMouseEnter(target: HTMLDivElement, title: string | JSX.Element) {
    // place tooltip right and vertically aligned to the element
    !isOpen &&
      setTooltip({
        popup: title,
        position: {
          x: target.offsetLeft + 50,
          y: target.offsetTop,
          predefinedPosition: 'bottom-right',
        },
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
    resetTooltip();
  }, [setIsOpen]);

  // store locally user preferation to close sidebar
  useEffect(() => {
    if (!isOpen) {
      localStorage.setItem(wasClosed, 'true');
    } else {
      localStorage.removeItem(wasClosed);
    }
  }, [isOpen]);

  return (
    <div className={s.sidebar}>
      <ActionsBar>
        <div className={clsx(s.logoWrap, s.sidebarItemContainer)} tabIndex={-1}>
          <div className={s.buttonWrap}>
            <ActionsBarBTN
              active={false}
              iconBefore={<SidebarAppIcon />}
              className={clsx(s.controlButton, s.logoButton)}
            >
              {isOpen ? (
                <span className={s.modeName}>
                  Disaster <br /> Ninja
                </span>
              ) : null}
            </ActionsBarBTN>
          </div>
        </div>

        {sortBy(controls, 'order').map((control) => {
          return (
            <Link
              key={nanoid(4)}
              className={s.sidebarItemContainer}
              to={APP_ROUTES[control.id] + searchString}
              tabIndex={-1}
            >
              <div
                className={s.buttonWrap}
                onClick={control.onClick}
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
                  {isOpen ? <span className={s.modeName}>{control.title}</span> : null}
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
              <div
                className={s.buttonWrap}
                onClick={toggleIsOpen}
                onPointerLeave={onMouseLeave}
                onPointerEnter={(e) =>
                  onMouseEnter(e.target as HTMLDivElement, i18n.t('sidebar.expand'))
                }
              >
                <ActionsBarBTN
                  iconBefore={<DoubleChevronRight24 />}
                  className={s.controlButton}
                />
              </div>
            )}
          </div>
        </div>

        <div className={s.konturLogo}>
          <Logo compact={!isOpen} palette="grey" height={32} />
        </div>
      </ActionsBar>
    </div>
  );
}
