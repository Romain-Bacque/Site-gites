import debugLib from "debug";
import { Request, Response } from "express";
import { Rates, Booking, Shelter } from "../models";
import ExpressError from "../utilities/ExpressError";
import puppeteer from "puppeteer-core";
import path from "path";

const chromePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  path.resolve(
    "/opt/render/project/src/server/.cache/puppeteer/chrome/linux-138.0.7204.157/chrome-linux64/chrome"
  ); // path.resolve is a method used to get the absolute path of a file or directory, it's the same as using __dirname + '/path/to/file'

const debug = debugLib("controller:shelter");

interface Activity {
  title: string;
  address: string;
  link: string;
}

const shelterController = {
  getShelters: async function (_: Request, res: Response) {
    const shelters = await Shelter.find({});

    if (shelters) {
      res.status(200).json({ sheltersData: shelters });
    } else throw new ExpressError("Internal Server Error", 500);
  },

  getActivities: async (_: Request, res: Response): Promise<void> => {
    const browser = await puppeteer.launch({
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
    const baseUrl =
      "https://www.tourisme-couserans-pyrenees.com/carnet-dadresses/quoi-faire-sur-place/activites-sportives-et-de-loisirs/activites-sportives-et-loisirs";
    let pageNumber = 2;
    let hasNextPage = true;

    const getActivitiesList = async (): Promise<Activity[] | null> => {
      return await page.evaluate(() => {
        const list: Activity[] = [];
        const activities = document.querySelectorAll(".wpetOffer");

        if (activities.length === 0) return null;

        for (const activity of activities) {
          list.push({
            title:
              (
                activity.querySelector(
                  ".wpetOfferContainerContent > h3 > a"
                ) as HTMLElement
              )?.innerText ?? "",
            address:
              (
                activity.querySelector(
                  ".wpetOfferContainerContent > div > span"
                ) as HTMLElement
              )?.innerText ?? "",
            link:
              (
                activity.querySelector(
                  ".wpetOfferContainerContent > h3 > a"
                ) as HTMLAnchorElement
              )?.href ?? "",
          });
        }
        return list;
      });
    };

    const list: Activity[] = [];

    while (hasNextPage) {
      await page.goto(`${baseUrl}/page/${String(pageNumber)}/`);

      const activitiesOnPage = await getActivitiesList();

      if (!activitiesOnPage || activitiesOnPage.length === 0) {
        hasNextPage = false;
      } else {
        list.push(...activitiesOnPage);

        pageNumber++;
      }
    }

    await browser.close();

    res.status(200).json({ data: list });
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

  getRatesByShelterId: async function (req: Request, res: Response) {
    const { shelterId } = req.params;
    const rates = await Rates.find({ shelter_id: shelterId });

    if (rates[0]) {
      res.status(200).json({ ratesData: rates[0] });
    } else throw new ExpressError("Internal Server Error", 500);
  },

  editRates: async function (req: Request, res: Response) {
    const { shelterId } = req.params;
    const { price1, price2, price3 } = req.body;

    try {
      const data = await Rates.findOneAndUpdate(
        { shelter_id: shelterId },
        { shelterId, price1, price2, price3 },
        { upsert: true, new: true } // "upsert" means to create the document if it doesn't exist yet and "new" to return the updated document
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
