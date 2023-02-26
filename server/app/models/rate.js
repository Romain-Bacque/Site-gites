const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ratesSchema = new Schema({
  price1: {
    type: Number,
    required: [true, "price1 cannot be blank"],
    min: "1",
    max: "9999",
  },
  price2: {
    type: Number,
    required: [true, "price2 cannot be blank"],
    min: "1",
    max: "9999",
  },
  price3: {
    type: Number,
    required: [true, "price3 cannot be blank"],
    min: "1",
    max: "9999",
  },
  shelter_id: {
    type: Schema.Types.ObjectId,
    ref: "Shelter",
  },
});

module.exports = mongoose.model("Rates", ratesSchema);
