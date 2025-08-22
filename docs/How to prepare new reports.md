# How to prepare new reports 

OSM reports page on Disaster Ninja is formed from [JSON file](https://geocint.kontur.io/gis/osm_reports_list.json "https://geocint.kontur.io/gis/osm_reports_list.json") generated on Geocint during daily pipeline.\
\
On the root level we have a list of reports objects. Each of them consists of several fields:
* `id `*text* - unique name id for report,
* `name` *text* - report name that will be used as a header on reports page,
* `link` *text* - direct link to CSV file with report (for now reports are stored in public_html directory on Geocint),
* `last_updated` *text* - date of the last update that will be used on reports page (more about it below),
* `description_brief` *text* - brief description on reports page that will be used when no particular report is open,
* `description_full` *text* - full description that will be used on a page when one particular report is open,
* `column_link_templates` *json* - a template to form links in columns if it's needed (links to [osm.org](http://osm.org) objects and localhost to enable Remote control for OSM editors). The links are formed using this syntax: [https://www.openstreetmap.org/relation/{{column_name}}](https://www.openstreetmap.org/relation/%7B%7B%D0%BD%D0%B0%D0%B7%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5_%D0%BA%D0%BE%D0%BB%D0%BE%D0%BD%D0%BA%D0%B8%7D%7D) (with encapsulated column names) from CSV columns values (we could generate links directly in DB but decided to save some space in CSV and generate links on client),
* `sortable` *boolean not null default true* - flag indicating that the table has to be sortable or not,
* `searchable_columns_indexes` integer array\[\] - array of indexes of colums which will be used for search
* `public_access` *boolean not null default false* - flag indicating whether report is in test stage (`public_access is false` and it will go to test servers only) or in prod stage (`public_access is true` and it will go to test and prod servers as well)

To add a new report you have to follow these steps:

1. Add your report's metadata to osm_reports_list.sql.
2. Add a SQL script to generate reports table. Make sure that just after it you update osm_reports_list table `last_updated` column with actual timestamp from `osm_meta` table. See `osm_gadm_comparison.sql` for example.
3. Add a task to generate your CSV report to Makefile. 
4. Add a task to copy report to `~/public_html directory`.
