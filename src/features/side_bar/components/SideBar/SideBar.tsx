import { useAction, useAtom } from '@reatom/react';
import {
  ActionsBar,
  ActionsBarBTN,
  AppHeader,
  Divider,
  Logo,
  Text,
} from '@konturio/ui-kit';
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
import { currentApplicationAtom } from '~core/shared_state';
import s from './SideBar.module.css';
const wasClosed = 'sidebarClosed';

export function SideBar() {
  const [controls] = useAtom(modesControlsAtom);
  const [isOpen, setIsOpen] = useState(localStorage.getItem(wasClosed) ? false : true);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const setTooltip = useAction(currentTooltipAtom.setCurrentTooltip);
  const resetTooltip = useAction(currentTooltipAtom.resetCurrentTooltip);
  const [searchString] = useAtom(searchStringAtom);
  const [currap] = useAtom(currentApplicationAtom);

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
              iconBefore={<TempIcon appId={currap} />}
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
      </ActionsBar>
    </div>
  );
}

// Temporary component, until simple url for icon is ready
const defaultIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 36 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 28.5223C23.8017 28.5223 28.5 23.8186 28.5 18.0223C28.5 12.226 23.8017 7.52228 18 7.52228C12.1983 7.52228 7.5 12.226 7.5 18.0223C7.5 23.8186 12.1983 28.5223 18 28.5223Z"
      stroke="#F9FAFA"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.0455 14.0562C14.073 14.0562 10.693 15.6268 9.43677 17.8197C10.693 20.0127 14.073 21.5833 18.0455 21.5833C22.0181 21.5833 25.3981 20.0127 26.6543 17.8197C25.3981 15.6268 22.0181 14.0562 18.0455 14.0562ZM23.3348 16.6722L18.8579 18.9339C19.3369 19.4393 20.0416 19.7586 20.8272 19.7586C22.2705 19.7586 23.4404 18.6811 23.4404 17.3519C23.4404 17.1158 23.4035 16.8877 23.3348 16.6722ZM12.5893 16.6722L17.0662 18.9339C16.5871 19.4393 15.8825 19.7586 15.0968 19.7586C13.6536 19.7586 12.4836 18.6811 12.4836 17.3519C12.4836 17.1158 12.5205 16.8877 12.5893 16.6722Z"
      fill="#F9FAFA"
    />
  </svg>
);

function TempIcon({ appId }: { appId?: string | null }) {
  const [appIcon, setAppIcon] = useState(defaultIcon);
  useEffect(() => {
    async function getAppIcon() {
      const res = await fetch(
        `https://test-apps02.konturlabs.com/userprofile/apps/${appId}`,
      );
      const data = await res.json();
      const iconUrl = 'sidebarIconUrl' in data && (data.sidebarIconUrl as string);
      if (iconUrl) setAppIcon(<img src={iconUrl} width={24} height={24} />);
    }
    appId && getAppIcon();
  }, [appId]);

  return appIcon;
}
