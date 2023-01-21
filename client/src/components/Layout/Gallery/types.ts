import { HTTPStateKind } from "../../../global/types";

// interfaces
export interface AlertStatut {
  message: null | string;
  alert: null | HTTPStateKind;
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
