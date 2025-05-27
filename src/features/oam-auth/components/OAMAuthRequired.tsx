import { Button } from '@konturio/ui-kit';
import s from './OAMAuthRequired.module.css';

function OAMAuthRequired() {
  return (
    <div className={s.pageContainer}>
      <a
        href={`http://api.openaerialmap.org/oauth/google?original_uri=${encodeURIComponent(window.location.href)}`}
        className={s.loginButton}
      >
        <Button>Login with Google</Button>
      </a>
    </div>
  );
}

export { OAMAuthRequired };
