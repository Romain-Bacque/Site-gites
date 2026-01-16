// enums
export type HTTPStateKind =
  | "idle"
  | "loading"
  | "success"
  | "error"
  | "pending";
export enum Status {
  SEND = "send",
  SUCCESS = "success",
  ERROR = "error",
}
export enum AlertKind {
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

export type ExtendedMuiProps<T> = T & {
  component?: React.ElementType | JSX.Element;
};
