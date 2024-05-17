import type { PropsWithChildren } from 'react';

export function SimpleWrapper({ children }: PropsWithChildren) {
  return (
    <div>
      <article>{children}</article>
    </div>
  );
}
