import React, { useEffect, useState } from 'react';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { OAMAuthRequired } from './OAMAuthRequired';
import type { OAMAuthFeatureConfig } from '~core/config/types';

function hasOAMSession(cookieName: string) {
  try {
    return document.cookie.split(';').some((cookie) => {
      const trimmed = cookie.trim();
      return trimmed.startsWith(`${cookieName}=`) && trimmed.split('=')[1];
    });
  } catch (error) {
    console.error('Failed to parse cookies:', error);
    return false;
  }
}

export function OAMAuthWrapper({ children }: { children: React.ReactNode }) {
  const oamAuthConfig = configRepo.get().features[
    AppFeature.OAM_AUTH
  ] as OAMAuthFeatureConfig;
  const { sessionCookieName, sessionCheckIntervalMs } = oamAuthConfig;

  const [isAuthorized, setIsAuthorized] = useState(() => {
    return typeof window !== 'undefined' ? hasOAMSession(sessionCookieName) : false;
  });

  useEffect(() => {
    const checkOAMSession = () => {
      setIsAuthorized(hasOAMSession(sessionCookieName));
    };

    checkOAMSession();

    const interval = setInterval(checkOAMSession, sessionCheckIntervalMs);

    return () => clearInterval(interval);
  }, [sessionCookieName, sessionCheckIntervalMs]);

  if (isAuthorized) {
    return <>{children}</>;
  }

  return <OAMAuthRequired />;
}
