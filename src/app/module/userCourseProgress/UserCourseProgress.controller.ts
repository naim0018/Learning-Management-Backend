import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { UserCourseProgressServices } from "./UserCourseProgress.services";
import { sendResponse } from "../../utils/sendResponse";




const createProgress = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, userId } = req.body;
    // const userId = req.authUser._id;

    const data = await UserCourseProgressServices.createProgressForUser(userId, courseId);

    res.json({
        success: true,
        message: "Progress initialized",
        data
    });
});



const getProgressSingleCourse = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { courseId, userId } = req.params;
    // const userId = req.authUser._id;

    const data = await UserCourseProgressServices.getProgressSingleCourse(userId as string, courseId as string);

    res.json({
        success: true,
        message: "Lesson completed",
        data
    });
});

const compliteLession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const userId = req.authUser._id;
    const { courseId, lessonId, userId } = req.params;
    const result = await UserCourseProgressServices.completeLesson(userId as string, courseId as string, lessonId as string);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Lession Complited",
        data: result
    })

});


export const userCourseProgresssController = {
    createProgress,
    getProgressSingleCourse,
    compliteLession
}