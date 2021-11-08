import { createBindAtom } from '~utils/atoms/createBindAtom';
import { apiClient } from '~core/index';

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

export const reportsAtom = createBindAtom(
  {
    setReports: (reports: Report[]) => reports,
    getReports: () => {
      /* noop */
    },
  },
  ({ onAction }, state: Report[] = []) => {
    onAction('setReports', (reports) => (state = reports));
    onAction('getReports', async () => {
      const responseData = await apiClient.get<Report[]>(
        `/reportsApi/gis/osm_reports_list.json`,
        undefined,
        false,
      );
      if (responseData === undefined) throw new Error('No data received');
      reportsAtom.setReports.dispatch(responseData);
    });
    return state;
  },
  'reportsAtom',
);
