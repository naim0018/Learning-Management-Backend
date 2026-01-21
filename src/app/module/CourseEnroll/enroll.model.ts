import mongoose, { Schema } from "mongoose";
import { IEnroll } from "./enroll.interface";

const enrollSchema = new mongoose.Schema<IEnroll>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    courseName : {
        type : String,
        required : true
    },
    amount: {
        type: Number
    },
    paymentStatus: {
        type: String,
        enum: ["FREE", "PAID", "CANCLE", "UNPAID"]
    }
}, {
    timestamps: true
});


export const Enroll = mongoose.model<IEnroll>("enroll", enrollSchema);