import { isApiError } from '~core/api_client/apiClientError';

export const ABORT_ERROR_MESSAGE = 'Abort error';
export const isAbortError = (e: unknown) => {
  if (isApiError(e)) {
    return e.problem.kind === 'canceled';
  } else if (e instanceof DOMException) {
    return e.name === 'AbortError'; // https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
  }
  return false;
};
