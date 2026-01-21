import { Router } from "express";
import { supportController } from "./support.controller";
import { checkAuths } from "../../middleware/protect";
import { IRole } from "../user/user.interface";

const supportRouter = Router();

supportRouter.post("/create", checkAuths(), supportController.createSupport);
supportRouter.get("/getAllSupport", checkAuths(IRole.ADMIN), supportController.getAllSupport);
supportRouter.patch("/update/:supportId", checkAuths(IRole.ADMIN), supportController.updateSupportStatus);

export default supportRouter;