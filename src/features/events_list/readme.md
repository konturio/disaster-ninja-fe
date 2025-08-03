# Events list

The `events_list` feature is responsible for displaying a list of disasters in the disaster-ninja application. It allows to select one of them to see it details, and see the event geometry of the event on the map.

> The feature uses the `react-virtuoso` library for rendering the event list efficiently. The library only renders the events that are currently visible on the screen, making the list faster to render and more efficient to manage.

# Components

## EventList

The `EventList` component is a feature that implements a list of disasters in the Disaster Ninja application. It consists of several sub-components that work together to display a list of events and allow users to interact with them.

## Sub-Components

### EventCard

The `EventCard` component is responsible for displaying a single event in the list. It includes information such as the event title, location, and date, including a description and associated external links. Users can click on an event to view more details or select it as the current event.
It can also contains a show timeline button, if the episodes timeline feature is enabled.

When magnitude or cyclone category information is available, a colored shield is rendered to the left of the severity indicator showing values like `M 8.6` or `Cat 2`.

### CurrentEvent

The `CurrentEvent` component displays details for the currently selected unlisted event. Unlisted event it is an event that is not in the list of events, nut it comes from the URL.

### FeedSelector

The `FeedSelector` component allows users to filter the event list by feed. It displays a list of available feeds and allows the user to select one or more to filter the event list. When the component mounts, it selects the default feed from the user profile settings. Will be displayed if feedSelector feature is enabled. When a different feed is chosen, the currently selected event is cleared and nothing is auto-selected from the new feed.

### BBoxFilter

The `BBoxFilter` component allows users to filter the event list by current map view. It displays a button that, when clicked, switches the filter on or off.

### EpisodeTimelineToggle

The `EpisodeTimelineToggle` component is a button that toggles the visibility of the episode timeline for the currently selected event.

### EventListSettingsRow

The `EventListSettingsRow` component is a container for the `FeedSelector` and `BBoxFilter` components. It is used to group these components together in the user interface.

### FullState

The `FullState` component is the main component that displays the event list. It includes sub-components such as `CurrentEvent`, `FeedSelector`, and `BBoxFilter`. It also includes a `Virtuoso` component to efficiently render large lists of events.

### ShortState

The `ShortState` component is an abbreviated version of the event list that is displayed when there is no event selected. It includes a call-to-action button that prompts the user to select an event.

### Analytics

The `Analytics` component displays statistics for an event, such as the affected population and the settled area. It is displayed on the `EventCard` component.

## Props

### EventList

- `onCurrentChange`: A function that is called when the currently selected event changes. The new event ID is passed as an argument.
- `initialEventId`: The ID of the event to select when the component first loads.

### FullState

- `currentEventId`: The ID of the currently selected event.
- `onCurrentChange`: A function that is called when the currently selected event changes.

### ShortState

- `hasTimeline`: A boolean value indicating whether the episode timeline feature is enabled.
- `openFullState`: A function that is called when the user clicks the call-to-action button.
- `currentEventId`: The ID of the currently selected event.

# Atoms

## `autoSelectEvent`

The `autoSelectEvent` atom is responsible for automatically selecting an event when the `events_list` feature is loaded.

The `autoSelectEvent` atom automatically selects an event from the `eventListResource` atom based on certain conditions. If `scheduledAutoSelect` has been set to `true`, and if the `eventListResource` atom exists, is not `loading` or in `error`, and contains at least one event, then the current event is checked to see if it is in the list of events. If it is, the function returns the current state. If it is not, the function schedules an auto-focus on the first event in the list, and sets the current event to the first event in the list. If there is no current event, a notification is shown.

`scheduledAutoSelect` can be toggled by various parts of the application (for example URL handling or feed synchronization). The `FeedSelector` component no longer triggers this flag on feed change, so switching feeds simply clears the current event without auto-selecting another.

The `autoSelectEvent` atom is useful in situations where the user lands on the events list page and there is no pre-selected event. It ensures that the first event in the list is selected automatically, allowing the user to see event details without manually selecting one.

## `currentEventBbox`

The `currentEventBbox` atom in the `events_list` feature is responsible for storing the current bounding box of the event. It is used to fit the map to the event when the user selects it.

The `currentEventBbox` atom is a derived atom that is computed from the `currentEventResourceAtom`. When the `currentEventResourceAtom` changes, the `currentEventBbox` atom is recalculated using the `bbox` property of the event.

## `sortedEventList`

The `sortedEventList` atom works as proxy for `eventListResource`. If sort config is present in `eventSortingConfigAtom`, it returns sorted events. If sort config is not provided, `sortedEventList` returns the original list unchanged.

## `eventSortingConfigAtom`

Holds config for front-end side sorting of events list.

## `eventListFilters`

The `eventListFilters` atom holds an object representing the current set of filters applied to the events list. The object has the following shape:

```typescript
{
  bbox: [number, number, number, number] | null;
}
```

- `bbox`: represents the bounding box filter applied to the events list. If it's present, only events that occurred within the bounding box will be displayed.

It has the following actions:

- `setBBoxFilterFromCurrentMapView`
- `resetBboxFilter`

# Feature config

`initialSort` is an optional field which can hold front-end side sorting configuration.

There are two types of sorting currently supported:

- `singleProperty`:

```typescript
{
  "initialSort": {
    "order": "desc",
    "config": { "type": "singleProperty", "propertyName": "updatedAt" }
  }
}
```

- `mcda`:

```typescript
{
  "initialSort": {
    "order": "desc",
    "config": {
      "type": "mcda",
      "mcdaConfig": {
        "criteria": [
          {
            "name": "eventType",
            "weight": 2
          },
          {
            "name": "severity",
            "weight": 3
          },
          {
            "name": "updatedAt",
            "weight": 4
          },
          {
            "name": "startedAt",
            "weight": 1
          },
          {
            "name": "affectedPopulation",
            "weight": 3
          }
        ]
      }
    }
  }
}
```

`settledArea` and `affectedPopulationDensity` criteria are also available.

It's possible to invert a score of a particular MCDA criterion using `invertScore` parameters. E.g.:

```typescript
{
  ...
  "criteria": [
    {
      "name": "startedAt",
      "weight": 1,
      "invertScore": true
    }
  ]
}
```
