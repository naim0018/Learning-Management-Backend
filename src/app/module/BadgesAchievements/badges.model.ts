import mongoose, { Schema, Types } from "mongoose";

export interface IBadge {
    _id: Types.ObjectId,
    name: string;
    type: "Badge" | "Achievement";
    triggerEvent: string;
    conditions: string[];
    points: number;
    logo?: string
}

const BadgeSchema: Schema = new Schema<IBadge>({
    name: { type: String, required: true },
    type: { type: String, enum: ["Badge", "Achievement"], required: true },
    triggerEvent: { type: String, required: true },
    conditions: { type: [String], required: true },
    points: { type: Number, required: true },
    logo: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export const Badges = mongoose.model<IBadge>("Badge", BadgeSchema);