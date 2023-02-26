import { HTTPStateKind } from "../../../global/types";

// interfaces
export interface StatutMessage {
  message: string;
  alertKind: null | HTTPStateKind;
  show: boolean;
}
export interface LoaderAndAlertProps {
  statut: HTTPStateKind | null;
  message?: {
    success: string | null;
    error: string | null;
  };
}
