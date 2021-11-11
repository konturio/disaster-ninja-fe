export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
}

// GeoJSON.GeoJSON conflict with  Record<string, unknown>
// https://stackoverflow.com/questions/60697214/how-to-fix-index-signature-is-missing-in-type-error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestParams = Record<string, any>;
