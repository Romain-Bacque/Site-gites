const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shelterSchema = new Schema({
  url: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  shelter: {
    type: Schema.Types.ObjectId,
    ref: "Shelter",
  },
});

module.exports = mongoose.model("Image", shelterSchema);
