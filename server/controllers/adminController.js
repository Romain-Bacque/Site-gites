const { Booking } = require("../models");

const adminController = {
  allBooking: async function (_, res) {
    try {
      const allBookings = await Booking.find().populate("shelter");

      if (allBookings) {
        res.json({ ok: true, status: 200, bookingsData: allBookings });
      } else throw new Error();
    } catch (err) {
      res.json({ ok: false, status: 404, message: err.message });
    }
  },
  acceptBooking: async function (req, res) {
    const { bookingId } = req.params;

    try {
      const booking = await Booking.findOneAndUpdate(
        { _id: bookingId },
        {
          booked: true,
        }
      );

      if (booking) {
        res.json({ ok: true, status: 200, bookingData: booking });
      } else throw new Error();
    } catch (err) {
      res.json({ ok: false, status: 404, message: err.message });
    }
  },
  refuseBooking: async function (req, res) {
    const { bookingId } = req.params;

    try {
      const booking = await Booking.findOneAndDelete({ _id: bookingId });

      if (booking) {
        res.json({ ok: true, status: 200, bookingData: booking });
      } else throw new Error();
    } catch (err) {
      res.json({ ok: false, status: 404, message: err.message });
    }
  },
};

module.exports = adminController;
