import { HTTPStateKind } from "../../../global/types";

// interfaces
export interface AlertStatut {
  message: null | string;
  alert: null | HTTPStateKind;
  show: boolean;
}
export interface RatesProps {
  shelterId: string;
}
export interface PriceValues {
  price1: number | null;
  price2: number | null;
  price3: number | null;
}
export interface RatesPutRequestData {
  shelterId: string;
  price1: number;
  price2: number;
  price3: number;
}

