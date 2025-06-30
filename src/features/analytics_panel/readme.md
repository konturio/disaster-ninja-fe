# Analytics Panel

The analytics panel feature allows the user to view analytics data related to a selected disaster geometry.

## Atoms

### analyticsResourceAtom

This atom is responsible for fetching analytics data related to the selected disaster geometry. It uses `createAsyncAtom` from the `~utils/atoms/createAsyncAtom` module to create an asynchronous atom. The atom takes the `focusedGeometryAtom` atom as input and returns analytics data as output. The atom also dispatches a metrics event using the `dispatchMetricsEventOnce` function from the `~core/metrics/dispatch` module to track the success or failure of the API request.

### currentEventDataAtom

This atom is responsible for extracting the event data related to the selected disaster geometry. The atom takes the `focusedGeometryAtom` atom as input and returns the event data as output. The `focusedGeometryAtom` is used to extract the meta property of the source object that contains the event data.

## Components

### AnalyticsContainer

This component is the main container for displaying the analytics data related to the selected disaster geometry. It uses the `analyticsResourceAtom` atom to retrieve the analytics data. It renders different states based on the state of the `analyticsResourceAtom` atom. If the analytics data is not available, it renders the `AnalyticsEmptyState` component. If the analytics data is being fetched, it renders the `LoadingSpinner` component. If there is an error while fetching the analytics data, it renders the `ErrorMessage` component. If the analytics data is available, it renders the `AnalyticsDataList` component.

### AnalyticsDataList

This component displays the analytics data related to the selected disaster geometry. It uses the `analyticsResourceAtom` atom to retrieve the analytics data. It renders a list of statistics related to the disaster, such as the number of affected people, the estimated cost of damages, and so on.

### AnalyticsEmptyState

This component displays a message when no analytics data is available for the selected disaster geometry. It has two possible states: initial and not-found. The initial state is the default state and displays a generic message. The not-found state is used when the analytics data is not found for the selected disaster geometry.

### PanelContent

This component is the main container for the analytics panel feature. It renders the `AnalyticsContainer` component inside a scrollable div.

### DownloadCSVControl

Provides a button that allows users to export the current analytics data as a CSV file.

## Constants

`MIN_HEIGHT` and `MAX_HEIGHT`

These constants define the minimum and maximum height of the analytics panel. They are used in the analyticsPanel function to set the minimum and maximum height of the panel.
