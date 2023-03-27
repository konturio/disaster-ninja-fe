export function getTranslatedApiErrors(i18n: { t: (arg0: string) => string }) {
  const ApiErrors = {
    NO_DATA: i18n.t('no_data_received'),
    BAD_DATA: i18n.t('wrong_data_received'),
  };
  return ApiErrors;
}
export type TApiErrors = keyof ReturnType<typeof getTranslatedApiErrors>;

//
