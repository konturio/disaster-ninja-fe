const userLocale = globalThis?.navigator?.language;
export const LocaleNumber = ({ children }: { children: number }) =>
  userLocale ? (
    <span>{children.toLocaleString(userLocale)}</span>
  ) : (
    <span>{children}</span>
  );
