export interface KeycloakAuthResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  scope: string;
  session_state: string;
  token_type: 'Bearer';
  error_description?: string;
}

export type JWTData = {
  acr: string;
  aud: string;
  azp: string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  name: string;
  preferred_username: string;
  realm_access: { roles: string[] };
  resource_access: { account: { roles: string[] } };
  scope: string;
  session_state: string;
  sub: string;
  typ: string;
};

// GeoJSON.GeoJSON conflict with  Record<string, unknown>
// https://stackoverflow.com/questions/60697214/how-to-fix-index-signature-is-missing-in-type-error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestParams = Record<string, any>;
