import mongoose, { Schema } from "mongoose";

const UserCourseProgressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    courseProgress: {
      type: Number,
      default: 0,
    },
    modules: [
      {
        moduleId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        progress: {
          type: Number,
          default: 0,
        },
        completedLessons: {
          type: [Schema.Types.ObjectId],
          default: [],
        },
      },
    ],
  },
  { timestamps: true }
);

export const UserCourseProgress = mongoose.model(
  "UserCourseProgress",
  UserCourseProgressSchema
);
