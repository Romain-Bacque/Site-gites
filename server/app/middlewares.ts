import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import puppeteer from "puppeteer";

let csrfToken: string | null = null;

export const checkLogged = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.accessToken;

  if (!token) {
    res.sendStatus(401); // Unauthorized if no token is present
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any) => {
    if (err) {
      res.sendStatus(401); // Unauthorized if token verification fails
    } else {
      next();
    }
  });
};

export const createCSRFToken = (req: Request, res: Response): void => {
  csrfToken = req.csrfToken(); // Generate a new CSRF token

  res.send({ csrfToken });
};

export const checkCSRFToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (
    !csrfToken ||
    !req.headers["x-csrf-token"] ||
    csrfToken !== req.headers["x-csrf-token"]
  ) {
    res.sendStatus(403);
    return;
  }
  next();
};

interface Activity {
  title: string;
  address: string;
  link: string;
}

export const getActivities = async (
  _: Request,
  res: Response
): Promise<void> => {
  const browser = await puppeteer.launch({
    executablePath: process.env.NODE_ENV === "production" ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath(),
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Necessary for some server environments like Render.com
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
};
