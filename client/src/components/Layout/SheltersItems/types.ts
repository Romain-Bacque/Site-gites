// enums
export enum TabKind {
  BOOK = 1,
  RATES,
  AVAILABILITY
}
// interfaces
export interface SheltersItemsProps {
  shelterId: string;
  title: string;
  number: number;
}
export interface Tab {
  tab: null | TabKind;
}
