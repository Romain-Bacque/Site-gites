import mongoose, { Schema, Document } from "mongoose";

export interface IShelter extends Document {
  title: string;
  number: number;
}

const shelterSchema = new Schema<IShelter>({
  title: {
    type: String,
    required: [true, "title cannot be blank"],
  },
  number: {
    type: Number,
    required: [true, "number cannot be blank"],
  },
});

export default mongoose.model<IShelter>("Shelter", shelterSchema);
