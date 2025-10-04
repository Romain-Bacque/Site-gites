"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivities = exports.checkCSRFToken = exports.createCSRFToken = exports.checkLogged = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const puppeteer_1 = __importDefault(require("puppeteer"));
let csrfToken = null;
const checkLogged = (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) {
        res.sendStatus(401); // Unauthorized if no token is present
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) {
            res.sendStatus(401); // Unauthorized if token verification fails
        }
        else {
            next();
        }
    });
};
exports.checkLogged = checkLogged;
const createCSRFToken = (req, res) => {
    csrfToken = req.csrfToken(); // Generate a new CSRF token
    res.send({ csrfToken });
};
exports.createCSRFToken = createCSRFToken;
const checkCSRFToken = (req, res, next) => {
    if (!csrfToken ||
        !req.headers["x-csrf-token"] ||
        csrfToken !== req.headers["x-csrf-token"]) {
        res.sendStatus(403);
        return;
    }
    next();
};
exports.checkCSRFToken = checkCSRFToken;
const getActivities = async (_, res) => {
    const browser = await puppeteer_1.default.launch({
        executablePath: process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer_1.default.executablePath(),
        headless: true,
        args: [
            "--no-sandbox", // Disables the Chrome sandbox security feature. This is often required in restricted environments (like some CI/CD pipelines or Docker containers) where the sandbox can't run properly. Note: Disabling the sandbox reduces security.
            "--disable-setuid-sandbox", // Disables the setuid sandbox, another security layer. Used when the process can't gain the necessary privileges to run the sandbox.
            "--single-process", // Runs Chrome in a single process. This can help with resource usage in constrained environments.
            "--no-zygote", // Disables the zygote process, which is responsible for spawning new Chrome processes. This can help with compatibility in some environments.
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
};
exports.getActivities = getActivities;
