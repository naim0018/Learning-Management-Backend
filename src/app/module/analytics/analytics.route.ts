import { Router } from "express";
import { checkAuths } from "../../middleware/protect";
import { analyticsController } from "./analytics.controller";
import { IRole } from "../user/user.interface";

const analyticsRouter = Router();



analyticsRouter.get("/admin/analytics", checkAuths(IRole.ADMIN), analyticsController.adminAnalytics);
analyticsRouter.get("/user/analytics", checkAuths(), analyticsController.userAnalyticsData);




export default analyticsRouter;