## Toasts

This feature allow to show toast notification.
A toast notification is a non-modal, unobtrusive element to display a short message and it appears on the screen when an event occurs.
It is used to provide feedback or show a message.

Toast notifications appear as a small popup on the screen.

### How to use

You need activate this feature by adding `<NotificationToast />` in app.

```tsx
const { NotificationToast } = lazily(() => import('~features/toasts'));

function App() {
  return (
    <Suspense fallback={null}>
      {featureFlags[FeatureFlag.TOASTS] && <NotificationToast />}
    </Suspense>
  );
}
```

When you want to show notification:

- from another atom - you must create action for 'currentNotificationAtom':

```ts
({ schedule }) => {
  schedule((dispatch) => {
    dispatch(
      currentNotificationAtom.showNotification(
        'info', // Type of notification
        { title: i18n.t('some_text_translation_key') },
        5, // Secs before auto-hide
      ),
    );
  });
};
```

- From other places

```ts
import { notificationServiceInstance } from '~core/notificationServiceInstance';

notificationServiceInstance.info({ title: i18n.t('some_text_translation_key') }, 5);
```

### How it works

`toastsStackAtom` looks at `currentNotificationAtom` from core, and accumulate incoming notifications for show them in stack
(in case app wants to show more than one toast in short time);
