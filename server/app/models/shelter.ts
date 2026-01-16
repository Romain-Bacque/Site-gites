import mongoose, { Schema, Document } from "mongoose";

export interface IShelter extends Document {
  title: string;
  description: { text: string; lang: string }[];
  main_image_id?: mongoose.Types.ObjectId;
}

const shelterSchema = new Schema<IShelter>({
  title: {
    type: String,
    required: [true, "title cannot be blank"],
  },
  description: [
    {
      text: {
        type: String,
        required: true,
      },
      lang: {
        type: String,
        enum: ["en", "fr"],
        default: "fr",
        required: [true, "Language is required"],
      },
    },
  ],
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
shelterSchema.virtual("mainImage", {
  ref: "Image",
  localField: "main_image_id",
  foreignField: "_id",
  justOne: true,
});
shelterSchema.virtual("rates", {
  ref: "Rate",
  localField: "_id",
  foreignField: "shelter_id",
});
shelterSchema.set("toObject", { virtuals: true });
shelterSchema.set("toJSON", { virtuals: true });

export default mongoose.model<IShelter>("Shelter", shelterSchema);
