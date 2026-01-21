import { model, Schema, Types } from "mongoose";
import { required } from "zod/v4-mini";


const complitedCourseSchema = new Schema({
    courseCompliteDate: {
        type: Date,
        default: Date.now()
    },
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    badgesId: {
        type: Types.ObjectId,
        ref: "Badge",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});


export const ComplitedCourse = model("ComplitedCourse", complitedCourseSchema); 