// enum
export enum SortKind {
  DATE_DECREASING = 1,
  DATE_INCREASING,
  BOOKED,
  AWAITING,
}

// interfaces
export interface SortProps {
  onSortValidation: (arg: SortKind | null) => void;
}
