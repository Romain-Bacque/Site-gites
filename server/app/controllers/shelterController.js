const debug = require("debug")("controller:shelter");
const { Rates, Booking, Shelter } = require("../models");
const ExpressError = require("../utilities/ExpressError");

const shelterController = {
  getShelters: async function (_, res, next) {
    try {
      const shelters = await Shelter.find({});

      if (shelters && shelters.length) {
        res.status(200).json({ sheltersData: shelters });
      } else throw new ExpressError("Internal Server Error", 500);
    } catch (err) {
      debug(err);
      next(err);
    }
  },
  postBooking: async function (req, res, next) {
    const { shelterId, ...payload } = req.body;

    try {
      const booking = await new Booking({
        ...payload,
        shelter_id: shelterId,
      });
      
      await booking.save();

      res.sendStatus(200);
    } catch (err) {
      debug(err);
      next(err);
    }
  },
  getRates: async function (_, res, next) {
    try {
      const allRates = await Rates.find({});

      if (allRates[0]) {
        res.status(200).json({ ratesData: allRates[0] });
      } else throw new ExpressError("Internal Server Error", 500);
    } catch (err) {
      debug(err);
      next(err);
    }
  },
  editRates: async function (req, res, next) {
    const { price1, price2, price3, shelter } = req.body;

    try {
      const { _id: shelterId } = await Shelter.findOne(
        { number: shelter },
        { _id: 1 }
      );

      if (shelterId) {
        await Rates.findOneAndUpdate(
          { shelter_id: shelterId },
          { price1, price2, price3 },
          { upsert: true }
        )
          .then(({ data: allRates }) => {
            res.status(200).json({ ratesData: allRates });
          })
          .catch(() => {
            throw new ExpressError("Internal Server Error", 500);
          });
      } else throw new ExpressError("Internal Server Error", 500);
    } catch (err) {
      debug(err);
      next(err);
    }
  },
  getDisabledDates: async function (_, res, next) {
    try {
      const allDisabledDates = await Booking.find({})
        .where("booked")
        .equals(true);

      if (allDisabledDates) {
        res.status(200).json({
          disabledDates: allDisabledDates,
        });
      } else throw new ExpressError("Internal Server Error", 500);
    } catch (err) {
      debug(err);
      next(err);
    }
  },
};

module.exports = shelterController;
