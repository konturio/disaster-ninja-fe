import React, { useEffect, useState } from 'react';
import { OAMAuthRequired } from './OAMAuthRequired';

function hasOAMSession() {
  return document.cookie.split(';').some((c) => c.trim().startsWith('oam-session='));
}

export function OAMAuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    setIsAuthorized(hasOAMSession());
  }, []);

  if (isAuthorized) {
    return <>{children}</>;
  }

  return <OAMAuthRequired />;
}
