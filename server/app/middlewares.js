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
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const url =
    "https://www.tourisme-couserans-pyrenees.com/carnet-dadresses/quoi-faire-sur-place/activites-sportives-et-loisirs-2/activites-sportives-et-loisirs/";

  await page.goto(url);

  const getActivities = async () => {
    return await page.evaluate(() => {
      const list = [];
      const activities = document.querySelectorAll(".wpetOffer");

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
  let pageNumber = 2;

  while (await page.$(".wpetOffer")) {
    list.push(await getActivities());
    await page.goto(`${url}/page/${pageNumber}`);
    pageNumber++;
  }

  await browser.close();

  res.status(200).json({ data: list.flat() });
};

module.exports = {
  checkLogged,
  createCSRFToken,
  checkCSRFToken,
  getActivities,
};
