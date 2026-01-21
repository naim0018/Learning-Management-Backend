import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { RecentActivity } from "./recent.activity.model";
import { sendResponse } from "../../utils/sendResponse";


export const getRecentActivity = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await RecentActivity.find({}).sort("-createdAt").limit(5);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Activity Retrived Success",
        data: result
    })

})