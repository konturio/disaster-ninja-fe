import type { WretchResponse } from 'wretch';

export async function autoParseBody(res: WretchResponse) {
  if (res.status === 204) {
    res.data = null;
    return res;
  }

  if (res.ok) {
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      res.data = await res.json();
    } else {
      res.data = await res.text();
    }
  }

  return res;
}
