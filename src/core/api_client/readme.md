## Auth flow

Authenticated request strategy:

- check token expiration:
  - expiring soon -> refresh token
  - expired -> reset auth, call expiredtoken hook
- do request, on 401 try refresh token once more
- on 401 reset auth, call unauthenticated hook

## Error handling

General approach: return result on success or throw ApiClientError
