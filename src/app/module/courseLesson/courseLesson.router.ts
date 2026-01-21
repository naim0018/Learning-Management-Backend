import { Router } from "express";
import { LessionController } from "./courseLesson.controller";
import { multerUpload } from "../../config/multer.config";
import { checkAuths } from "../../middleware/protect";
import { IRole } from "../user/user.interface";

const LessionRouter = Router();


LessionRouter.post("/create", checkAuths(IRole.ADMIN), multerUpload.fields([
    { name: 'scorm', maxCount: 1 },  // SCORM .zip ফাইলের জন্য
    { name: 'video', maxCount: 1 },  // ভিডিও ফাইলের জন্য
    { name: 'audio', maxCount: 1 },  // অডিও ফাইলের জন্য
    { name: 'pdf', maxCount: 1 },    // PDF ফাইলের জন্য
    { name: 'image', maxCount: 1 },  // চিত্র ফাইলের জন্য
]), LessionController.createLesson);




LessionRouter.patch("/update/lession/info", checkAuths(IRole.ADMIN), checkAuths(), LessionController.updateLessonContent);
LessionRouter.patch("/delete/lession", checkAuths(IRole.ADMIN), checkAuths(), LessionController.deleteLesson);

LessionRouter.patch("/:courseId/:moduleId/:lessonId/content", checkAuths(), multerUpload.fields([
    { name: 'scorm', maxCount: 1 },  // SCORM .zip ফাইলের জন্য
    { name: 'video', maxCount: 1 },  // ভিডিও ফাইলের জন্য
    { name: 'audio', maxCount: 1 },  // অডিও ফাইলের জন্য
    { name: 'pdf', maxCount: 1 },    // PDF ফাইলের জন্য
    { name: 'image', maxCount: 1 },  // চিত্র ফাইলের জন্য
]), LessionController.updateLessonContentVideo);

export default LessionRouter;