import React, { useEffect, useState } from 'react';
import { Button } from '@konturio/ui-kit';
import s from './crossFrameOAuth.module.css';

export type CrossFrameOAuthConfig = {
  authUrl: string;
  sessionCookie: string;
  loginButtonText: string;
  sessionCheckIntervalMs?: number;
  redirectUriParamName?: string;
};

function hasSession(cookieName: string) {
  try {
    return document.cookie.split(';').some((cookie) => {
      const trimmed = cookie.trim();
      return trimmed.startsWith(`${cookieName}=`) && trimmed.split('=')[1];
    });
  } catch (e) {
    console.error('Failed to parse cookies:', e);
    return false;
  }
}

export class CrossFrameOAuthProvider {
  constructor(public config: CrossFrameOAuthConfig) {}

  isAuthorized() {
    return hasSession(this.config.sessionCookie);
  }

  getAuthUrl(redirectTo: string = window.location.href) {
    const param = this.config.redirectUriParamName ?? 'redirect_uri';
    return `${this.config.authUrl}?${param}=${encodeURIComponent(redirectTo)}`;
  }
}

export function CrossFrameAuthRequired({ provider }: { provider: CrossFrameOAuthProvider }) {
  return (
    <div className={s.pageContainer}>
      <a href={provider.getAuthUrl()} className={s.loginButton}>
        <Button>{provider.config.loginButtonText}</Button>
      </a>
    </div>
  );
}

export function CrossFrameAuthWrapper({
  children,
  provider,
}: {
  children: React.ReactNode;
  provider: CrossFrameOAuthProvider;
}) {
  const interval = provider.config.sessionCheckIntervalMs ?? 30000;
  const [authorized, setAuthorized] = useState(() =>
    typeof window !== 'undefined' ? provider.isAuthorized() : false,
  );

  useEffect(() => {
    const check = () => setAuthorized(provider.isAuthorized());
    check();
    const id = setInterval(check, interval);
    return () => clearInterval(id);
  }, [provider, interval]);

  if (authorized) return <>{children}</>;
  return <CrossFrameAuthRequired provider={provider} />;
}
