"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const models_1 = require("../models");
const assert_1 = __importDefault(require("assert"));
const cloudinary_1 = require("../utilities/cloudinary");
const ExpressError_1 = __importDefault(require("../utilities/ExpressError"));
const debug = (0, debug_1.default)("controller:admin");
const adminController = {
    getAllBooking: async function (_, res) {
        const bookings = await models_1.Booking.find({
            to: { $gte: new Date() },
        })
            .populate("shelter_id")
            .where("email")
            .ne(null);
        res.status(200).json({ bookingsData: bookings });
    },
    acceptBooking: async function (req, res, next) {
        const { bookingId } = req.params;
        const booking = await models_1.Booking.findByIdAndUpdate(bookingId, {
            booked: true,
        });
        if (booking) {
            await adminController.getAllBooking(req, res);
        }
        else
            next();
    },
    deleteBooking: async function (req, res, next) {
        const { bookingId } = req.params;
        const booking = await models_1.Booking.findByIdAndDelete(bookingId);
        if (booking) {
            await adminController.getAllBooking(req, res);
        }
        else
            next();
    },
    addDisabledDate: async function (req, res) {
        const { shelterId, selectedDate } = req.body;
        const booking = new models_1.Booking({
            shelter_id: shelterId,
            from: selectedDate,
            to: selectedDate,
            booked: true,
        });
        await booking.save();
        const disabledDates = await models_1.Booking.find({ shelter_id: shelterId })
            .where("booked")
            .equals(true);
        res.status(200).json({ disabledDates });
    },
    deleteDisabledDate: async function (req, res) {
        const { shelterId, selectedDate } = req.body;
        const result = await models_1.Booking.deleteOne({
            $or: [{ from: selectedDate }, { to: selectedDate }],
        })
            .where("shelter_id")
            .equals(shelterId)
            .where("email")
            .equals(null);
        if (result?.deletedCount > 0) {
            const disabledDates = await models_1.Booking.find({ shelter_id: shelterId })
                .where("booked")
                .equals(true);
            res.status(200).json({ disabledDates });
        }
    },
    getSheltersWithImages: async function (_, res, next) {
        try {
            const shelters = await models_1.Shelter.find({}).populate("images");
            if (shelters) {
                res.status(200).json({ sheltersData: shelters });
            }
            else
                throw new ExpressError_1.default("Internal Server Error", 500);
        }
        catch (err) {
            debug(err);
            next(err);
        }
    },
    addImage: async function (req, res, next) {
        const { shelterId } = req.body;
        const { path, filename } = req.file;
        assert_1.default.ok(path, "path doesn't not exists or is null.");
        assert_1.default.ok(filename, "filename doesn't not exists or is null.");
        const shelter = await models_1.Shelter.findById(shelterId);
        if (!shelter)
            return next();
        await models_1.Image.create({
            shelter_id: shelter._id,
            url: path,
            filename,
        });
        const shelters = await models_1.Shelter.find({}).populate("images");
        if (shelters) {
            res.status(200).json({ sheltersData: shelters });
        }
        else
            throw new Error();
    },
    deleteImage: async function (req, res) {
        const imageId = req.params.imageId;
        assert_1.default.ok(imageId, "doesn't not exists or is null.");
        const image = await models_1.Image.findById(imageId, { filename: 1 }).populate("shelter_id", "title");
        if (!image)
            throw new ExpressError_1.default("Internal Server Error", 500);
        // @ts-ignore
        const shelterId = image.shelter_id._id;
        await cloudinary_1.cloudinary.uploader.destroy(image.filename);
        await image.deleteOne({ filename: image.filename });
        const shelters = await models_1.Shelter.find({}).populate("images");
        if (shelters) {
            res.status(200).json({ sheltersData: shelters });
        }
        else
            throw new ExpressError_1.default("Internal Server Error", 500);
    },
};
exports.default = adminController;
