// enums
export enum TabKind {
  BOOK = 1,
  RATES,
  AVAILABILITY,
}
// interfaces
export interface SheltersItemsProps {
  shelterId: string;
  title: string;
  initialDescriptionText: string;
  images:
    | {
        _id: string;
        url: string;
        title: string;
        filename: string;
        shelter_id: string;
      }[]
    | null;
}
export interface Tab {
  tab: null | TabKind;
}
