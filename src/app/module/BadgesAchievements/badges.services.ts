import { Types } from "mongoose";
import { Badges } from "./badges.model";

const getUserBadgesStatus = async (userId: string) => {
    const userObjectId = new Types.ObjectId(userId);

    const result = await Badges.aggregate([
        // 🔗 lookup completed badges
        {
            $lookup: {
                from: "complitedcourses",
                let: { badgeId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$badgesId", "$$badgeId"] },
                                    { $eq: ["$userId", userObjectId] }
                                ]
                            }
                        }
                    }
                ],
                as: "userBadge"
            }
        },

        // 🏷️ user has badge or not
        {
            $addFields: {
                hasBadge: { $gt: [{ $size: "$userBadge" }, 0] }
            }
        },

        // 📦 group everything
        {
            $group: {
                _id: null,
                totalBadges: { $sum: 1 },
                earnedBadges: {
                    $push: {
                        $cond: [
                            "$hasBadge",
                            {
                                _id: "$_id",
                                name: "$name",
                                points: "$points",
                                logo: "$logo"
                            },
                            "$$REMOVE"
                        ]
                    }
                },
                notEarnedBadges: {
                    $push: {
                        $cond: [
                            { $eq: ["$hasBadge", false] },
                            {
                                _id: "$_id",
                                name: "$name",
                                points: "$points",
                                logo: "$logo"
                            },
                            "$$REMOVE"
                        ]
                    }
                }
            }
        },

        // 📊 final shape
        {
            $project: {
                _id: 0,
                totalBadges: 1,
                earnedBadges: 1,
                notEarnedBadges: 1,
                earnedCount: { $size: "$earnedBadges" }
            }
        }
    ]);

    return result[0];
};


export const badgesServices = {
    getUserBadgesStatus
}