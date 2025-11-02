import { HTTPStateKind } from "../../../global/types";

// enums
export enum SortKind {
  DATE_DECREASING = 1,
  DATE_INCREASING,
  STATUS,
  AWAITING,
}

// type aliases
export type HandleEmailModalDisplay = (
  decision: "accepted" | "refused",
  data: BookingData
) => void;
export type BookingsList = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  numberOfPerson: number;
  from: Date;
  to: Date;
  informations: string;
  status: "pending" | "accepted" | "refused";
  shelter_id: {
    title: string;
    number: number;
  };
}[];

// interfaces
export interface AlertStatut {
  message: string;
  alert: null | HTTPStateKind;
  show: boolean;
}
export interface ModalState {
  show: boolean;
  booking: boolean;
  isSorted: boolean;
}
export interface BookingData {
  bookingId: string;
  shelter: string;
  name: string;
  from: string;
  to: string;
  emailTo: string;
}
export interface BookingRef {
  emailTemplate: BookingData | null;
  decision: "accepted" | "refused" | null;
}
