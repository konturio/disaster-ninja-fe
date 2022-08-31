import { useAtom } from '@reatom/react';
import { ActionsBar, ActionsBarBTN } from '@konturio/ui-kit';
import { nanoid } from 'nanoid';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { ArrowLeft24, ArrowRight24 } from '@konturio/default-icons';
import { modesControlsAtom } from '~core/modes/modesControls';
import { APP_ROUTES } from '~core/app_config/appRoutes';
import { MODES_LABELS } from '~core/modes/constants';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import s from './SideBar.module.css';

export function SideBar() {
  const [controls] = useAtom(modesControlsAtom);
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile, setIsOpen]);

  const toggleIsOpen = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, [setIsOpen]);

  return (
    <div className={clsx(s.sideBar, isOpen && s.expanded, !isOpen && s.collapsed)}>
      <ActionsBar>
        {Object.values(controls).map((control) => {
          return (
            <Link
              key={nanoid(4)}
              className={s.sidebarItemContainer}
              to={APP_ROUTES[control.id]}
            >
              <div className={s.buttonWrap} onClick={() => control.onClick()}>
                <ActionsBarBTN
                  active={control.active}
                  iconBefore={control.icon}
                  value={control.id}
                  className={s.controlButton}
                >
                  <span className={s.modeName}>{MODES_LABELS[control.id]}</span>
                </ActionsBarBTN>
              </div>
            </Link>
          );
        })}

        <div className={s.togglerContainer} onClick={toggleIsOpen}>
          {isOpen ? <ArrowLeft24 /> : <ArrowRight24 />}
        </div>
      </ActionsBar>
    </div>
  );
}
