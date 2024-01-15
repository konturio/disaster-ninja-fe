import wretch from 'wretch';
import { KONTUR_DEBUG } from '~utils/debug';
import { ApiClientError } from './apiClientError';
import type { WretchError } from 'wretch';
import type { GeneralApiProblem } from './types';

/**
 * Gathering errors translations here to be used later in platform error refactor
 */
export function getTranslatedApiErrors(i18n: { t: (arg0: string) => string }) {
  const ApiErrors = {
    NO_DATA: i18n.t('no_data_received'),
    BAD_DATA: i18n.t('wrong_data_received'),
    TIMEOUT: i18n.t('errors.timeout'),
    CANNOT_CONNECT: i18n.t('errors.cannot_connect'),
    FORBIDDEN: i18n.t('errors.forbidden'),
    NOT_FOUND: i18n.t('errors.not_found'),
    UNKNOWN: i18n.t('errors.unknown'),
    SERVER: i18n.t('errors.server_error'),
  };

  return ApiErrors;
}

export function parseApiError(errorObj: WretchError): string {
  if (errorObj?.json) {
    const errorData = errorObj?.json;
    if (errorData !== null) {
      if (Array.isArray(errorData)) {
        return errorData
          .map((errorMsg) =>
            errorMsg.name && errorMsg.message
              ? `${errorMsg.name}: ${errorMsg.message}`
              : errorMsg,
          )
          .join('<br/>');
      }
      if (errorData?.error) return errorData['error'];
      if (errorData?.errors && Array.isArray(errorData['errors'])) {
        return errorData['errors']
          .reduce((acc, errorObj) => {
            if (errorObj?.message) {
              acc.push(errorObj['message']);
            }
            return acc;
          }, [])
          .join('<br/>');
      }
    }
    return String(errorData);
  }
  return errorObj?.text ?? errorObj?.message ?? 'Unknown Error';
}

export function createApiError(err: unknown) {
  let errorMessage = '';
  let problem: GeneralApiProblem = { kind: 'unknown', temporary: true };
  let status = 0;
  // Determine problem
  if (err instanceof ApiClientError) {
    // error already parsed
    return err;
  }
  if (KONTUR_DEBUG) {
    console.error(err);
  }
  if (err instanceof wretch.WretchError) {
    status = err.status;
    // In case of 400/401 error we need to parse error message from body and show it to user
    if (status === 400 || status === 401) {
      errorMessage = err.json?.error_description ?? err?.message ?? 'Auth error';
      problem = { kind: 'unauthorized', data: err.json?.error };
    } else if (status === 403) {
      problem = { kind: 'forbidden' };
    } else if (status === 404) {
      problem = { kind: 'not-found' };
    } else if (status === 408) {
      problem = { kind: 'timeout', temporary: true };
    } else if (status >= 500) {
      problem = { kind: 'server', data: err?.json ?? err?.text };
    }
  } else if (isAbortError(err)) {
    problem = { kind: 'canceled' };
  } else {
    // non-api, network or other fetch error
    // 4xx/5xx without Access-Control-Allow-Origin - as generic TypeError
    // by default classified as unknown problem
    problem = { kind: 'client-unknown' };
  }
  // Parse error message from error body
  if (!errorMessage) {
    // @ts-expect-error any error can be parsed
    errorMessage = parseApiError(err);
  }
  return new ApiClientError(errorMessage || 'Unknown error', problem, status);
}

export function isAbortError(e) {
  return e?.name === 'AbortError' || e?.problem?.kind === 'canceled';
}
