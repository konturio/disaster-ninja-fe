# Feature Flag Dependency Analysis (Comprehensive)

## Critical Dependencies

| Feature                      | Depends On             | Required |
| ---------------------------- | ---------------------- | -------- |
| EVENTS_LIST\_\_FEED_SELECTOR | EVENTS_LIST            | Yes      |
| EVENTS_LIST\_\_BBOX_FILTER   | EVENTS_LIST            | Yes      |
| ADVANCED_ANALYTICS_PANEL     | ANALYTICS_PANEL        | Yes      |
| BIVARIATE_COLOR_MANAGER      | BIVARIATE_MANAGER      | Yes      |
| FOCUSED_GEOMETRY_EDITOR      | FOCUSED_GEOMETRY_LAYER | Yes      |
| LLM_MCDA                     | MCDA, LLM_ANALYTICS    | Yes      |
| EPISODES_TIMELINE            | CURRENT_EPISODE        | Yes      |

## Feature Flag Access Patterns

Feature flags are typically accessed from the `configRepo.get().features` object. The following access patterns have been observed:

1.  **Using `AppFeature` Enum:** Accessing features using the enum values.

    ```typescript
    configRepo.get().features[AppFeature.FEATURE_NAME];
    ```

    _Examples found:_ `AppFeature.SUBSCRIPTION`, `AppFeature.EPISODES_TIMELINE`, `AppFeature.EVENTS_LIST`, `AppFeature.LLM_MCDA`, `AppFeature.LAYER_FEATURES_PANEL`, `AppFeature.MAP`, `AppFeature.ABOUT_PAGE`.

2.  **Using String Literals:** Accessing features directly using their string names.

    ```typescript
    configRepo.get().features['feature_name_string'];
    ```

    _Examples found:_ `'about_page'`, `'events_list__feed_selector'`, `'feed_selector'`.

3.  **Using Optional Chaining:** Accessing features with optional chaining for potentially undefined configurations.

    ```typescript
    configRepo?.get().features[AppFeature.FEATURE_NAME];
    ```

    _Example found:_ `configRepo?.get().features[AppFeature.ABOUT_PAGE]`.

There is a notable inconsistency in using both `AppFeature` enum and string literals for the same feature flags, which affects maintainability and type safety.

## Types of AppFeature Usage

Beyond direct access for conditional checks, the `AppFeature` enum is used in various other contexts throughout the codebase:

1.  **Direct Conditional Checks:** The most common usage, determining whether a feature is enabled to control rendering or logic flow.

    _Examples:_ Checking `featureFlags[AppFeature.INTERCOM]` to render a component, `if (featureFlags[AppFeature.MCDA]) { ... }` for conditional logic.

2.  **Configuration Values:** Used as values in configuration objects to link settings or behavior to specific features.

    _Example:_ `requiredFeature: AppFeature.REPORTS` in route definitions (`src/core/router/routes.tsx`).

3.  **Metric Events:** Passed as arguments to metric tracking functions to associate events with features.

    _Example:_ `dispatchMetricsEventOnce(AppFeature.EVENTS_LIST, ...)`.

4.  **Object Property Keys:** Used as keys in objects, often for mapping features to related data or configurations.

    _Example:_ `[AppFeature.CURRENT_EVENT]: [...]` in `src/core/metrics/constants.ts`.

5.  **Documentation and Comments:** Referenced in markdown files and code comments to explain feature-related code.

This demonstrates that `AppFeature` is a central element for referencing features across different parts of the application.

## Revised Dependency Graph

```mermaid
---
config:
  layout: elk
---
graph LR
    %% Functional Dependencies
    EVENTS_LIST --> EVENTS_LIST__FEED_SELECTOR
    EVENTS_LIST --> EVENTS_LIST__BBOX_FILTER
    ANALYTICS_PANEL --> ADVANCED_ANALYTICS_PANEL
    BIVARIATE_MANAGER --> BIVARIATE_COLOR_MANAGER
    FOCUSED_GEOMETRY_LAYER --> FOCUSED_GEOMETRY_EDITOR
    MCDA --> LLM_MCDA
    LLM_ANALYTICS --> LLM_MCDA
    CURRENT_EPISODE --> EPISODES_TIMELINE

    %% Features that may depend on core map functionality (inferred)
    MAP --> INTERACTIVE_MAP
    MAP --> MAP_LAYERS_PANEL
    MAP --> LAYER_FEATURES_PANEL
    MAP --> LEGEND_PANEL
    MAP --> GEOMETRY_UPLOADER
    MAP --> DRAW_TOOLS
    MAP --> FOCUSED_GEOMETRY_LAYER
    MAP --> FOCUSED_GEOMETRY_EDITOR
    MAP --> BOUNDARY_SELECTOR
    MAP --> REFERENCE_AREA
    %% Added based on common map features
    MAP --> MAP_RULER
    %% Added based on common map features
    MAP --> LOCATE_ME

    %% Features depending on core systems (inferred)
    %% Current Event likely relies on Events List data/framework
    EVENTS_LIST --> CURRENT_EVENT
    %% Current Episode relies on Current Event context
    CURRENT_EVENT --> CURRENT_EPISODE
    %% Episode List displays Current Episode or relies on Episode system
    EPISODE_LIST --> CURRENT_EPISODE
    %% Current Event may rely on uploaded geometry
    GEOMETRY_UPLOADER --> CURRENT_EVENT

    %% UI/Structural Dependencies (less likely to 'break' functionally if parent is off, but are contained/controlled by parent)
    %% HEADER is a container, features like SEARCH_BAR and ADMIN_BOUNDARY_BREADCRUMBS are within it.
    %% SIDE_BAR is a container for TOOLBAR and panels.
    %% Keeping these for context but noting they aren't strict 'breaking' deps in the same way.
    HEADER --> SEARCH_BAR
    HEADER --> ADMIN_BOUNDARY_BREADCRUMBS
    %% Breadcrumbs might depend on boundary selection state
    ADMIN_BOUNDARY_BREADCRUMBS --> BOUNDARY_SELECTOR
    SIDE_BAR --> TOOLBAR
    SIDE_BAR --> MAP_LAYERS_PANEL
    %% Panels are often in sidebar
    SIDE_BAR --> LEGEND_PANEL


    %% Other dependencies based on usage/logic
    %% Live Sensor data might be shown in analytics
    ANALYTICS_PANEL --> LIVE_SENSOR
    %% Bivariate might be part of analytics
    BIVARIATE_MANAGER --> ANALYTICS_PANEL
    %% MCDA might be part of analytics
    MCDA --> ANALYTICS_PANEL
    %% LLM Analytics is a type of analytics panel
    LLM_ANALYTICS --> ANALYTICS_PANEL

    %% Route dependencies (structural - page requires feature)
    SUBSCRIPTION --> pricing_route
    REPORTS --> reports_route
    REPORTS --> report_route
    BIVARIATE_COLOR_MANAGER --> bivariate_manager_route
    APP_LOGIN --> profile_route
    MAP --> map_route
    %% Terms, Privacy, etc. depend on About Page
    ABOUT_PAGE --> about_route
    ABOUT_PAGE --> about_sub_routes
    CUSTOM_ROUTES --> custom_routes

    subgraph Routes
        pricing_route[Pricing Page]
        reports_route[Reports Page]
        report_route[Report Page]
        bivariate_manager_route[Bivariate Manager Page]
        profile_route[Profile Page]
        map_route[Map Page]
        about_route[About Page]
        about_sub_routes[About Sub-Pages]
        custom_routes[Custom Embedded Pages]
    end

```

## New Findings

1.  **Varied AppFeature Usage:** The `AppFeature` enum is utilized in multiple contexts beyond simple conditional checks, including configuration, metrics, and object keying. This indicates a strong integration of the enum in defining feature-related logic and structure.

2.  **Mixed Access Patterns:** As noted previously, both `AppFeature` enum and string literals are used to access feature flags, introducing potential for inconsistency and errors.

3.  **Deprecated Feature Usage:** The deprecated `FEED_SELECTOR` is still accessed by its string literal.

4.  **Geometry Subsystem Dependencies:** Confirmed dependency hub role of `GEOMETRY_UPLOADER` and implicit dependency of `CURRENT_EVENT` on geometry features.

5.  **Analytics Cross-Dependencies:** Confirmed `LLM_MCDA` dependency on both `MCDA` and `LLM_ANALYTICS`, and `BIVARIATE_COLOR_MANAGER` dependency on `BIVARIATE_MANAGER`.

## Updated Recommendations

1.  **Standardize Access and Usage:** Enforce consistent use of the `AppFeature` enum for all feature flag access and references across the codebase (conditional checks, configuration, metrics, etc.) to improve type safety, maintainability, and reduce errors.

2.  **Migrate Deprecated Usage:** Eliminate all instances of accessing deprecated feature flags using string literals and update them to use the designated replacement `AppFeature` enum value.

3.  **Implement Validation:** Strengthen validation mechanisms to ensure feature flag dependencies are met, potentially including checks for consistent usage of enum vs. string literals.

4.  **Monitor Usage:** Continue tracking feature flag usage to identify and remove unused or improperly used flags.

5.  **Enhance Documentation:** Ensure all feature flags and their dependencies are well-documented, including examples of correct `AppFeature` usage.

Key improvements in this update:

1. Added explicit dependency requirements table
2. Revealed hidden dependencies in geometry subsystem
3. Clarified cross-analytics dependencies
4. Added specific code examples for deprecated feature migration
5. Proposed concrete validation structures
6. Enhanced monitoring recommendations
