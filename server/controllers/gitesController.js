const { Rates, Booking, Shelter } = require("../models");

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

      res.json({ status: 200 });
    } catch (err) {
      console.log(err.message);
      res.json({ status: 404, message: err.message });
    }
  },
  getRates: async function (_, res) {
    try {
      const allRates = await Rates.find({});

      if (allRates[0]) {
        res.json({ status: 200, ratesData: allRates[0] });
      } else throw new Error();
    } catch (err) {
      res.json({ status: 404, message: err.message });
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
          if (err) {
            throw err;
          }
        }
      );

      res.json({ status: 200, ratesData: allRates });
    } catch (err) {
      res.json({ status: 404, message: err.message });
    }
  },
  getDisabledDates: async function (req, res) {
    try {
      const allDisabledDates = await Booking.find({})
        .where("booked")
        .equals("true");

      if (allDisabledDates) {
        res.json({
          status: 200,
          disabledDatesData: allDisabledDates,
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      res.json({ status: 404, message: err.message });
    }
  },
};

module.exports = gitesController;
