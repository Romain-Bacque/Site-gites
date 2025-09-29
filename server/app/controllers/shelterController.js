"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const models_1 = require("../models");
const ExpressError_1 = __importDefault(require("../utilities/ExpressError"));
const debug = (0, debug_1.default)("controller:shelter");
const shelterController = {
    getShelters: async function (_, res) {
        const shelters = await models_1.Shelter.find({});
        if (shelters) {
            res.status(200).json({ sheltersData: shelters });
        }
        else
            throw new ExpressError_1.default("Internal Server Error", 500);
    },
    postBooking: async function (req, res) {
        const { shelterId, ...payload } = req.body;
        const disabledDates = await models_1.Booking.find({
            $or: [{ from: payload.from }, { to: payload.to }],
        })
            .where("booked")
            .equals(true);
        if (disabledDates?.length > 0)
            throw new ExpressError_1.default("date(s) already booked !", 409);
        const booking = new models_1.Booking({
            ...payload,
            shelter_id: shelterId,
        });
        await booking.save();
        res.sendStatus(200);
    },
    getRatesByShelterId: async function (req, res) {
        const { shelterId } = req.params;
        const rates = await models_1.Rates.find({ shelter_id: shelterId });
        if (rates[0]) {
            res.status(200).json({ ratesData: rates[0] });
        }
        else
            throw new ExpressError_1.default("Internal Server Error", 500);
    },
    editRates: async function (req, res) {
        const { shelterId } = req.params;
        const { price1, price2, price3 } = req.body;
        try {
            const data = await models_1.Rates.findOneAndUpdate({ shelter_id: shelterId }, { shelterId, price1, price2, price3 }, { upsert: true, new: true } // "upsert" means to create the document if it doesn't exist yet and "new" to return the updated document
            );
            res.status(200).json({ ratesData: data });
        }
        catch {
            throw new ExpressError_1.default("Internal Server Error", 500);
        }
    },
    getDisabledDates: async function (req, res) {
        const { shelterId } = req.params;
        const disabledDates = await models_1.Booking.find({ shelter_id: shelterId })
            .where("booked")
            .equals(true);
        res.status(200).json({ disabledDates });
    },
};
exports.default = shelterController;
