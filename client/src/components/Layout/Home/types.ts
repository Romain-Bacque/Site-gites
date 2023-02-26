import { HTTPStateKind } from "../../../global/types";

// interfaces
export interface AlertStatut {
  message: null | string;
  alert: null | HTTPStateKind;
  show: boolean;
}
