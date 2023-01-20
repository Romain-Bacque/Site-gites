import { AlertKind } from "../../UI/Alert";

// interfaces
export interface AlertStatut {
  message: null | string;
  alert: null | AlertKind;
  show: boolean;
}
