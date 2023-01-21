const debug = require("debug")("controller:shelter");
const { Rates, Booking, Shelter } = require("../models");
const ExpressError = require("../utilities/ExpressError");

const shelterController = {
  getShelters: async function (_, res) {
      const shelters = await Shelter.find({});

      if (shelters && shelters.length) {
        res.status(200).json({ sheltersData: shelters });
      } else throw new ExpressError("Internal Server Error", 500);
  },
  postBooking: async function (req, res) {
    const { shelterId, ...payload } = req.body;

    const disabledDates = await Booking.find({ $or: [{ from: payload.from }, { to: payload.to }] })
        .where("booked")
        .equals(true);

    if(disabledDates?.length > 0) throw new ExpressError('date(s) already booked !', 409)

    const booking = await new Booking({
      ...payload,
      shelter_id: shelterId,
    });

    await booking.save();

    res.sendStatus(200);
  },
  getRates: async function (_, res, next) {
      const allRates = await Rates.find({});

      if (allRates[0]) {
        res.status(200).json({ ratesData: allRates[0] });
      } else throw new ExpressError("Internal Server Error", 500);
  },
  editRates: async function (req, res) {
    const { price1, price2, price3, shelterId } = req.body;

      await Rates.findOneAndUpdate(
        { shelter_id: shelterId },
        { price1, price2, price3 },
        { upsert: true }
      )
        .then(({ data }) => {
          res.status(200).json({ ratesData: data });
        })
        .catch(() => {
          throw new ExpressError("Internal Server Error", 500);
        });
  },
  getDisabledDates: async function (req, res) {
    const { shelterId } = req.params;
    const disabledDates = await Booking.find({ shelter_id: shelterId })
        .where("booked")
        .equals(true);

    res.status(200).json({ disabledDates });
  },
};

module.exports = shelterController;
