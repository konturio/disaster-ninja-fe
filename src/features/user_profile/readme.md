## User profile

This feature provides `LoginForm` and `SettingsForm` components for User Profile page (`profile` route)

### Feature flag

No direct flag, but it depends on `profile` route, controlled by flag
'app_login' (AppFeature.APP_LOGIN)

### How to use

Import `LoginForm`, `SettingsForm` from feature root

### How it works

`LoginForm` renders login UI allowing user to authenticate, calling authClientInstance with entered credentials

`SettingsForm` renders form for editing user profile. Changes got synced with `/users/current_user` endpoint and `currentUserAtom`
