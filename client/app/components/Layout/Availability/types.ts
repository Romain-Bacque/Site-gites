// type aliases
export type DisabledDatesData = {
  name: string;
  phone: string;
  email: string;
  numberOfPerson: number;
  from: Date;
  to: Date;
  informations: string;
  booked: boolean;
  shelter_id: string;
}[];
export type HandleDateClick = (
  date: Date,
  disabledDates: DisabledDatesData | null
) => void;

// interfaces
export interface AvailabilityProps {
  shelterId: string;
  className: string;
  onDateClick?: (arg: Date) => void
  onDateChoice?: (date: Date) => void;
}
export interface DateRequestData {
  shelterId: string;
  selectedDate: Date;
}
