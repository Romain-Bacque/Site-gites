import { AlertKind } from "../../../UI/Alert";

// type aliases
export type UserData = Record<"id" | "token" | "password", string>;

// interfaces
export interface StatutMessage {
  message: null | string;
  alert: null | AlertKind;
  show: boolean;
}
