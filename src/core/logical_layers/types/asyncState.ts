export interface AsyncState<T = unknown, E = Error> {
  data: T | null;
  isLoading: boolean;
  error: E | null;
}
