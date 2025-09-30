import { HTTPStateKind } from "../../../global/types";

// enums
export enum SortKind {
  DATE_DECREASING = 1,
  DATE_INCREASING,
  BOOKED,
  AWAITING,
}

// type aliases
export type handleEmailFormDisplay = (
  bookingChoice: "accept" | "refuse",
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
  booked: boolean;
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
  replyTo: string;
}
export interface BookingRef {
  value: BookingData | null;
  bookingChoice: "accept" | "refuse" | null;
}
