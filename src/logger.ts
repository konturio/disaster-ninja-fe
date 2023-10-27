export async function persistLog(message: string, trace?: string) {
  return fetch('log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timestamp: Date.now(),
      message,
      trace,
    }),
  });
}
