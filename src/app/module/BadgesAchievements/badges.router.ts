import { Router } from "express";
import { checkAuths } from "../../middleware/protect";
import { badgesController } from "./badges.controller";
import { IRole } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";

const badgesRouter = Router();

badgesRouter.get("/getAllBadgesByUser", checkAuths(), badgesController.getUserBadges);
badgesRouter.get("/getAllBadgesByAdmin", checkAuths(IRole.ADMIN), badgesController.getAllBadgesByAdmin);
badgesRouter.get("/getTotalBadgesByUser", checkAuths(), badgesController.getUserBadgesAndLockedBadges);
badgesRouter.patch("/updateBadges/:id", checkAuths(IRole.ADMIN), multerUpload.single("logo"), badgesController.updatebadges);

export default badgesRouter;