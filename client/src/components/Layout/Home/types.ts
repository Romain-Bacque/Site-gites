import { AlertKind } from "../../UI/Alert";

// interfaces
export interface StatutMessage {
  message: null | string;
  alert: null | AlertKind;
  show: boolean;
}
