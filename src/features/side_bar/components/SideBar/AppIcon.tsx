import { useAtom } from '@reatom/react';
import { currentAppPropertiesResourceAtom } from '~core/shared_state/currentApplication';

// Will be replaced with icons from modules when ready
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

export function SidebarAppIcon() {
  const [{ data: appParams }] = useAtom(currentAppPropertiesResourceAtom);
  const appIcon = <img src={appParams?.sidebarIconUrl} width={24} height={24} />;
  const asyncIcon = appParams?.sidebarIconUrl ? appIcon : defaultIcon;
  return asyncIcon;
}
