import { Types } from "mongoose";

export enum IPaymentStauts {
    FREE = "FREE",
    PAID = "PAID",
    CANCEL = "CANCEL",
    UNPAID = "UNPAID"
};


export interface IEnroll {
    userId: Types.ObjectId,
    courseId: Types.ObjectId,
    courseName : String
    amount: Number,
    paymentStatus: IPaymentStauts
}