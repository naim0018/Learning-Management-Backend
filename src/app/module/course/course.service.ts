import { Types } from "mongoose";
import AppError from "../../utils/AppError";
import { UserCourseProgress } from "../userCourseProgress/UserCourseProgress.model";
import { ICourse, IUpCourse } from "./course.interface";
import { Course } from "./course.model";

const createCourse = async (payload: ICourse) => {
    const requiredFields = [
        "title",
        "description",
        "thumbnail",
        "category",
        "prices",
        "courseTag",
        "whatsUserLearn",
        "instructorName",
        "instructorTitle",
        "instructorDescription",
        "instructorProfile",
    ];

    for (const field of requiredFields) {
        if (!payload[field as keyof ICourse]) {
            throw new AppError(400, `Field "${field}" is required`);
        }
    }

    const course = await Course.create(payload);
    return course;
};

const updateCourse = async (courseId: Types.ObjectId, payload: Partial<IUpCourse>) => {
    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        { $set: payload },
        { new: true, runValidators: true }
    );

    return updatedCourse;
};



const getCourseBasicInfoById = async (courseId: string) => {
    if (!Types.ObjectId.isValid(courseId)) {
        throw new Error("Invalid course ID");
    }

    const course = await Course.findById(courseId);
    if (!course) return null;

    // total modules
    const totalModules = course.modules?.length || 0;

    // total lessons and total duration
    let totalLessons = 0;
    let totalDuration = 0;

    if (course.modules && course.modules.length > 0) {
        course.modules.forEach(module => {
            if (module.lessons && module.lessons.length > 0) {
                totalLessons += module.lessons.length;
                totalDuration += module.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);
            }
        });
    };


    return {
        ...course.toObject(), // database থেকে আসা সব info 그대로
        totalModules,
        totalLessons,
        totalDuration
    };
};


export const courseServices = {
    createCourse,
    updateCourse,
    getCourseBasicInfoById
}