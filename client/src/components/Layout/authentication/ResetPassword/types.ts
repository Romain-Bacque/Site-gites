import { HTTPStateKind } from "../../../../global/types";

// type aliases
export type UserData = Record<"id" | "token" | "password", string>;

// interfaces
export interface StatutMessage {
  message: null | string;
  alert: null | HTTPStateKind;
  show: boolean;
}
