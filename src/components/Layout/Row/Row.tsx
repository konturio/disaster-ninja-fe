export function Row({ children }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'stretch',
        minHeight: '0',
      }}
    >
      {children}
    </div>
  );
}
