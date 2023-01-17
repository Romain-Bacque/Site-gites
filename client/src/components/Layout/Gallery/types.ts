import { AlertKind } from "../../UI/Alert";

// interfaces
export interface AlertStatut {
  message: null | string;
  alert: null | AlertKind;
  show: boolean;
}
export interface GalleryProps {
  imagesData: {
    _id: string;
    url: string;
    filename: string;
    shelter_id: {
      number: number;
    };
  }[];
  shelterNumber: number;
}

// type aliases
export type ImagesData = {
  _id: string;
  url: string;
  filename: string;
  shelter_id: {
    number: number;
  };
}[];
