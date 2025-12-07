import debugLib from "debug";
import { Request, Response, NextFunction } from "express";
import { Booking, Shelter, Image } from "../models";
import assert from "assert";
import { cloudinary } from "../utilities/cloudinary";
import ExpressError from "../utilities/ExpressError";
import path from "path";
import { resendEmailHandler } from "../utilities/emailhandler";

const debug = debugLib("controller:admin");
type ImagesFieldsType = [
  "_id",
  "url",
  "filename",
  "main_image_id",
  "shelter_id"
];

interface Template {
  bookingId?: string | undefined;
  shelter?: string | undefined;
  name?: string | undefined;
  from?: string | undefined;
  to?: string | undefined;
  emailTo?: string | undefined;
  statutMessage: string;
}
interface bookingDecisionRequestData {
  decision: "accepted" | "refused";
  emailTemplate: Template;
  message: string;
}

// Email sending helper
async function sendEmail({
  emailFrom,
  subject,
  templatePath,
  email,
  content,
}: {
  service: string;
  emailFrom: string;
  subject: string;
  templatePath: string;
  email: string;
  content: object;
}) {
  resendEmailHandler.init({
    emailFrom,
    subject,
    template: templatePath,
  });

  await resendEmailHandler.sendEmail({
    email,
    content,
  });
}

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

  updateBooking: async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { bookingId } = req.params;
    const { data }: { data: bookingDecisionRequestData } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: data.decision },
      { new: true }
    )
      .populate("shelter_id")
      .where("email")
      .ne(null);

    await sendEmail({
      service: "gmail",
      emailFrom: (process.env.RESEND_EMAIL_FROM as string) || "",
      subject: "Email de confirmation",
      templatePath: path.join(
        __dirname,
        "../utilities/emailTemplate/bookingEmail.ejs"
      ),
      email: data.emailTemplate.emailTo!,
      content: { ...data.emailTemplate, message: data.message },
    });
    if (booking) {
      res.status(200).json({ bookingData: booking });
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
      res.status(200).json({ bookingData: booking });
    } else next();
  },

  addDisabledDate: async function (req: Request, res: Response) {
    const { shelterId, selectedDate } = req.body;
    const booking = new Booking({
      shelter_id: shelterId,
      from: selectedDate,
      to: selectedDate,
      status: "accepted",
    });

    await booking.save();

    const disabledDates = await Booking.find({ shelter_id: shelterId })
      .where("status")
      .equals("accepted");

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
        .where("status")
        .equals("accepted");

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
      images: ImagesFieldsType;
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

    await cloudinary.uploader.destroy(image.filename as string);

    await image.deleteOne({ filename: image.filename });

    const shelters = await Shelter.find({}).populate<{
      images: ImagesFieldsType[];
    }>("images");

    if (shelters) {
      res.status(200).json({ sheltersData: shelters });
    } else throw new ExpressError("Internal Server Error", 500);
  },
};

export default adminController;
