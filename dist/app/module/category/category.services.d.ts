import mongoose from "mongoose";
import { ICourseCategory } from "./category.interface";
export declare const categoryServices: {
    createCourseCategory: (payload: ICourseCategory) => Promise<mongoose.Document<unknown, {}, ICourseCategory, {}, {}> & ICourseCategory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllCourseCategories: () => Promise<(mongoose.Document<unknown, {}, ICourseCategory, {}, {}> & ICourseCategory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    updateCourseCategory: (id: string, payload: Partial<ICourseCategory>) => Promise<(mongoose.Document<unknown, {}, ICourseCategory, {}, {}> & ICourseCategory & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=category.services.d.ts.map