// type aliases
export type HandleCalendarDisplay = (input: string) => void;

// interfaces
export interface BookingProps {
  shelter: string;
}
export interface CalendarStatus {
  show: boolean;
  input: null | string;
}
