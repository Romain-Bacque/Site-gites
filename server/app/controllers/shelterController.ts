import debugLib from "debug";
import { Request, Response } from "express";
import { Rates, Booking, Shelter } from "../models";
import ExpressError from "../utilities/ExpressError";
import puppeteer from "puppeteer";

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
      args: [
        "--no-sandbox", // Disables the Chrome sandbox security feature. This is often required in restricted environments (like some CI/CD pipelines or Docker containers) where the sandbox can't run properly. Note: Disabling the sandbox reduces security.
        "--disable-setuid-sandbox", // Disables the setuid sandbox, another security layer. Used when the process can't gain the necessary privileges to run the sandbox.
        "--single-process", // Runs Chrome in a single process. This can help with resource usage in constrained environments.
        "--no-zygote", // Disables the zygote process, which is responsible for spawning new Chrome processes. This can help with compatibility in some environments.
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
