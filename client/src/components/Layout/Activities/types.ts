import { HTTPStateKind } from "../../../global/types";

// type aliases
export type ActivitiesProps = {
  httpStatut: HTTPStateKind | null;
  showModal: boolean;
  onHide: () => void;
  activities: { title: string; address: string; link: string }[] | null;
};
