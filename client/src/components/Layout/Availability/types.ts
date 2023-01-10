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
export interface AvailabilityProps {
  shelter: string;
}
