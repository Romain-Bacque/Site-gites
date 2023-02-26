import { HTTPStateKind } from "../../../global/types";

// type aliases
export type ImagesData = {
  _id: string;
  url: string;
  filename: string;
  shelter_id: string;
}[];

// interfaces
export interface AlertStatut {
  message: null | string;
  alert: null | HTTPStateKind;
  show: boolean;
}
export interface GalleryProps {
  imagesData: ImagesData;
  shelterTitle: string;
  shelterId: string;
}
