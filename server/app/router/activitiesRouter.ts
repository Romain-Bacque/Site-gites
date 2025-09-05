import { Router } from "express";
import { getActivities } from "../middlewares";
import catchAsync from "../utilities/catchAsync";

const router = Router();

router.get("/", catchAsync(getActivities));

export default router;
