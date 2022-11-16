import { reportsClient } from '~core/apiClientInstance';
import { i18n } from '~core/localization';
import { createAtom } from '~utils/atoms';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import type { Report } from './reportsAtom';

export const currentReportAtom = createAtom(
  { setReport: (report: Report) => report },
  ({ onAction }, state: Report | null = null) => {
    onAction('setReport', (report) => (state = { ...report }));
    return state;
  },
  'reports:currentReportAtom',
);

export const reportResourceAtom = createAsyncAtom(
  currentReportAtom,
  async (report, abortController) => {
    if (!report) return null;
    const responseData = await reportsClient.get<string>(report.link, undefined, false, {
      signal: abortController.signal,
      errorsConfig: { dontShowErrors: true },
    });
    if (responseData === undefined) throw new Error(i18n.t('no_data_received'));
    return responseData;
  },
  'reports:reportResourceAtom',
);
