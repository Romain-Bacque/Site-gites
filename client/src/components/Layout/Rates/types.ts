import { AlertKind } from "../../UI/Alert";

// interfaces
export interface AlertStatut {
  message: null | string;
  alert: null | AlertKind;
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
