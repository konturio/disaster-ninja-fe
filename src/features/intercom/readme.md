## Intercom

This feature allow us communicate with users by integrated in application chat

### How to use

```ts
import('~features/intercom').then(({ initIntercom }) => {
  initIntercom();
});
```

### How it works

`initIntercom` function check permission for use cookies that intercom require.
If it allowed - we set intercom related cookie, settings, and execute intercom sniped that integrate chat in application
