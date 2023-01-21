// enums
export enum HTTPStateKind {
    PENDING = 1,
    SUCCESS,
    ERROR,
  }

// type aliases
export type HandleLoading = (
    statut: HTTPStateKind,
    successMessage: string | null,
    errorMessage: string | null) => void;
