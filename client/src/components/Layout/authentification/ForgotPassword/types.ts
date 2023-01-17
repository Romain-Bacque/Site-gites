import { AlertKind } from "../../../UI/Alert";

// interfaces
export interface UserData {
  email: string;
}
export interface StatutMessage {
  message: null | string;
  alert: null | AlertKind;
  show: boolean;
}
