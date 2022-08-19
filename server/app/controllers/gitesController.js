const { Rates, Booking, Shelter } = require("../models");
const ExpressError = require("../utilities/ExpressError");

const gitesController = {
  postBooking: async function (req, res) {
    const { shelter: number } = req.body;
    const { shelter, ...newPayload } = req.body;

    try {
      const shelter = await Shelter.findOne({ number });
      const newBooking = await new Booking({
        ...newPayload,
        shelter: shelter._id,
      });
      await newBooking.save();

      res.sendStatus(200);
    } catch (err) {
      console.trace(err);
      next(err);
    }
  },
  getRates: async function (_, res) {
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
  editRates: async function (req, res) {
    const { price1, price2, price3 } = req.body;

    try {
      const allRates = await Rates.findOneAndUpdate(
        { username: "famille-bacque" },
        { username: "famille-bacque", price1, price2, price3 },
        { upsert: true },
        (err) => {
          if (err) throw new ExpressError("Internal Server Error", 500);
        }
      );

      res.status(200).json({ ratesData: allRates });
    } catch (err) {
      console.trace(err);
      next(err);
    }
  },
  getDisabledDates: async function (req, res) {
    try {
      const allDisabledDates = await Booking.find({})
        .where("booked")
        .equals(true);

      if (allDisabledDates) {
        res.status(200).json({
          disabledDatesData: allDisabledDates,
        });
      } else throw new ExpressError("Internal Server Error", 500);
    } catch (err) {
      console.trace(err);
      next(err);
    }
  },
};

module.exports = gitesController;
