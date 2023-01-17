import { HTTPStateKind } from "../../../hooks/use-http";

// type aliases
export type ImagesData = {
  _id: string;
  url: string;
  filename: string;
  shelter_id: {
    number: number;
  };
}[];

// interfaces
export interface CropContentProps {
  shelterNumber: number;
  url: string;
  getImagesList: (arg: ImagesData) => void;
  onServerResponse: (arg: HTTPStateKind) => void;
}
