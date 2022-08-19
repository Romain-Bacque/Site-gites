const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shelterSchema = new Schema({
  title: {
    type: String,
    required: [true, "title cannot be blank"],
  },
  number: {
    type: Number,
    required: [true, "number cannot be blank"],
  },
});

module.exports = mongoose.model("Shelter", shelterSchema);
