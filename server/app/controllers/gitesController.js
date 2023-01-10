const { Rates, Booking, Shelter } = require("../models");
const ExpressError = require("../utilities/ExpressError");

const gitesController = {
  getShelters: async function (_, res, next) {
    try {
      const shelters = await Shelter.find({});

      if (shelters && shelters.length) {
        res.status(200).json({ sheltersData: shelters });
      } else throw new ExpressError("Internal Server Error", 500);
    } catch (err) {
      console.trace(err);
      next(err);
    }
  },
  postBooking: async function (req, res, next) {
    const { shelter: number } = req.body;
    const { shelter, ...newPayload } = req.body;

    try {
      const shelter = await Shelter.findOne({ number });
      const newBooking = await new Booking({
        ...newPayload,
        shelter_id: shelter._id,
      });
      await newBooking.save();

      res.sendStatus(200);
    } catch (err) {
      console.trace(err);
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
      console.trace(err);
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
      console.trace(err);
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
      console.trace(err);
      next(err);
    }
  },
};

module.exports = gitesController;
