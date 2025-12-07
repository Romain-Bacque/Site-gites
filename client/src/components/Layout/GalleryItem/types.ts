export interface GalleryItemProps {
  id: string;
  mainImgId?: string;
  title: string;
  images: ImageData[];
  onSetUrlFile: (data: { id: string; file: string }) => void;
  onImageDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMainImageSet: (event: React.MouseEvent<HTMLButtonElement>) => void;
  setShowModal: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      crop: boolean;
      deleteAlert: boolean;
    }>
  >;
}
export interface ImageData {
  _id: string;
  url: string;
  title: string;
  filename: string;
  shelter_id: string;
}
