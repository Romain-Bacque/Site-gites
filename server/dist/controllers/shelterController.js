"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const models_1 = require("../models");
const ExpressError_1 = __importDefault(require("../utilities/ExpressError"));
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const path_1 = __importDefault(require("path"));
const chromePath = process.env.PUPPETEER_EXECUTABLE_PATH ||
    path_1.default.resolve("/opt/render/project/src/server/.cache/puppeteer/chrome/linux-138.0.7204.157/chrome-linux64/chrome"); // path.resolve is a method used to get the absolute path of a file or directory, it's the same as using __dirname + '/path/to/file'
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
    getActivities: async (_, res) => {
        const browser = await puppeteer_core_1.default.launch({
            headless: true,
            executablePath: chromePath,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--single-process",
                "--no-zygote",
            ],
        });
        const page = await browser.newPage();
        const baseUrl = "https://www.tourisme-couserans-pyrenees.com/carnet-dadresses/quoi-faire-sur-place/activites-sportives-et-de-loisirs/activites-sportives-et-loisirs";
        let pageNumber = 2;
        let hasNextPage = true;
        const getActivitiesList = async () => {
            return await page.evaluate(() => {
                const list = [];
                const activities = document.querySelectorAll(".wpetOffer");
                if (activities.length === 0)
                    return null;
                for (const activity of activities) {
                    list.push({
                        title: activity.querySelector(".wpetOfferContainerContent > h3 > a")?.innerText ?? "",
                        address: activity.querySelector(".wpetOfferContainerContent > div > span")?.innerText ?? "",
                        link: activity.querySelector(".wpetOfferContainerContent > h3 > a")?.href ?? "",
                    });
                }
                return list;
            });
        };
        const list = [];
        while (hasNextPage) {
            await page.goto(`${baseUrl}/page/${String(pageNumber)}/`);
            const activitiesOnPage = await getActivitiesList();
            if (!activitiesOnPage || activitiesOnPage.length === 0) {
                hasNextPage = false;
            }
            else {
                list.push(...activitiesOnPage);
                pageNumber++;
            }
        }
        await browser.close();
        res.status(200).json({ data: list });
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
