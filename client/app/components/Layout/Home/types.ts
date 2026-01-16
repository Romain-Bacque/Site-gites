import { ShelterImage } from "@/app/lib/api";
import { HTTPStateKind } from "../../../global/types";

// interfaces
export interface AlertStatut {
  message: null | string;
  alert: null | HTTPStateKind;
  show: boolean;
}

export interface HomePageProps {
  shelters:
    | {
        _id: string;
        title: string;
        number: number;
        mainImage?: ShelterImage | undefined;
      }[]
    | [];
}
