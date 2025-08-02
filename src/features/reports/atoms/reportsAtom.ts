import { reportsClient } from '~core/apiClientInstance';
import { i18n } from '~core/localization';
import { createAtom } from '~utils/atoms';
import type { TranslatableString } from '../utils';

export type Report = {
  id: string;
  link: string;
  name: TranslatableString;
  sortable: boolean;
  last_updated: string;
  public_access: string;
  description_full: TranslatableString;
  description_brief: TranslatableString;
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
        const responseData = await reportsClient.get<Report[]>(
          `/osm_reports_list.json`,
          undefined,
          { authRequirement: reportsClient.AUTH_REQUIREMENT.NEVER },
        );
        if (responseData === null) throw new Error(i18n.t('no_data_received'));
        dispatch(reportsAtom.setReports(responseData));
      });
    });
    return state;
  },
  'reports:reportsAtom',
);
