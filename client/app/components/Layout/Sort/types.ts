// enum
export enum SortKind {
  DATE_DECREASING = 1,
  DATE_INCREASING,
  STATUS,
  AWAITING,
}

// interfaces
export interface SortProps {
  onSortValidation: (arg: SortKind | null) => void;
}
