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
If it is allowed - we set intercom related cookie, settings, and execute intercom snippet that integrate chat in application

Call `shutdownIntercom` when a user logs out. It clears Intercom settings and
manually removes the session cookie in case `Intercom('shutdown')` fails to do
so.
