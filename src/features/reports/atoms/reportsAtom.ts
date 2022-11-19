import { createAtom } from '~utils/atoms';
import core from '~core/index';

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
  searchable_columns_indexes?: number[];
};

export const reportsAtom = createAtom(
  {
    setReports: (reports: Report[]) => reports,
    getReports: () => {
      /* noop */
    },
  },
  ({ onAction, schedule }, state: Report[] = []) => {
    onAction('setReports', (reports) => (state = [...reports]));
    onAction('getReports', async () => {
      schedule(async (dispatch) => {
        const responseData = await core.api.reportsClient.get<Report[]>(
          `/osm_reports_list.json`,
          undefined,
          false,
        );
        if (responseData === null) throw new Error(core.i18n.t('no_data_received'));
        dispatch(reportsAtom.setReports(responseData));
      });
    });
    return state;
  },
);
