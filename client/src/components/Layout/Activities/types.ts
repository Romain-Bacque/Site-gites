// type aliases
export type ActivitiesProps = {
  httpStatut: "pending" | "success" | "error" | "idle";
  showModal: boolean;
  onHide: () => void;
  activities: { title: string; address: string; link: string }[] | null;
};
