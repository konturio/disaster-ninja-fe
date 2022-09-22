import { reportsClient } from '~core/apiClientInstance';
import { i18n } from '~core/localization';
import { createAtom, createResourceAtom } from '~utils/atoms';
import type { Report } from './reportsAtom';

export const currentReportAtom = createAtom(
  { setReport: (report: Report) => report },
  ({ onAction }, state: Report | null = null) => {
    onAction('setReport', (report) => (state = report));
    return state;
  },
);

export const reportResourceAtom = createResourceAtom(
  async (report) => {
    if (!report) return null;
    const responseData = await reportsClient.get<string>(report.link, undefined, false);
    if (responseData === undefined) throw new Error(i18n.t('no_data_received'));
    return responseData;
  },
  'reportResourceAtom',
  currentReportAtom,
);
