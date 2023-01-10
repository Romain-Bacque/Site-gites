import { HTTPStateKind, StatutType } from "../../../hooks/use-http";

// interfaces
export interface LoaderProps {
  statut: StatutType;
  onRequestEnd?: (statut: HTTPStateKind) => void;
  message?: {
    success: null | string;
    error: null | string;
  };
}
