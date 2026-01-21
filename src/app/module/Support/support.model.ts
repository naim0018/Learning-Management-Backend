import { model, Schema } from "mongoose";


const supportSchema = new Schema({
    userEmail: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    problemDescription: {
        type: String,
        required: true
    },
    solveStatus: {
        type: String,
        enum: ["Pending", "Resolve"],
        default: "Pending"
    },
    replay: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false,

});


export const Support = model("Support", supportSchema);