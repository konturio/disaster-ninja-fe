export const isErrorWithMessage = (
  e: unknown,
): e is {
  message: string;
  [key: string]: any;
} => {
  return e !== null && typeof e === 'object' && 'message' in e;
};
