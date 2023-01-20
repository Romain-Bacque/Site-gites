import { HTTPStateKind, StatutType } from "../../../hooks/use-http";
import { AlertKind } from "../../UI/Alert";

// interfaces
export interface StatutMessage {
  message: string;
  alertKind: null | AlertKind;
  show: boolean;
}
export interface LoaderAndAlertProps {
  statut: StatutType;
  message?: {
    success: string | null;
    error: string | null;
  };
}
