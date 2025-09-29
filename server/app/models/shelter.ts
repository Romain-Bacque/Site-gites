import mongoose, { Schema, Document } from "mongoose";

export interface IShelter extends Document {
  title: string;
  number: number;
  description: string;
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
  description: {
    type: String,
    required: [true, "description cannot be blank"],
  },
});

// Virtual populate for images associated with the shelter
shelterSchema.virtual("images", {
  ref: "Image",
  localField: "_id",
  foreignField: "shelter_id",
});
shelterSchema.set("toObject", { virtuals: true });
shelterSchema.set("toJSON", { virtuals: true });

export default mongoose.model<IShelter>("Shelter", shelterSchema);
