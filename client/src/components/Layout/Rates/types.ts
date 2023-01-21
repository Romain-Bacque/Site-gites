import { HTTPStateKind } from "../../../global/types";

// interfaces
export interface AlertStatut {
  message: null | string;
  alert: null | HTTPStateKind;
  show: boolean;
}
export interface RatesProps {
  shelter: string;
}
export interface PriceValues {
  price1: number;
  price2: number;
  price3: number;
}
