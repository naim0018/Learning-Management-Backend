import { Types } from "mongoose";
import { Enroll } from "./enroll.model";
import AppError from "../../utils/AppError";
import { User } from "../user/user.model";
import { UserCourseProgressServices } from "../userCourseProgress/UserCourseProgress.services";

const enrollCourse = async (data: { userId: Types.ObjectId, courseId: Types.ObjectId, courseName: string }) => {

    const findUser = await User.findById(data.userId);

    if (!findUser) throw new AppError(400, "User not found");

    const checkCourse = findUser?.enrollCourse?.some((course) => course?.courseId.toString() === data.courseId.toString());

    if (checkCourse) throw new AppError(400, "Already this course enroll");


    const enroll = await Enroll.create({
        userId: data.userId,
        courseId: data.courseId,
        courseName: data.courseName
    });

    if (!enroll) throw new AppError(400, "Enroll faild");


    findUser?.enrollCourse?.push({
        courseId: data.courseId
    });

    findUser.save();

    await UserCourseProgressServices.createProgressForUser(String(data.userId), String(data.courseId));

    return enroll

};


export const enrollServices = {
    enrollCourse
}