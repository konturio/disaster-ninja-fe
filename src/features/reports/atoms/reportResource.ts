import { reportsClient } from '~core/apiClientInstance';
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
    const responseData = await reportsClient.get<string>(
      report.link,
      undefined,
      false,
    );
    if (responseData === undefined) throw new Error('No data received');
    return responseData;
  },
  'reportResourceAtom',
  currentReportAtom,
);
