/**
 * Converts the parameter to a number.
 *
 * Number, null, and undefined will return themselves,
 * but everything else will be convert to a Number, or
 * die trying.
 *
 * @param {String} the String to convert
 * @return {Number} the Number version
 * @example
 * toNumber('7') //=> 7
 */
const toNumber = (value: any): number => {
  // if value is a Date, convert to a number
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === 'number' || value === null || value === undefined) {
    return value;
  }

  return Number(value);
};

/**
 * Given a min and max, determines if the value is included
 * in the range.
 *
 * @sig Number a -> a -> a -> b
 * @param {Number} the minimum number
 * @param {Number} the maximum number
 * @param {Number} the value to test
 * @return {Boolean} is the value in the range?
 * @example
 * isWithin(1, 5, 3) //=> true
 * isWithin(1, 5, 1) //=> true
 * isWithin(1, 5, 5) //=> true
 * isWithin(1, 5, 5.1) //=> false
 */
const isWithin = (min: number, max: number, value: number): boolean =>
  value >= min && value <= max;

/**
 * Are we dealing with a promise?
 */
const isPromise = (obj) =>
  !!obj &&
  (typeof obj === 'object' || typeof obj === 'function') &&
  typeof obj.then === 'function';

// the default headers given to axios
export const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

// the default configuration for axios, default headers will also be merged in
const DEFAULT_CONFIG = {
  timeout: 0,
};

export const NONE = null;
export const CLIENT_ERROR = 'CLIENT_ERROR';
export const SERVER_ERROR = 'SERVER_ERROR';
export const TIMEOUT_ERROR = 'TIMEOUT_ERROR';
export const CONNECTION_ERROR = 'CONNECTION_ERROR';
export const NETWORK_ERROR = 'NETWORK_ERROR';
export const UNKNOWN_ERROR = 'UNKNOWN_ERROR';
export const CANCEL_ERROR = 'CANCEL_ERROR';

export type PROBLEM_CODE =
  | typeof CLIENT_ERROR
  | typeof SERVER_ERROR
  | typeof TIMEOUT_ERROR
  | typeof CONNECTION_ERROR
  | typeof NETWORK_ERROR
  | typeof UNKNOWN_ERROR
  | typeof CANCEL_ERROR;

const BAD_REQUEST_ERROR_CODES = ['ERR_BAD_REQUEST'];
const TIMEOUT_ERROR_CODES = ['ECONNABORTED'];
const NODEJS_CONNECTION_ERROR_CODES = ['ENOTFOUND', 'ECONNREFUSED', 'ECONNRESET'];
const in200s = (n: number): boolean => isWithin(200, 299, n);
const in400s = (n: number): boolean => isWithin(400, 499, n);
const in500s = (n: number): boolean => isWithin(500, 599, n);

export type HEADERS = { [key: string]: string };

export interface ApiErrorResponse<T> {
  ok: false;
  problem: PROBLEM_CODE;
  originalError: object;

  data?: T;
  status?: number;
  headers?: HEADERS;
  config?: object;
  duration?: number;
}
export interface ApiOkResponse<T> {
  ok: true;
  problem: null;
  originalError: null;
  data: T | null;
  status?: number;
  headers?: HEADERS;
  config?: object;
  duration?: number;
}
export type ApiResponse<T, U = T> = ApiErrorResponse<U> | ApiOkResponse<T>;

type StatusCodes = undefined | number;

/**
 * Given a HTTP status code, return back the appropriate problem enum.
 */
export const getProblemFromStatus = (status: StatusCodes | null) => {
  if (!status) return UNKNOWN_ERROR;
  if (in200s(status)) return NONE;
  if (in400s(status)) return CLIENT_ERROR;
  if (in500s(status)) return SERVER_ERROR;
  return UNKNOWN_ERROR;
};
