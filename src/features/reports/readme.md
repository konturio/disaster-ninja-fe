## Reports

This feature is responsible for presenting a list of Kontur reports and browsing them.
Each report has a link, a description, date of latest update and report's content represented as a table. Originally those reports are stored as `.csv` tables

### How to use

There are 2 separate root components for that feature.
`<ReportsList />` shows the list of reports, their brief description and general description of reports section. It also allows to navigate to the report by clicking on its card.
`<ReportInfo />` provides whole info about the given report, taking it's id from the link.
Considering that it's logical to run those parts as different views(on the different routes).
Here's expample of adding general `<ReportsList />`

```ts
import { ReportsList } from '~features/reports/components/ReportsList/ReportsList';
import { goTo } from './yourRouterFunction';

function GeneralReportsView({ goToReport }: { goToReport: (id: string) => void }) {
  return (
    <div>
      <ReportsList goToReport={goToReport} />
    </div>
  );
}

const appRoutesConfig = [
  {
    title: 'All reports list',
    view: <GeneralReportsView goToReport={(id) => goTo(`reportsPath/${id}`)} />,
  },
];
```

And here's how we add a single report's `<ReportInfo />`

```ts
import { ReportInfo } from '~features/reports/components/ReportInfo/ReportInfo';

function ReportFullInfoPage() {
  return <ReportInfo />;
}

// so to the routes config we would add following
appRoutesConfig.push(
  {
    title: 'Single report info',
    view: <ReportFullInfoPage } />,
    parentRoute: 'reportsPath',
    paramsIndicator: ':reportId'
    // the latter is important because ReportInfo get's id th
  }
)
```

You have to tell your router that your searching params is "reportId" because the component gets the id the following way:

```ts
import { useParams } from 'react-router';

function ReportInfo() {
  const { reportId } = useParams();
  // ...
}
```

### How it works

#### Data model

There are 2 dynamic configs we receive from the back-end.

1. `"Reports List"` - array of available reports containing all info about them including link to `.csv` file with report data (all the keys stored in `./atoms/reportsAtom.ts` `Report` type).
   `name`, `description_full` and `description_brief` fields may be provided as strings or as objects with language codes to support localization.

2. `"Report Content"` - data received from `.csv` link is the second data model.

#### Components

`<ReportsList />` shows the list of reports and generates links to go to them. It only needs `"Reports List"` data.
`<ReportInfo />` shows all reports info including content. So it need both `"Reports List"` and `"Report Content"` data. It also has a functionality of sorting and filtering data

#### Logic

`reportsAtom` is responsible for fetching and storing `"Reports List"` data. Both root components use it to fetch data, if it wasn't stored yet. `<ReportsList />` doesn't have any more logic (except for providing link for single report).

`<ReportInfo />` is also subscribed on `reportResourceAtom` that provides `"Report Content"` based on `reportId`.
Once `"Report Content"` received `tableAtom` transfroms the data from `.csv` format and provides actions for sorting and filtering.
So `<ReportTable />` shows data and hooks with actions from `tableAtom`
