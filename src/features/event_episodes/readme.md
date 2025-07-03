# Event Episodes

## Introduction:

This feature allows the user to view the episodes of a disaster on a timeline, select a specific episode or cluster of episodes, and view data related to the selected episode.

## Components

### EpisodesTimelinePanel

A panel containing the timeline of episodes. The user can open and close the panel. If the app is running on a mobile device, the panel opens in a modal window.

### EpisodesTimeline

A component that displays the timeline of episodes. It receives a list of episodes as `episodes` prop and displays them on the timeline. The user can select a specific episode or cluster of episodes to view it on the map. The component also supports data-driven styles for episodes and clusters of episodes.

## Atoms

### episodesResource

An atom that stores a list of episodes associated with the selected disaster. The atom loads data from the server and provides an interface for getting this data. `episodesResource` depends on `currentEventAtom` through the `episodesResourceDependencyAtom`.

`currentEventAtom` stores the ID of the current (selected) event.

When the `episodesResourceDependencyAtom` changes, the `episodesResource` atom is invalidated and the data is reloaded from the server.

### episodesTimeline

An atom that stores timeline settings, such as stacking and clustering. The atom provides an interface for changing these settings and for controlling the imperative timeline API.

### episodeToFocusedGeometry

The `episodeToFocusedGeometry` atom is used to convert selected episode into a focused geometry.
When a user selects a new episode, the `currentEpisodeAtom` is updated with the selected episode. Then `currentEpisodeAtom` retrieves the geometry for the selected episode.
Then it merges the episode geometry feature collection to single geometry, using the `mergeFeatureCollection` function, and then sets the focused geometry using the `setFocusedGeometry` function from the `focusedGeometryAtom`. Finally, the function returns the `currentEpisodeData` object.

### autoClearCurrentEpisode

`autoClearCurrentEpisode` clears the currently selected episode when a new disaster is selected. This helps to prevent confusion when the user switches between different disasters.

**Behavior**
The `autoClearCurrentEpisode` function subscribes to the `episodesResource` atom. When the `episodesResource` changes, the function checks if the current episode is associated with the selected disaster. If it is not, the function updates the `currentEpisodeAtom` with a null value, effectively clearing the current episode selection.

### autoCloseEpisodesPanel

`autoCloseEpisodesPanel` closes the EpisodesTimelinePanel when the selected event has only one or no episodes.

**Behavior**
The atom listens to `episodesResource`. Once the resource is loaded and the panel is open, if the number of episodes is less than two the atom dispatches the `close` action of `episodesPanelState`.

## Controller

### eventEpisodesController

A controller that provides methods for managing the selected episode, EpisodesTimelinePanel, and timeline. The controller links methods are provided by various atoms and are collected into a single interface.
