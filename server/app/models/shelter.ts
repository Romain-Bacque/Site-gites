import mongoose, { Schema, Document } from "mongoose";

export interface IShelter extends Document {
  title: string;
  description: string;
  main_image_id?: mongoose.Types.ObjectId;
}

const shelterSchema = new Schema<IShelter>({
  title: {
    type: String,
    required: [true, "title cannot be blank"],
  },
  description: {
    type: String,
    required: false,
  },
  main_image_id: {
    type: Schema.Types.ObjectId,
    ref: "Image",
    required: false,
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
