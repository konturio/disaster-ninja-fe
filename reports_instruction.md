# Instruction for the process of loading and displaying Disaster Ninja reports

If you want to display your reports on the Disaster Ninja Reports page, you must have at least 2 separate files.
- report file in CSV format (1 for report).
- osm_reports_list.json - file describing reports (1 for any number of reports).

## Description of the internal structure of the osm_reports_list.json

- **id**, *string* - your report id;
- **link**, *string* - relative link to your report, for example '/your_report.csv';
- **name**, *string* - your report name;
- **sortable**, *boolean* - true to make your report sortable, false to keep your report static;
- **last_updated**, *string* - Timestamp with date of last update;
- **publick_access**, *boolean* - true to make your report visible for unlogged users, false to keep your report visible only for particular groups of users;
- **description_full**, *string* - A full description of your report, which will be shown on the report page. - https://disaster.ninja/active/reports/your_report_name;
- **description_brief**, *string* - A short description of your report, which will be shown on the reports page. - https://disaster.ninja/active/reports;
- **searchable_columns_indexes**, *array* - array with column number from your CSV (0-based) will be used for text search.

### An example of the internal structure of osm_reports_list.json

`[{"id": "your_report_id",
  "link": "/your_report.csv",
  "name": "your report name",
  "sortable": true,
  "last_updated": "2022-09-18T18:59:51Z",
  "public_access": true,
  "description_full": "full description",
  "description_brief": "brief description",
  "searchable_columns_indexes": [0]},
  {another report description}]`

## How to show reports on DN2

Reports have to be served by some web server. 
Standalone configuration expects that reports are served at /reports/ subpath - as shown in default DN Front End configuration:
`"REPORTS_API": "https://disaster.ninja/active/reports"`
For more information, please see https://github.com/konturio/disaster-ninja-fe/blob/main/configs/config.default.json
