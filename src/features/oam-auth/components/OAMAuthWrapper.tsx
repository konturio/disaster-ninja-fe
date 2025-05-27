import React, { useEffect, useState } from 'react';
import { OAMAuthRequired } from './OAMAuthRequired';

function hasOAMSession() {
  try {
    return document.cookie.split(';').some((cookie) => {
      const trimmed = cookie.trim();
      return trimmed.startsWith('oam-session=') && trimmed.split('=')[1];
    });
  } catch (error) {
    console.error('Failed to parse cookies:', error);
    return false;
  }
}

export function OAMAuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return typeof window !== 'undefined' ? hasOAMSession() : false;
  });

  useEffect(() => {
    const checkOAMSession = () => {
      setIsAuthorized(hasOAMSession());
    };

    checkOAMSession();

    const interval = setInterval(checkOAMSession, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isAuthorized) {
    return <>{children}</>;
  }

  return <OAMAuthRequired />;
}
