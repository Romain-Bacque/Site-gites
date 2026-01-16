import { HTTPStateKind } from "../../../global/types";

// interfaces
export interface ShelterType {
  _id: string;
  title: string;
  images: ImageData[];
}

export interface ImageData {
  _id: string;
  url: string;
  title: string;
  filename: string;
  shelter_id: string;
}
export interface AlertStatut {
  message: null | string;
  alert: null | HTTPStateKind;
  show: boolean;
}
export interface GalleryProps {
  data: ShelterType | null;
}
