import core from '~core/index';
import { createAtom } from '~utils/atoms';
import { createAsyncAtom } from '~utils/atoms/createAsyncAtom';
import type { Report } from './reportsAtom';

export const currentReportAtom = createAtom(
  { setReport: (report: Report) => report },
  ({ onAction }, state: Report | null = null) => {
    onAction('setReport', (report) => (state = { ...report }));
    return state;
  },
);

export const reportResourceAtom = createAsyncAtom(
  currentReportAtom,
  async (report, abortController) => {
    if (!report) return null;
    const responseData = await core.api.reportsClient.get<string>(
      report.link,
      undefined,
      false,
      {
        signal: abortController.signal,
        errorsConfig: { dontShowErrors: true },
      },
    );
    if (responseData === undefined) throw new Error(core.i18n.t('no_data_received'));
    return responseData;
  },
  'reportResourceAtom',
);
