appId cannot change and is not reactive, we getting it before starting app.
We can init everything that depends on appId.
appId available in appConfig.id

userId can change after login, but we need to do full reload to init properly with user config
