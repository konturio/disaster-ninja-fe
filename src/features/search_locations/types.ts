export interface SelectableItem {
  title: string;
  value: string | number;
}

export interface SearchLocationState {
  isLoading: boolean;
  locations: SelectableItem[];
  error: boolean;
  noResults: boolean;
}
