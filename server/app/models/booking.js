const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  name: {
    type: String,
    default: null,
  },
  phone: {
    type: Number,
    default: null,
  },
  email: {
    type: String,
    default: null,
  },
  numberOfPerson: {
    type: Number,
    min: "0",
    max: "4",
    default: null,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  informations: {
    type: String,
    default: null,
  },
  booked: {
    type: Boolean,
    default: false,
  },
  shelter_id: {
    type: Schema.Types.ObjectId,
    ref: "Shelter",
    required: true,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
