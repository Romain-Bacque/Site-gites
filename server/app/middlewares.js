const jwt = require("jsonwebtoken");
const puppeteer = require("puppeteer");

let csrfToken = null;

const checkLogged = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
    if (err) {
      res.status(401).json({
        message: "access unauthorized",
      });
    } else next();
  });
};

const createCSRFToken = (req, res) => {
  csrfToken = req.csrfToken();
  res.send({ csrfToken });
};

const checkCSRFToken = (req, res, next) => {
  if (
    !csrfToken ||
    !req.headers["x-csrf-token"] ||
    csrfToken !== req.headers["x-csrf-token"]
  ) {
    return res.sendStatus(403);
  }
  next();
};
const getActivities = async (_, res) => {
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();
  const baseUrl =
    "https://www.tourisme-couserans-pyrenees.com/carnet-dadresses/quoi-faire-sur-place/activites-sportives-et-de-loisirs/activites-sportives-et-loisirs";
  let pageNumber = 2;
  let hasNextPage = true;

  const getActivitiesList = async () => {
    return await page.evaluate(() => {
      const list = [];
      const activities = document.querySelectorAll(".wpetOffer");

      if (activities.length === 0) return null;

      for (const activity of activities) {
        list.push({
          title: activity.querySelector(".wpetOfferContainerContent > h3 > a")
            .innerText,
          address: activity.querySelector(
            ".wpetOfferContainerContent > div > span"
          ).innerText,
          link: activity.querySelector(".wpetOfferContainerContent > h3 > a")
            .href,
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
      // If no activities found on the page, stop looping
      hasNextPage = false;
    } else {
      list.push(...activitiesOnPage);
      console.log(list);

      pageNumber++;
    }
  }

  await browser.close();

  res.status(200).json({ data: list });
};

module.exports = {
  checkLogged,
  createCSRFToken,
  checkCSRFToken,
  getActivities,
};
