import { HTTPStateKind } from "../../../../global/types";

// interfaces
export interface UserData {
  email: string;
}
export interface StatutMessage {
  message: null | string;
  alert: null | HTTPStateKind;
  show: boolean;
}
