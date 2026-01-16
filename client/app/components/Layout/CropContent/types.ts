// type aliases
export type ImagesData = {
  _id: string;
  url: string;
  filename: string;
  shelter_id: string;
}[];

// interfaces
export interface CropContentProps {
  shelterId: string;
  url: string;
  onImagePost: (arg: FormData) => void;
}
