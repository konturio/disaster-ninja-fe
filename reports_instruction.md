# Instruction for the process of loading and displaying Disaster Ninja reports

If you want to display your reports on the Disaster Ninja Reports page, you must have at least 2 separate files.

- report file in CSV format (1 for report).
- osm_reports_list.json - file describing reports (1 for any number of reports).

## Description of the internal structure of the osm_reports_list.json

- **id**, _string_ - your report id;
- **link**, _string_ - relative link to your report, for example '/your_report.csv';
- **name**, _string_ or _object_ - your report name.
  Provide an object with language codes to localize it;
- **sortable**, _boolean_ - true to make your report sortable, false to keep your report static;
- **last_updated**, _string_ - Timestamp with date of last update;
- **publick_access**, _boolean_ - true to make your report visible for unlogged users, false to keep your report visible only for particular groups of users;
- **description_full**, _string_ or _object_ - A full description of your report, which will be shown on the report page.
  Provide translations as an object keyed by language codes.
  - https://disaster.ninja/active/reports/your_report_name;
- **description_brief**, _string_ or _object_ - A short description of your report, which will be shown on the reports page.
  Provide translations as an object keyed by language codes.
  - https://disaster.ninja/active/reports;
- **searchable_columns_indexes**, _array_ - array with column number from your CSV (0-based) will be used for text search.

### An example of the internal structure of osm_reports_list.json

 `[{"id": "your_report_id",
  "link": "/your_report.csv",
  "name": {"en": "your report name"},
  "sortable": true,
  "last_updated": "2022-09-18T18:59:51Z",
  "public_access": true,
  "description_full": {"en": "full description"},
  "description_brief": {"en": "brief description"},
  "searchable_columns_indexes": [0]},
  {another report description}]`

## How to show reports on DN2

Reports have to be served by some web server.
Standalone configuration expects that reports are served at /reports/ subpath - as shown in default DN Front End configuration:
`"REPORTS_API": "https://disaster.ninja/active/reports"`

For more information, please see https://github.com/konturio/disaster-ninja-fe/blob/main/configs/config.default.json
