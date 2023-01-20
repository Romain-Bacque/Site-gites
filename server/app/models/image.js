const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
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

module.exports = mongoose.model("Image", imageSchema);
