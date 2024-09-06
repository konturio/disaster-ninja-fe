import type { SearchLocationState } from '~features/search_locations/types';

export const initialState: SearchLocationState = {
  isLoading: false,
  locations: [],
  error: false,
  noResults: false,
};
