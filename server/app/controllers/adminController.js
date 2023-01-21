const debug = require("debug")("controller:admin");
const { Booking, Shelter, Image } = require("../models");
const assert = require("assert");
const { cloudinary } = require("../utilities/cloudinary");
const ExpressError = require("../utilities/ExpressError");

const adminController = {
  getAllBooking: async function (_, res) {
    const bookings = await Booking.find({
      to: { $gte: new Date() },
    })
      .populate("shelter_id")
      .where("email")
      .ne(null);

    res.status(200).json({ bookingsData: bookings });
  },
  acceptBooking: async function (req, res, next) {
    const { bookingId } = req.params;
    const booking = await Booking.findByIdAndUpdate(bookingId,
      { booked: true }
    );

    if (booking) {
      await adminController.getAllBooking(null, res);
    } else next();
  },
  deleteBooking: async function (req, res, next) {
    const { bookingId } = req.params;
    const booking = await Booking.findByIdAndDelete(bookingId);

    if (booking) {
      await adminController.getAllBooking(null, res);
    } else next();
  },
  addDisabledDate: async function (req, res, next) {
    const { shelterId, selectedDate } = req.body;
    const booking = new Booking({
      shelter_id: shelterId,
      from: selectedDate,
      to: selectedDate,
      booked: true,
    });

    await booking.save();

    const disabledDates = await Booking.find({ shelter_id: shelterId })
        .where("booked")
        .equals(true);

    if (disabledDates?.length) {
      res.status(200).json({
        disabledDates,
      });
    } else next();
  },
  deleteDisabledDate: async function (req, res, next) {
    const { shelterId, selectedDate } = req.body;
    const result = await Booking.deleteOne(
        { $or: [{ from: selectedDate }, { to: selectedDate }] }
      )
        .where("shelter_id").equals(shelterId)
        .where("email").equals(null);
        
    if(result?.deletedCount) {
      const disabledDates = await Booking.find({ shelter_id: shelterId })
      .where("booked")
          .equals(true);

      if (disabledDates?.length) {
        res.status(200).json({
          disabledDates,
        });
      } else next();
    } else next();
  },
  getAllImages: async function (_, res, next) {
    try {
      const images = await Image.find({}, { filename: 0 }).populate(
        "shelter_id",
        "number"
      );

      if (images) {
        res.status(200).json({ imagesData: images });
      } else throw new Error();
    } catch (err) {
      debug(err);
      next(err);
    }
  },
  addImage: async function (req, res, next) {
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

      if (!shelter) throw new ExpressError("Internal Server Error", 500);

      await Image.create({
        shelter_id: shelter._id,
        url: path,
        filename,
      });

      const images = await Image.find(
        { shelter_id: shelter._id },
        { filename: 0 }
      ).populate("shelter_id", "number");
      if (images) {
        res.status(200).json({ imagesData: images });
      } else throw new Error();
    } catch (err) {
      debug(err);
      next(err);
    }
  },
  deleteImage: async function (req, res, next) {
    const imageId = req.params.imageId;

    try {
      assert.ok(imageId, "doesn't not exists or is null.");

      const image = await Image.findById(imageId, { filename: 1 }).populate(
        "shelter_id",
        "number"
      );

      if (!image) throw new ExpressError("Internal Server Error", 500);

      const shelterId = image.shelter_id._id;

      await cloudinary.uploader.destroy(image.filename);

      await image.deleteOne({ filename: image.filename });

      const images = await Image.find({ shelter_id: shelterId }).populate(
        "shelter_id",
        "number"
      );

      if (images) {
        res.status(200).json({ imagesData: images });
      } else throw new ExpressError("Internal Server Error", 500);
    } catch (err) {
      debug(err);
      next(err);
    }
  },
};

module.exports = adminController;
