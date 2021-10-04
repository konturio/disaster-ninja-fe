export enum ApiClientErrorCodes {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
}

type HttpErrorMessage = {
  [key in ApiClientErrorCodes]: string;
};

export const defaultMessage =
  'Something went wrong and request was not completed';

export const messages: HttpErrorMessage = {
  [ApiClientErrorCodes.BadRequest]: 'Bad Request',
  [ApiClientErrorCodes.Unauthorized]: 'Please login to access this resource',
  [ApiClientErrorCodes.Forbidden]: 'Forbidden',
  [ApiClientErrorCodes.NotFound]:
    'The requested resource does not exist or has been deleted',
  [ApiClientErrorCodes.MethodNotAllowed]: 'Method not allowed',
};
