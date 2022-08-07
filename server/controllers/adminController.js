const { Booking, Shelter, Image } = require("../models");
const assert = require("assert");

const adminController = {
  allBooking: async function (_, res) {
    try {
      const allBookings = await Booking.find().populate("shelter");

      if (allBookings) {
        res.status(200).json({ data: allBookings });
      } else throw new Error();
    } catch (err) {
      console.trace(err);
      res.status(404).json({ message: err.message });
    }
  },
  acceptBooking: async function (req, res) {
    const bookingId = parseInt(req.params.bookingId);

    try {
      assert.ok(!isNaN(shelterId), "bookingId must be a number.");

      const booking = await Booking.findOneAndUpdate(
        { _id: bookingId },
        {
          booked: true,
        }
      );

      if (booking) {
        res.status(200).json({ data: bookingsData });
      } else throw new Error();
    } catch (err) {
      console.trace(err);
      res.status(404).json({ message: err.message });
    }
  },
  refuseBooking: async function (req, res) {
    const bookingId = parseInt(req.params.bookingId);

    try {
      assert.ok(!isNaN(shelterId), "bookingId must be a number.");

      const booking = await Booking.findOneAndDelete({ _id: bookingId });

      if (booking) {
        res.status(200).json({ bookingsData: booking });
      } else throw new Error();
    } catch (err) {
      console.trace(err);
      res.status(404).json({ message: err.message });
    }
  },
  allImages: async function (req, res) {
    try {
      const shelter = await Shelter.findOne(
        { number: shelterNumber },
        { _id: 1 }
      );

      if (!shelter) throw new Error();

      const image = await Image.create({
        shelter: shelter._id,
        url: path,
        filename,
      });

      const images = await Image.find({ shelter: shelter._id });
      if (images) {
        res.status(200).json({ imagesData: images });
      } else throw new Error();
    } catch (err) {
      console.trace(err);
      res.status(404).json({ message: err.message });
    }
  },
  addImage: async function (req, res) {
    const shelterNumber = parseInt(req.body.shelterNumber);
    const { path, filename } = req.file;

    try {
      assert.ok(!isNaN(shelterNumber), "shelterNumber must be a number.");
      assert.ok(path, "path doesn't not exists or is null.");
      assert.ok(filename, "path doesn't not exists or is null.");

      const shelter = await Shelter.findOne(
        { number: shelterNumber },
        { _id: 1 }
      );

      if (!shelter) throw new Error();

      await Image.create({
        shelter: shelter._id,
        url: path,
        filename,
      });

      const images = await Image.find({ shelter: shelter._id });
      if (images) {
        res.status(200).json({ imagesData: images });
      } else throw new Error();
    } catch (err) {
      console.trace(err);
      res.status(404).json({ message: err.message });
    }
  },
};

module.exports = adminController;
