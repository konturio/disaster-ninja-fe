import { createAtom } from '~utils/atoms';
import { reportsClient } from '~core/index';

export type Report = {
  id: string;
  link: string;
  name: string;
  sortable: boolean;
  last_updated: string;
  public_access: string;
  description_full: string;
  description_brief: string;
  column_link_templates: [
    { 'OSM ID': string },
    { Name: string } | { ['OSM name']: string },
  ];
};

export const reportsAtom = createAtom(
  {
    setReports: (reports: Report[]) => reports,
    getReports: () => {
      /* noop */
    },
  },
  ({ onAction, schedule }, state: Report[] = []) => {
    onAction('setReports', (reports) => (state = reports));
    onAction('getReports', async () => {
      schedule(async (dispatch) => {
        const responseData = await reportsClient.get<Report[]>(
          `/osm_reports_list.json`,
          undefined,
          false,
        );
        if (responseData === undefined) throw new Error('No data received');
        dispatch(reportsAtom.setReports(responseData));
      });
    });
    return state;
  },
);
