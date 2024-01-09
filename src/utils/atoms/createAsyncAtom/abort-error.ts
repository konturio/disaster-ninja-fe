import { isApiError } from '~core/api_client/apiClientError';

export const ABORT_ERROR_MESSAGE = 'Abort error';

export const isAbortError = (e: unknown) => {
  if (!e) return false;
  if (typeof e === 'string') {
    return e === ABORT_ERROR_MESSAGE;
  }
  if (isApiError(e)) {
    return e.problem.kind === 'canceled';
  } else if (e instanceof DOMException) {
    return e.name === 'AbortError'; // https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
  }
  return false;
};

export async function abortable<T>(
  abortController: AbortController,
  promise: Promise<T>,
): Promise<T> {
  return new Promise((res, rej) => {
    if (abortController.signal.aborted) {
      rej(new DOMException('Aborted', 'AbortError'));
    }
    const onAbort = () => {
      abortController.signal.removeEventListener('abort', onAbort);
      rej(new DOMException('Aborted', 'AbortError'));
    };
    abortController.signal.addEventListener('abort', onAbort);
    promise
      .then(res)
      .catch(rej)
      // prevent memory leak
      .finally(() => abortController.signal.removeEventListener('abort', onAbort));
  });
}
