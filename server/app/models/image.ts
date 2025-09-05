import mongoose, { Schema, Document, Types } from "mongoose";

export interface IImage extends Document {
  url?: string | null;
  filename?: string | null;
  shelter_id?: Types.ObjectId;
}

const imageSchema = new Schema<IImage>({
  url: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  shelter_id: {
    type: Schema.Types.ObjectId,
    ref: "Shelter",
  },
});

export default mongoose.model<IImage>("Image", imageSchema);
