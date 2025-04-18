import type React from 'react';

export const ErrorComponent: React.FC<{
  type: string;
  error?: string;
  severity?: 'warning' | 'error';
}> = ({ type, error, severity = 'error' }) => {
  const style = {
    color: 'white',
    backgroundColor: severity === 'error' ? 'red' : 'orange',
    fontSize: '12px',
  };
  return (
    <div style={style}>
      {error ? `Error in ${type}: ${error}` : `Unknown Component: ${type}`}
    </div>
  );
};
