## Reset north

This feature adds a button to the toolbar that resets the map orientation.
The icon rotates together with the map bearing.

### How to use

Call `initResetNorth` once after the toolbar is mounted.

```ts
import('~features/reset_north').then(({ initResetNorth }) => initResetNorth());
```
