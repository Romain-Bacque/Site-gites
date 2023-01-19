const jwt = require("jsonwebtoken");
const puppeteer = require("puppeteer");

const checkLogged = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
    if (err) {
      res.status(401).json({
        message: "access unauthorized",
      });
    } else next();
  });
};

const getActivities = async (req, res) => {
  // const { url } = req.query;
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(
    "https://www.tourisme-couserans-pyrenees.com/carnet-dadresses/quoi-faire-sur-place/activites-sportives-et-loisirs-2/activites-sportives-et-loisirs/"
  );

  const paginationButtons = await page.$$(".pagination .page-numbers");
  let list = [];

  const getActivitiesList = async () => {
    await page.evaluate(() => {
      const list = [];

      const activitiesList = document.querySelectorAll(".wpetOffer");

      for (const activity of activitiesList) {
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
      console.log(list);
      return list;
    });
  };

  if (paginationButtons && paginationButtons.length) {
    for (let i = 0; i < paginationButtons.length; i++) {
      await paginationButtons[i].click();
      list.push(await getActivitiesList(paginationButtons));
    }
  } else list = await getActivitiesList(paginationButtons);
  console.log(list);
};

module.exports = {
  checkLogged,
  getActivities,
};
