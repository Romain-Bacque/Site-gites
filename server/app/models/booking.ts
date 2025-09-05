import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  name?: string | null;
  phone?: number | null;
  email?: string | null;
  numberOfPerson?: number | null;
  from: Date;
  to: Date;
  informations?: string | null;
  booked?: boolean;
  shelter_id: mongoose.Types.ObjectId;
}

const bookingSchema = new Schema<IBooking>({
  name: {
    type: String,
    default: null,
  },
  phone: {
    type: Number,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  numberOfPerson: {
    type: Number,
    min: 1,
    max: 4,
    default: null,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  informations: {
    type: String,
    default: null,
  },
  booked: {
    type: Boolean,
    default: false,
  },
  shelter_id: {
    type: Schema.Types.ObjectId,
    ref: "Shelter",
    required: true,
  },
});

export default mongoose.model<IBooking>("Booking", bookingSchema);
