// interfaces
export type SheltersProps = {
  sheltersData:
    | {
        _id: string;
        title: string;
        images: {
          _id: string;
          url: string;
          title: string;
          filename: string;
          shelter_id: string;
        }[];
      }[]
    | null;
};
