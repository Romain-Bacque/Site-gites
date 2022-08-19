const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  name: {
    type: String,
  },
  phone: {
    type: Number,
  },
  email: {
    type: String,
  },
  numberOfPerson: {
    type: Number,
    min: "1",
    max: "4",
  },
  from: {
    type: Date,
  },
  to: {
    type: Date,
  },
  informations: {
    type: String,
  },
  booked: {
    type: Boolean,
    default: false,
  },
  shelter: {
    type: Schema.Types.ObjectId,
    ref: "Shelter",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
