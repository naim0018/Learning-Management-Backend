import { model, Schema } from "mongoose";


const recentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
    expires: "7d"
});


export const RecentActivity = model("RecentActivity", recentSchema);