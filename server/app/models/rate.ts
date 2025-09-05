import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRates extends Document {
  price1: number;
  price2: number;
  price3: number;
  shelter_id?: Types.ObjectId;
}

const ratesSchema = new Schema<IRates>({
  price1: {
    type: Number,
    required: [true, "price1 cannot be blank"],
    min: 1,
    max: 9999,
  },
  price2: {
    type: Number,
    required: [true, "price2 cannot be blank"],
    min: 1,
    max: 9999,
  },
  price3: {
    type: Number,
    required: [true, "price3 cannot be blank"],
    min: 1,
    max: 9999,
  },
  shelter_id: {
    type: Schema.Types.ObjectId,
    ref: "Shelter",
  },
});

export default mongoose.model<IRates>("Rates", ratesSchema);
