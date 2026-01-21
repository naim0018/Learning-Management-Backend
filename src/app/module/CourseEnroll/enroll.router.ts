import { Router } from "express";
import { enrollController } from "./enroll.controller";
import { checkAuths } from "../../middleware/protect";

const enrollRouter = Router();



enrollRouter.post("/create", checkAuths(), enrollController.enrollCourse);



export default enrollRouter;