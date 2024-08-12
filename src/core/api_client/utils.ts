import type { WretchResponse } from 'wretch/types';

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
  } else {
    console.debug('autoParseBody', res);
  }

  return res;
}
