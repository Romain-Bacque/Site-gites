import debugLib from "debug";
import { Request, Response } from "express";
import { Rates, Booking, Shelter } from "../models";
import ExpressError from "../utilities/ExpressError";

const debug = debugLib("controller:shelter");

const shelterController = {
  getShelters: async function (_: Request, res: Response) {
    const shelters = await Shelter.find({});

    if (shelters) {
      res.status(200).json({ sheltersData: shelters });
    } else throw new ExpressError("Internal Server Error", 500);
  },

  postBooking: async function (req: Request, res: Response) {
    const { shelterId, ...payload } = req.body;

    const disabledDates = await Booking.find({
      $or: [{ from: payload.from }, { to: payload.to }],
    })
      .where("booked")
      .equals(true);

    if (disabledDates?.length > 0)
      throw new ExpressError("date(s) already booked !", 409);

    const booking = new Booking({
      ...payload,
      shelter_id: shelterId,
    });

    await booking.save();

    res.sendStatus(200);
  },

  getRates: async function (_: Request, res: Response) {
    const allRates = await Rates.find({});

    if (allRates[0]) {
      res.status(200).json({ ratesData: allRates[0] });
    } else throw new ExpressError("Internal Server Error", 500);
  },

  editRates: async function (req: Request, res: Response) {
    const { price1, price2, price3, shelterId } = req.body;

    try {
      const data = await Rates.findOneAndUpdate(
        { shelter_id: shelterId },
        { price1, price2, price3 },
        { upsert: true, new: true }
      );
      res.status(200).json({ ratesData: data });
    } catch {
      throw new ExpressError("Internal Server Error", 500);
    }
  },

  getDisabledDates: async function (req: Request, res: Response) {
    const { shelterId } = req.params;
    const disabledDates = await Booking.find({ shelter_id: shelterId })
      .where("booked")
      .equals(true);

    res.status(200).json({ disabledDates });
  },
};

export default shelterController;
