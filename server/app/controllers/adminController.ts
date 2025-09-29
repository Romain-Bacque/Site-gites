import debugLib from "debug";
import { Request, Response, NextFunction } from "express";
import { Booking, Shelter, Image } from "../models";
import assert from "assert";
import { cloudinary } from "../utilities/cloudinary";
import ExpressError from "../utilities/ExpressError";

const debug = debugLib("controller:admin");

const adminController = {
  getAllBooking: async function (_: Request, res: Response) {
    const bookings = await Booking.find({
      to: { $gte: new Date() },
    })
      .populate("shelter_id")
      .where("email")
      .ne(null);

    res.status(200).json({ bookingsData: bookings });
  },

  acceptBooking: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { bookingId } = req.params;
    const booking = await Booking.findByIdAndUpdate(bookingId, {
      booked: true,
    });

    if (booking) {
      await adminController.getAllBooking(req, res);
    } else next();
  },

  deleteBooking: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { bookingId } = req.params;
    const booking = await Booking.findByIdAndDelete(bookingId);

    if (booking) {
      await adminController.getAllBooking(req, res);
    } else next();
  },

  addDisabledDate: async function (req: Request, res: Response) {
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

    res.status(200).json({ disabledDates });
  },

  deleteDisabledDate: async function (req: Request, res: Response) {
    const { shelterId, selectedDate } = req.body;
    const result = await Booking.deleteOne({
      $or: [{ from: selectedDate }, { to: selectedDate }],
    })
      .where("shelter_id")
      .equals(shelterId)
      .where("email")
      .equals(null);

    if (result?.deletedCount > 0) {
      const disabledDates = await Booking.find({ shelter_id: shelterId })
        .where("booked")
        .equals(true);

      res.status(200).json({ disabledDates });
    }
  },

  getSheltersWithImages: async function (
    _: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const shelters = await Shelter.find({}).populate<{
        images: {
          _id: string;
          url: string;
          filename: string;
          shelter_id: string;
        }[];
      }>("images");

      if (shelters) {
        res.status(200).json({ sheltersData: shelters });
      } else throw new ExpressError("Internal Server Error", 500);
    } catch (err) {
      debug(err);
      next(err);
    }
  },

  addImage: async function (req: Request, res: Response, next: NextFunction) {
    const { shelterId } = req.body;
    const { path, filename } = req.file as { path: string; filename: string };

    assert.ok(path, "path doesn't not exists or is null.");
    assert.ok(filename, "filename doesn't not exists or is null.");

    const shelter = await Shelter.findById(shelterId);

    if (!shelter) return next();

    await Image.create({
      shelter_id: shelter._id,
      url: path,
      filename,
    });

    const shelters = await Shelter.find({}).populate<{
      images: {
        _id: string;
        url: string;
        filename: string;
        shelter_id: string;
      }[];
    }>("images");

    if (shelters) {
      res.status(200).json({ sheltersData: shelters });
    } else throw new Error();
  },

  deleteImage: async function (req: Request, res: Response) {
    const imageId = req.params.imageId;

    assert.ok(imageId, "doesn't not exists or is null.");

    const image = await Image.findById(imageId, { filename: 1 }).populate(
      "shelter_id",
      "title"
    );

    if (!image) throw new ExpressError("Internal Server Error", 500);

    // @ts-ignore
    const shelterId = image.shelter_id._id;

    await cloudinary.uploader.destroy(image.filename as string);

    await image.deleteOne({ filename: image.filename });

    const shelters = await Shelter.find({}).populate<{
      images: {
        _id: string;
        url: string;
        filename: string;
        shelter_id: string;
      }[];
    }>("images");

    if (shelters) {
      res.status(200).json({ sheltersData: shelters });
    } else throw new ExpressError("Internal Server Error", 500);
  },
};

export default adminController;
