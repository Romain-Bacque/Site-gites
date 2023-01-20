import { HTTPStateKind } from "../../../hooks/use-http";
import { AlertKind } from "../Alert";

// interfaces
export interface StatutMessage {
  message: string;
  alertKind: null | AlertKind;
  show: boolean;
}
export interface LoaderAndAlertProps {
  statut: HTTPStateKind | null;
  message?: {
    success: string | null;
    error: string | null;
  };
}
