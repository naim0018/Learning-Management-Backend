import { Router } from "express";
import { userCourseProgresssController } from "./UserCourseProgress.controller";
import { checkAuths } from "../../middleware/protect";

const userCourseProgressRouter = Router();

userCourseProgressRouter.post("/create", checkAuths(), userCourseProgresssController.createProgress);
userCourseProgressRouter.get("/getCourseProgress/:courseId/:userId", checkAuths(), userCourseProgresssController.getProgressSingleCourse);
userCourseProgressRouter.patch("/complite/lession/:courseId/:lessonId/:userId", checkAuths(), userCourseProgresssController.compliteLession);

export default userCourseProgressRouter;