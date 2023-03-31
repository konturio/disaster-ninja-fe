import type { GeneralApiProblem, ITranslationService } from "./types";

export function getTranslatedApiErrors(i18n: { t: (arg0: string) => string }) {
  const ApiErrors = {
    NO_DATA: i18n.t('no_data_received'),
    BAD_DATA: i18n.t('wrong_data_received'),
  };
  return ApiErrors;
}
export type TApiErrors = keyof ReturnType<typeof getTranslatedApiErrors>;

export function parseApiError(
  errorResponse: GeneralApiProblem,
  i18n: ITranslationService,
): string {
  if (errorResponse && 'data' in errorResponse) {
    const { data: errorData } = errorResponse;
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
      if (errorData instanceof Object) {
        if (errorData.hasOwnProperty('error')) return errorData['error'];
        if (errorData.hasOwnProperty('errors') && Array.isArray(errorData['errors'])) {
          return errorData['errors']
            .reduce((acc, errorObj) => {
              if (errorObj.hasOwnProperty('message')) {
                acc.push(errorObj['message']);
              }
              return acc;
            }, [])
            .join('<br/>');
        }
      }

      return String(errorData);
    }

    return 'Unknown Error';
  }

  switch (errorResponse.kind) {
    case 'timeout':
      return i18n.t('errors.timeout');
    case 'cannot-connect':
      return i18n.t('errors.cannot_connect');
    case 'forbidden':
      return i18n.t('errors.forbidden');
    case 'not-found':
      return i18n.t('errors.not_found');
    case 'unknown':
      return i18n.t('errors.unknown');
    default:
      return i18n.t('errors.server_error');
  }
}
