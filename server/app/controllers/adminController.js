const { Booking, Shelter, Image } = require("../models");
const assert = require("assert");
const { cloudinary } = require("../cloudinary");
const ExpressError = require("../utilities/ExpressError");

const adminController = {
  allBooking: async function (_, res) {
    try {
      const allBookings = await Booking.find().populate("shelter");

      if (allBookings) {
        res.status(200).json({ bookingsData: allBookings });
      } else throw new Error();
    } catch (err) {
      console.trace(err);
      next(err);
    }
  },
  acceptBooking: async function (req, res) {
    const bookingId = req.params.bookingId;

    try {
      assert.ok(bookingId, "bookingId doesn't not exists or is null.");

      const booking = await Booking.findOneAndUpdate(
        { _id: bookingId },
        {
          booked: true,
        }
      );

      if (booking) {
        res.sendStatus(200);
      } else throw new Error();
    } catch (err) {
      console.trace(err);
      next(err);
    }
  },
  refuseBooking: async function (req, res) {
    const bookingId = req.params.bookingId;

    try {
      assert.ok(bookingId, "bookingId doesn't not exists or is null.");

      const booking = await Booking.findOneAndDelete({
        _id: bookingId,
      });

      if (booking) {
        res.sendStatus(200);
      } else throw new Error();
    } catch (err) {
      console.trace(err);
      next(err);
    }
  },
  allImages: async function (req, res) {
    try {
      const images = await Image.find({}, { filename: 0 }).populate(
        "shelter",
        "number"
      );

      if (images) {
        res.status(200).json({ imagesData: images });
      } else throw new Error();
    } catch (err) {
      console.trace(err);
      next(err);
    }
  },
  addImage: async function (req, res) {
    const shelterNumber = parseInt(req.body.shelterNumber);
    const { path, filename } = req.file;

    try {
      assert.ok(!isNaN(shelterNumber), "shelterNumber must be a number.");
      assert.ok(path, "path doesn't not exists or is null.");
      assert.ok(filename, "filename doesn't not exists or is null.");

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

      const images = await Image.find(
        { shelter: shelter._id },
        { filename: 0 }
      ).populate("shelter", "number");
      if (images) {
        res.status(200).json({ imagesData: images });
      } else throw new Error();
    } catch (err) {
      console.trace(err);
      next(err);
    }
  },
  deleteImage: async function (req, res) {
    const imageId = req.params.imageId;

    try {
      assert.ok(imageId, "doesn't not exists or is null.");

      const image = await Image.findById(imageId, { filename: 1 }).populate(
        "shelter",
        "number"
      );

      if (!image) throw new Error();

      const shelterId = image.shelter.id;

      await cloudinary.uploader.destroy(image.filename);

      await image.deleteOne({ filename: image.filename });

      const images = await Image.find({ shelter: shelterId }).populate(
        "shelter",
        "number"
      );

      if (images) {
        res.status(200).json({ imagesData: images });
      } else throw new Error();
    } catch (err) {
      console.trace(err);
      next(err);
    }
  },
};

module.exports = adminController;
