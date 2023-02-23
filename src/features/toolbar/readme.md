## Toolbar

This feature combines registered controls of other features and puts them in predefined order as buttons inside panel component

### How to use

Just import <Toolbar /> component from root directory

### How it works

It simply maps over `toolbarControlsAtom`. Controls ([see SideControl type](https://github.com/konturio/disaster-ninja-fe/blob/main/src/core/shared_state/toolbarControls.ts)) of this atom describe buttons appearance and the logic on click, on becoming active/inactive and belonging to mutually exclusive controls
