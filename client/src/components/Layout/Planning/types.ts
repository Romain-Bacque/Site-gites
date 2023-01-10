// type aliases
export type DisabledDatesData = {
  name: string;
  phone: number;
  email: string;
  numberOfPerson: number;
  from: Date;
  to: Date;
  informations: string;
  booked: boolean;
  shelter_id: string;
}[];

// interfaces
export interface PlanningProps {
  className: string;
  onDateChoice?: (date: Date) => void;
  onDateClick?: (date: Date, disabledDates: DisabledDatesData | null) => void;
  isDoubleView?: boolean;
}
