import { Router } from "express";
import { checkAuths } from "../../middleware/protect";
import { getRecentActivity } from "./recent.activity.controller";

const RecentActivityRouter = Router();



RecentActivityRouter.get("/getAllRecentActivity", checkAuths(), getRecentActivity);



export default RecentActivityRouter;