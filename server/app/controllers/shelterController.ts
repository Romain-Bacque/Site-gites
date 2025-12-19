import debugLib from "debug";
import { Request, Response } from "express";
import { Rate, Booking, Shelter } from "../models";
import ExpressError from "../utilities/ExpressError";
import puppeteer from "puppeteer-core";
import path from "path";
import { Types } from "mongoose";
import { resendEmailHandler } from "../utilities/emailhandler";

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

// Email sending helper
async function sendEmail({
  emailFrom,
  subject,
  templatePath,
  email,
  content,
}: {
  service: string;
  emailFrom: string;
  subject: string;
  templatePath: string;
  email: string;
  content: object;
}) {
  resendEmailHandler.init({
    emailFrom,
    subject,
    template: templatePath,
  });

  await resendEmailHandler.sendEmail({
    email,
    content,
  });
}

const shelterController = {
  getShelters: async function (_: Request, res: Response) {
    const shelters = await Shelter.find({}).populate<{
      images: {
        _id: string;
        url: string;
        filename: string;
        shelter_id: string;
      }[];
    }>(["mainImage", "rates"]);

    if (shelters) {
      res.status(200).json({ sheltersData: shelters });
    } else throw new ExpressError("Internal Server Error", 500);
  },

  updateShelterDescription: async function (req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { description } = req.body;

      if (!id || !description?.text || !description?.lang) {
        throw new ExpressError("Missing required fields", 400);
      }

      const shelter = await Shelter.findById(id);

      if (!shelter) {
        throw new ExpressError("Shelter not found", 404);
      }

      const existingDescIndex = shelter.description.findIndex(
        (desc: any) => desc.lang === description.lang
      );

      if (existingDescIndex !== -1) {
        shelter.description[existingDescIndex].text = description.text;
      } else {
        shelter.description.push({
          text: description.text,
          lang: description.lang,
        });
      }

      const updatedShelter = await shelter.save();

      res.status(200).json({ shelterData: updatedShelter });
    } catch (error) {
      console.error(error);
      throw new ExpressError("Internal Server Error", 500);
    }
  },

  setMainImage: async function (req: Request, res: Response) {
    try {
      const { id, imageId } = req.params;

      if (!id || !imageId) {
        throw new ExpressError("Missing required fields", 400);
      }

      const shelter = await Shelter.findById(id);

      if (!shelter) {
        throw new ExpressError("Shelter not found", 404);
      }
      shelter.main_image_id = new Types.ObjectId(imageId);
      await shelter.save();

      const shelters = await Shelter.find({}).populate<{
        images: {
          _id: string;
          url: string;
          filename: string;
          shelter_id: string;
        }[];
      }>("images");

      if (shelters) {
        res.status(200).json({ sheltersData: shelters });
      } else throw new Error();
    } catch (error) {
      console.error(error);
      throw new ExpressError("Internal Server Error", 500);
    }
  },

  getActivities: async (_: Request, res: Response): Promise<void> => {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath:
        process.env.NODE_ENV === "production"
          ? chromePath
          : puppeteer.executablePath(),
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
      .where("status")
      .equals("accepted");

    if (disabledDates?.length > 0)
      throw new ExpressError("date(s) already booked !", 409);

    const booking = new Booking({
      ...payload,
      shelter_id: shelterId,
    });

    await booking.save();

    const shelter = await Shelter.findById(shelterId);

    const formattedFrom = new Date(payload.from).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTo = new Date(payload.to).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    await sendEmail({
      service: "gmail",
      emailFrom: (process.env.RESEND_EMAIL_FROM as string) || "",
      subject: "Nouvelle demande de réservation",
      templatePath: path.join(
        __dirname,
        "../utilities/emailTemplate/bookingRequest.ejs"
      ),
      email: process.env.RESEND_ADMIN_EMAIL as string,
      content: {
        ...payload,
        shelter: shelter?.title || "N/A",
        from: formattedFrom,
        to: formattedTo,
      },
    });

    res.sendStatus(200);
  },

  getRatesByShelterId: async function (req: Request, res: Response) {
    const { shelterId } = req.params;
    const rates = await Rate.find({ shelter_id: shelterId });

    if (rates[0]) {
      res.status(200).json({ ratesData: rates[0] });
    } else throw new ExpressError("Internal Server Error", 500);
  },

  editRates: async function (req: Request, res: Response) {
    const { shelterId } = req.params;
    const { price1, price2, price3 } = req.body;

    try {
      const data = await Rate.findOneAndUpdate(
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
      .where("status")
      .equals("accepted");

    res.status(200).json({ disabledDates });
  },
};

export default shelterController;
