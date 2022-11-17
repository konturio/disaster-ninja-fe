const userLocale = window.navigator.language;
export const LocaleNumber = ({ children }: { children: number }) => (
  <span>{children.toLocaleString(userLocale)}</span>
);
