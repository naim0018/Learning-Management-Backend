import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { ComplitedCourse } from "../ComplitedCourse/complited.course.model";
import { Types } from "mongoose";
import { Badges } from "./badges.model";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../utils/AppError";
import { badgesServices } from "./badges.services";
import { User } from "../user/user.model";


const getUserBadges = async (req: Request, res: Response) => {
    try {
        const userId = req.authUser?.userId;

        if (!userId) { return res.status(400).json({ success: false, message: "User ID not provided", }); }

        const badges = await ComplitedCourse.aggregate([
            // 1️⃣ Match user
            {
                $match: {
                    userId: new Types.ObjectId(userId),
                },
            },

            // 2️⃣ Join with Badge collection
            {
                $lookup: {
                    from: "badges",
                    localField: "badgesId",
                    foreignField: "_id",
                    as: "badgeDetails",
                },
            },

            // 3️⃣ Array → Object
            {
                $unwind: "$badgeDetails",
            },

            // 4️⃣ Only needed fields
            {
                $project: {
                    _id: 0,
                    courseCompliteDate: 1,
                    badge: "$badgeDetails",
                },
            },
        ]);

        res.status(200).json({
            success: true,
            message: "User badges retrieved successfully",
            data: badges,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get user badges",
            error,
        });
    }
};

const getAllBadgesByAdmin = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

        // total badges
        const totalBadges = await Badges.countDocuments();

        // 1️⃣ Badge details + koy jon user paise
        const allBadges = await Badges.aggregate([
            {
                $lookup: {
                    from: "complitedcourses",
                    localField: "_id",
                    foreignField: "badgesId",
                    as: "earnedBy",
                },
            },
            {
                $addFields: {
                    earnedCount: { $size: "$earnedBy" },
                },
            },
            {
                $project: {
                    earnedBy: 0,
                },
            },
        ]);

        // 2️⃣ Top 10 users → sob theke beshi badge paise
        const topBadgeUsers = await ComplitedCourse.aggregate([
            {
                $group: {
                    _id: "$userId",
                    totalBadges: { $sum: 1 },
                },
            },
            { $sort: { totalBadges: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 0,
                    userId: "$user._id",
                    name: "$user.name",
                    email: "$user.email",
                    totalBadges: 1,
                },
            },
        ]);

        // 3️⃣ 🔥 Badge-wise user count (summary only)
        const badgeUserCounts = await ComplitedCourse.aggregate([
            {
                $group: {
                    _id: "$badgesId",
                    totalUsers: { $addToSet: "$userId" },
                },
            },
            {
                $project: {
                    totalUsers: { $size: "$totalUsers" },
                },
            },
            {
                $lookup: {
                    from: "badges",
                    localField: "_id",
                    foreignField: "_id",
                    as: "badge",
                },
            },
            { $unwind: "$badge" },
            {
                $project: {
                    _id: 0,
                    badgeId: "$badge._id",
                    badgeTitle: "$badge.title",
                    userCount: "$totalUsers",
                },
            },
        ]);

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Badges statistics retrieved successfully",
            data: {
                totalBadges,        // মোট কয়টা badge
                allBadges,          // badge details + earnedCount
                badgeUserCounts,    // 🔥 kon badge koy jon paise
                topBadgeUsers,      // 🔥 top 10 users
            },
        });
    }
);

const updatebadges = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!id) {
        return next(
            new AppError(400, "Badge id is required")
        );
    }

    const updateData: { name?: string; logo?: string } = {};


    if (name) {
        updateData.name = name;
    }

    if (req.file) {
        updateData.logo = req.file.path;
    }

    if (!name && !req.file) {
        return next(
            new AppError(
                400,
                "Nothing to update (name or logo required)"
            )
        );
    }

    const updatedBadge = await Badges.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedBadge) {
        return next(
            new AppError(404, "Badge not found")
        );
    }

    res.status(200).json({
        success: true,
        message: "Badge name/logo updated successfully",
        data: updatedBadge,
    });
}
);


const getUserBadgesAndLockedBadges = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.authUser.userId;

    const result = await badgesServices.getUserBadgesStatus(userId);
    const user = await User.findById(userId);

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User badges retrived successfully",
        data: {
            totalPoient: user?.totalPoints,
            ...result,
        }
    })

})

export const badgesController = {
    getUserBadges,
    getAllBadgesByAdmin,
    updatebadges,
    getUserBadgesAndLockedBadges
}