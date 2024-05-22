import type { PropsWithChildren } from 'react';

export function MarkdownWrapper({ children }: PropsWithChildren) {
  return (
    <div>
      <article>{children}</article>
    </div>
  );
}
